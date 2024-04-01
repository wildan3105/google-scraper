import { KeywordRepository } from '../libs/typeorm/repository/keyword';
import { UserRepository } from '../libs/typeorm/repository/user';
import { ErrorCodes } from '../generated/error-codes';
import { StandardError } from '../utils/standard-error';
import { IKeywordBulkCreateRequest } from '../interfaces/keyword';

export class KeywordService {
    constructor(private readonly keywordRepo: KeywordRepository, private readonly userRepo: UserRepository) {}

    async bulkInsertKeywords(
        payload: IKeywordBulkCreateRequest,
        userId: string
    ): Promise<{ numSaved: number; error?: Error }> {
        const existingUser = await this.userRepo.findOneByFilter({ id: userId });

        if (!existingUser) {
            throw new StandardError(ErrorCodes.USER_NOT_FOUND, 'User not found');
        }

        const createdKeyword = await this.keywordRepo.bulkInsertKeywords(payload, existingUser);
        return createdKeyword;
    }
}
