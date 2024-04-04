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
            if (error instanceof QueryFailedError) {
                return { numSaved: totalSavedKeywords, error };
            }
            return { numSaved: totalSavedKeywords, error: new Error('An error occurred during bulk insert operation') };
        }
    }

    async getKeywords(userId: string, q?: string): Promise<any> {
        try {
            const queryBuilder = this.entityManager
                .createQueryBuilder(Keyword, 'keyword')
                .select(['keyword.id', 'keyword.value', 'keyword.created_at'])
                .where('keyword.user_id = :userId', { userId })
                .orderBy('keyword.created_at', 'DESC');

            if (q) {
                queryBuilder.andWhere('keyword.value LIKE :q', { q: `%${q}%` });
            }

            const keywords = await queryBuilder.getMany();
            return keywords;
        } catch (error) {
            throw new Error('Error occurred while fetching keywords: ');
        }
    }

    async getSingleKeyword(keywordId: string, userId: string): Promise<any> {
        try {
            const queryBuilder = this.entityManager
                .createQueryBuilder(Keyword, 'keyword')
                .select([
                    'keyword.id',
                    'keyword.value',
                    'keyword.num_of_links',
                    'keyword.num_of_adwords',
                    'keyword.search_result_information'
                ])
                .where('keyword.id = :keywordId', { keywordId })
                .andWhere('keyword.user_id = :userId', { userId });

            const singleKeyword = await queryBuilder.getOne();
            return singleKeyword;
        } catch (error) {
            console.log(error);
            throw new Error('Error occurred while fetching single keyword: ');
        }
    }

    async getKeywordHTMLContent(keywordId: string, userId: string): Promise<any> {
        try {
            const queryBuilder = this.entityManager
                .createQueryBuilder(Keyword, 'keyword')
                .select(['keyword.id', 'keyword.value', 'keyword.html_code'])
                .where('keyword.id = :keywordId', { keywordId })
                .andWhere('keyword.user_id = :userId', { userId });

            const singleKeyword = await queryBuilder.getOne();
            return singleKeyword;
        } catch (error) {
            throw new Error('Error occurred while fetching single keyword: ');
        }
    }
}
