import { DataSource, Repository } from 'typeorm';
import { Keyword } from '../../../domain/keyword-entity';
import { User } from '../../../domain/user-entity';
import { IKeywordCreateRequest } from '../../../interfaces/keyword';

export class KeywordRepository extends Repository<Keyword> {
    constructor(dataSource: DataSource) {
        super(Keyword, dataSource.createEntityManager());
    }

    async bulkInsertOrUpdate(payload: IKeywordCreateRequest, user: User): Promise<Keyword> {
        const keyword = new Keyword();

        keyword.value = payload.value;
        keyword.num_of_links = payload.num_of_links;
        keyword.num_of_adwords = payload.num_of_adwords;
        keyword.search_result_information = payload.search_result_information;
        keyword.html_code = payload.html_code;
        keyword.user = user;

        const createdKeyword = await this.save(keyword);

        return createdKeyword;
    }
}
