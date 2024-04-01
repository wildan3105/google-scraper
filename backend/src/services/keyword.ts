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

    async getUserKeywords(requestedUserId: string, userId: string, q?: string): Promise<any> {
        if (requestedUserId !== userId) {
            throw new StandardError(ErrorCodes.UNAUTHORIZED, 'Not allow to see other user keyword');
        }

        const existingUser = await this.userRepo.findOneByFilter({ id: userId });

        if (!existingUser) {
            throw new StandardError(ErrorCodes.USER_NOT_FOUND, 'User not found');
        }

        // Fetch keywords from the repository
        const keywords = await this.keywordRepo.getKeywords(userId, q);

        // Create a map to store unique values of keywords
        const uniqueKeywordsMap = new Map<string, any>();

        // Iterate over the keywords array to filter out duplicates and keep the latest ones
        keywords.forEach((keyword: any) => {
            // Check if the value already exists in the map
            if (!uniqueKeywordsMap.has(keyword.value)) {
                // If not, add it to the map
                uniqueKeywordsMap.set(keyword.value, keyword);
            } else {
                // If it exists, compare the created_at dates
                const existingKeyword = uniqueKeywordsMap.get(keyword.value);
                if (existingKeyword.created_at < keyword.created_at) {
                    // If the current keyword is newer, update the existing value with the current one
                    uniqueKeywordsMap.set(keyword.value, keyword);
                }
            }
        });

        // Convert the unique values map back to an array
        const uniqueKeywords = Array.from(uniqueKeywordsMap.values());

        return uniqueKeywords;
    }

    async getUserSingleKeyword(requestedUserId: string, userId: string, keywordId: string): Promise<any> {
        if (requestedUserId !== userId) {
            throw new StandardError(ErrorCodes.UNAUTHORIZED, 'Not allow to see other user keyword');
        }

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

    async convertKeywordToHTML(requestedUserId: string, userId: string, keywordId: string): Promise<any> {
        if (requestedUserId !== userId) {
            throw new StandardError(ErrorCodes.UNAUTHORIZED, 'Not allow to see other user keyword');
        }

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
