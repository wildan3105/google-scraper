import { EntityManager, QueryFailedError } from 'typeorm';
import { Keyword } from '../../../domain/keyword-entity';
import { User } from '../../../domain/user-entity';
import { IKeywordBulkCreateRequest } from '../../../interfaces/keyword';

export class KeywordRepository {
    constructor(private readonly entityManager: EntityManager) {}

    async bulkInsertKeywords(
        payload: IKeywordBulkCreateRequest,
        user: User
    ): Promise<{ numSaved: number; error?: Error }> {
        const { keywords } = payload;
        const batchSize = 100;
        let totalSavedKeywords = 0;

        try {
            for (let i = 0; i < keywords.length; i += batchSize) {
                const batchKeywords = keywords.slice(i, i + batchSize);
                await this.entityManager.transaction(async (transactionManager) => {
                    const keywordEntities = batchKeywords.map((keywordData) => {
                        const keyword = new Keyword();
                        keyword.value = keywordData.value;
                        keyword.num_of_links = keywordData.num_of_links;
                        keyword.num_of_adwords = keywordData.num_of_adwords;
                        keyword.search_result_information = keywordData.search_result_information;
                        keyword.html_code = keywordData.html_code;
                        keyword.user = user;
                        return keyword;
                    });
                    const savedKeywords = await transactionManager.save(Keyword, keywordEntities);
                    totalSavedKeywords += savedKeywords.length;
                });
            }

            return { numSaved: totalSavedKeywords };
        } catch (error) {
            // Check if the error is a QueryFailedError from TypeORM
            if (error instanceof QueryFailedError) {
                return { numSaved: totalSavedKeywords, error };
            }
            // Return other types of errors
            return { numSaved: totalSavedKeywords, error: new Error('An error occurred during bulk insert operation') };
        }
    }
}
