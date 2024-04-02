import { KeywordRepository } from '../libs/typeorm/repository/keyword';
import { UserRepository } from '../libs/typeorm/repository/user';
import { ErrorCodes } from '../generated/error-codes';
import { StandardError } from '../utils/standard-error';
import { IKeywordBulkCreateRequest } from '../interfaces/keyword';
import { decompressHtml } from '../utils/compressor';

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

    async getUserKeywords(userId: string, q?: string): Promise<any> {
        const existingUser = await this.userRepo.findOneByFilter({ id: userId });

        if (!existingUser) {
            throw new StandardError(ErrorCodes.USER_NOT_FOUND, 'User not found');
        }

        const keywords = await this.keywordRepo.getKeywords(userId, q);

        const uniqueKeywordsMap = new Map<string, any>();

        keywords.forEach((keyword: any) => {
            if (!uniqueKeywordsMap.has(keyword.value)) {
                uniqueKeywordsMap.set(keyword.value, keyword);
            } else {
                const existingKeyword = uniqueKeywordsMap.get(keyword.value);
                if (existingKeyword.created_at < keyword.created_at) {
                    uniqueKeywordsMap.set(keyword.value, keyword);
                }
            }
        });

        const uniqueKeywords = Array.from(uniqueKeywordsMap.values());

        return uniqueKeywords;
    }

    async getUserSingleKeyword(userId: string, keywordId: string): Promise<any> {
        const existingUser = await this.userRepo.findOneByFilter({ id: userId });

        if (!existingUser) {
            throw new StandardError(ErrorCodes.USER_NOT_FOUND, 'User not found');
        }

        const keyword = await this.keywordRepo.getSingleKeyword(keywordId, userId);

        if (!keyword) {
            throw new StandardError(ErrorCodes.USER_NOT_FOUND, 'Keyword not found');
        }

        return {
            id: keyword.id,
            keyword: keyword.value,
            num_of_links: keyword.num_of_links,
            num_of_adwords: keyword.num_of_adwords,
            search_result_information: keyword.search_result_information
        };
    }

    async convertKeywordToHTML(userId: string, keywordId: string): Promise<any> {
        const existingUser = await this.userRepo.findOneByFilter({ id: userId });

        if (!existingUser) {
            throw new StandardError(ErrorCodes.USER_NOT_FOUND, 'User not found');
        }

        const keyword = await this.keywordRepo.getKeywordHTMLContent(keywordId, userId);

        if (!keyword) {
            throw new StandardError(ErrorCodes.USER_NOT_FOUND, 'Keyword not found');
        }

        const decompressedHTML = await decompressHtml(Buffer.from(keyword.html_code, 'base64'));

        return decompressedHTML;
    }
}
