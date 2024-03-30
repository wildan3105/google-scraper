import { DataSource, FindOneOptions, Repository } from 'typeorm';
import { UserVerificationCode } from '../../../domain/user-verification-code-entity';
import { User } from '../../../domain/user-entity';
import { ICreateVerificationCode } from '../../../interfaces/user-verification-code';

export class UserVerificationCodeRepository extends Repository<UserVerificationCode> {
    constructor(dataSource: DataSource) {
        super(UserVerificationCode, dataSource.createEntityManager());
    }

    async createVerificationCode(verificationCode: ICreateVerificationCode, user: User): Promise<UserVerificationCode> {
        const newVerificationCode = new UserVerificationCode();

        newVerificationCode.code = verificationCode.code;
        newVerificationCode.expired_at = verificationCode.expired_at;
        newVerificationCode.user = user;

        const createdVerificationCode = await this.save(newVerificationCode);

        return createdVerificationCode;
    }

    async findOneByCode(code: string): Promise<UserVerificationCode | null> {
        const options: FindOneOptions<UserVerificationCode> = { where: { code }, relations: ['user'] };
        const verificationCode = await this.findOne(options);

        if (!verificationCode) {
            return null;
        }

        return verificationCode;
    }
}
