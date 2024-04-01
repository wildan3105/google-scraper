import { DataSource } from 'typeorm';
import { connect } from '../../db-connection';

import { GoogleScraper, SearchResult } from '../../services/external/google-scraper';
import { RedisStorage } from '../../services/redis';
import { REDIS_URL } from '../../config';
import { KeywordEventTypes } from '../enum';
import { KeywordService } from '../../services/keyword';
import { IKeywordCreateRequest } from '../../interfaces/keyword';

import { KeywordRepository } from '../../libs/typeorm/repository/keyword';
import { UserRepository } from '../../libs/typeorm/repository/user';

const redisConfig = {
    redisURL: REDIS_URL as string
};

interface Response {
    userId: string;
    keywords: string[];
}

export class KeywordEventListener {
    private dataSource: DataSource;

    private keywordRepo: KeywordRepository;
    private userRepo: UserRepository;

    private keywordService: KeywordService;

    private googleScraper: GoogleScraper;
    private redis: RedisStorage;

    constructor(dataSource: DataSource) {
        this.redis = new RedisStorage(redisConfig);
        this.googleScraper = new GoogleScraper();

        this.dataSource = dataSource;
        this.keywordRepo = new KeywordRepository(dataSource);
        this.userRepo = new UserRepository(dataSource);

        this.keywordService = new KeywordService(this.keywordRepo, this.userRepo);
    }

    private async initializeRedis(): Promise<void> {
        if (!this.redis.initialized()) {
            await this.redis.init();
        }
    }

    private async bulkCreateOrUpdateKeyword(userId: string, payload: Partial<IKeywordCreateRequest>): Promise<void> {
        const keyword = await this.keywordService.bulkInsertOrUpdate(payload, userId);
        console.log(keyword);
    }

    async stopListening(channel: string): Promise<void> {
        await this.redis.unsubscribe(channel);
    }

    async handleKeywordsUploadEvent(channel: string): Promise<void> {
        try {
            console.log(`Subscriber is listening on ${channel}`);
            await this.initializeRedis();
            await this.redis.subscribe(channel);
            this.redis.on('message', async (_, message) => {
                const cleansed: Response = JSON.parse(message);
                await Promise.all(
                    cleansed.keywords.map(async (keyword) => {
                        try {
                            const result: SearchResult = await this.googleScraper.scrape(keyword);
                            console.log(result);
                            await this.bulkCreateOrUpdateKeyword(cleansed.userId, {
                                value: keyword,
                                num_of_links: result.numLinks,
                                num_of_adwords: result.numAdwords,
                                html_code: result.htmlContent as string,
                                search_result_information: result.totalResultsText as string
                            });
                        } catch (error) {
                            console.error(`Error while scraping keyword "${keyword}":`, error);
                        }
                    })
                );
            });
        } catch (err) {
            console.log(`Error while scraping ${err}`);
        }
    }
}

const startSubscriber = async () => {
    const dataSource = await connect();
    if (!dataSource) {
        throw new Error('Failed to initialize DB from subscriber');
    }

    const subscriber = new KeywordEventListener(dataSource);

    await subscriber.handleKeywordsUploadEvent(KeywordEventTypes.keywordsUploaded);

    console.log(`subscriber started`);

    return async () => {
        console.log(`stopping subscriber`);
        await subscriber.stopListening(KeywordEventTypes.keywordsUploaded);
    };
};

(async () => {
    try {
        await startSubscriber();
    } catch (e) {
        console.log(`An error occurred`, e);
        process.exit(1);
    }
})();
