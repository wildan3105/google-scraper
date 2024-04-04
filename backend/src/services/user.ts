import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import { UserRepository } from '../libs/typeorm/repository/user';
import { UserVerificationCodeRepository } from '../libs/typeorm/repository/user-verification-code';
import { ErrorCodes } from '../generated/error-codes';
import { StandardError } from '../utils/standard-error';
import { IUserCreateRequest, IUserCreateResponse, IUserLoginRequest, IUserLoginResponse } from '../interfaces/user';
import { TOKEN_SECRET_KEY } from '../config';
import { generateRandomCode, isValidCode } from '../utils/random-code-generator';

import events from '../events';
import { UserEventTypes } from '../events/enum';

const SEVEN_DAY_IN_MILIS = 7 * 24 * 60 * 60 * 1000;
const SALT_ROUNDS = 13;
const TOKEN_LIFETIME_IN_SECONDS = 43200; // 12 hours
const CODE_LENGTH = 255;

export class UserService {
    private readonly userRepo: UserRepository;
    private readonly userVerificationCodeRepo: UserVerificationCodeRepository;

    constructor(userRepo: UserRepository, userVerificationCodeRepo: UserVerificationCodeRepository) {
        this.userRepo = userRepo;
        this.userVerificationCodeRepo = userVerificationCodeRepo;
    }

    async create(user: IUserCreateRequest): Promise<IUserCreateResponse> {
        const filter = {
            email: user.email,
            is_active: true
        };

        const existingActiveUser = await this.userRepo.findOneByFilter(filter);

        if (existingActiveUser) {
            throw new StandardError(ErrorCodes.UNPROCESSABLE, `User with email: ${filter.email} is already active.`);
        }

        if (!isValidCode(user.password)) {
            throw new StandardError(
                ErrorCodes.API_VALIDATION_ERROR,
                'Password must contain at least 1 number, 1 uppercase letter and 1 lowercase letter.'
            );
        }

        user.password = bcrypt.hashSync(user.password, SALT_ROUNDS);

        const createdUser = await this.userRepo.save(user);

        const expiredAt = new Date(Date.now() + SEVEN_DAY_IN_MILIS);
        const code = generateRandomCode(CODE_LENGTH);
        const verificationCodeData = {
            expired_at: expiredAt,
            code,
            user_id: createdUser.id
        };

        await this.userVerificationCodeRepo.createVerificationCode(verificationCodeData, createdUser);

        if (createdUser) {
            events.emit(UserEventTypes.newUser, createdUser, verificationCodeData.code);
        }

        const userCreationResponse: IUserCreateResponse = {
            id: createdUser.id,
            email: createdUser.email,
            created_at: createdUser.created_at
        };

        return userCreationResponse;
    }

    async verify(code: string): Promise<boolean | Error> {
        if (code.length !== CODE_LENGTH || !isValidCode(code)) {
            throw new StandardError(
                ErrorCodes.API_VALIDATION_ERROR,
                'Code is invalid. Please check your verification code.'
            );
        }

        const verificationCode = await this.userVerificationCodeRepo.findOneByCode(code);
        if (!verificationCode) {
            throw new StandardError(ErrorCodes.USER_NOT_FOUND, 'Code is not found');
        }

        const now = new Date();
        if (now > verificationCode.expired_at) {
            throw new StandardError(ErrorCodes.CODE_EXPIRED, 'Code is already expired');
        }

        if (verificationCode.user.is_active) {
            throw new StandardError(ErrorCodes.CONFLICT, 'User is already active');
        }

        const updatedUser = await this.userRepo.updateUserToActive(verificationCode.user.id);

        if (!updatedUser) {
            throw new StandardError(ErrorCodes.USER_NOT_FOUND, 'User is not found');
        }

        events.emit(UserEventTypes.userActivated, updatedUser.email);

        return true;
    }

    async login(user: IUserLoginRequest): Promise<IUserLoginResponse> {
        const filter = {
            email: user.email,
            is_active: true
        };

        const userFoundAndActive = await this.userRepo.findOneByFilter(filter);
        if (!userFoundAndActive) {
            throw new StandardError(ErrorCodes.USER_NOT_FOUND, 'User is not found or inactive.');
        }

        const isPasswordCorrect = bcrypt.compareSync(user.password, userFoundAndActive.password);
        if (!isPasswordCorrect) {
            throw new StandardError(ErrorCodes.UNAUTHORIZED, 'Password is invalid.');
        }

        const token = jwt.sign(
            { id: userFoundAndActive.id, email: userFoundAndActive.email },
            TOKEN_SECRET_KEY as string,
            {
                algorithm: 'HS256',
                allowInsecureKeySizes: true,
                expiresIn: TOKEN_LIFETIME_IN_SECONDS
            }
        );

        return {
            id: userFoundAndActive.id,
            email: userFoundAndActive.email,
            access_token: token
        };
    }

    async logout(id: string): Promise<void> {
        events.emit('user_logout', { user_id: id });
    }
}
