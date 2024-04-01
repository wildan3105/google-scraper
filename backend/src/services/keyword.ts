import { KeywordRepository } from '../libs/typeorm/repository/keyword';
import { UserRepository } from '../libs/typeorm/repository/user';
import { ErrorCodes } from '../generated/error-codes';
import { StandardError } from '../utils/standard-error';
import { IKeywordCreateRequest } from '../interfaces/keyword';

export class KeywordService {
    constructor(private readonly keywordRepo: KeywordRepository, private readonly userRepo: UserRepository) {}

    async bulkInsertOrUpdate(payload: IKeywordCreateRequest, userId: string): Promise<any | Error> {
        const existingUser = await this.userRepo.findOneByFilter({ id: userId });

        if (!existingUser) {
            throw new StandardError(ErrorCodes.USER_NOT_FOUND, 'User not found');
        }

        const createdKeyword = await this.keywordRepo.bulkInsertOrUpdate(payload, existingUser);
        return createdKeyword;
    }
}
