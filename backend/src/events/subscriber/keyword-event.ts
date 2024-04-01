import { DataSource, EntityManager } from 'typeorm';
import { connect } from '../../db-connection';

import { GoogleScraper, SearchResult } from '../../services/external/google-scraper';
import { RedisStorage } from '../../services/redis';
import { REDIS_URL } from '../../config';
import { KeywordEventTypes } from '../enum';
import { KeywordService } from '../../services/keyword';
import { IKeywordBulkCreateRequest } from '../../interfaces/keyword';

import { KeywordRepository } from '../../libs/typeorm/repository/keyword';
import { UserRepository } from '../../libs/typeorm/repository/user';

// import events from '../index';

const redisConfig = {
    redisURL: REDIS_URL as string
};

interface Response {
    userId: string;
    keywords: string[];
}

interface scrapeResult {
    userId: string;
    searchResult: SearchResult[];
}

export class KeywordEventSubscriber {
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
        this.keywordRepo = new KeywordRepository(dataSource as unknown as EntityManager);
        this.userRepo = new UserRepository(dataSource);

        this.keywordService = new KeywordService(this.keywordRepo, this.userRepo);
    }

    private async initializeRedis(): Promise<void> {
        if (!this.redis.initialized()) {
            await this.redis.init();
        }
    }

    private async bulkInsertKeywords(payload: IKeywordBulkCreateRequest, userId: string): Promise<number | Error> {
        const keywordsCreatedNum = await this.keywordService.bulkInsertKeywords(payload, userId);
        return keywordsCreatedNum.numSaved;
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
                console.log(`start at: ${new Date().toLocaleTimeString()}`);
                const cleansed: Response = JSON.parse(message);
                const scrapeResult: scrapeResult = {
                    userId: cleansed.userId,
                    searchResult: []
                };

                await Promise.all(
                    cleansed.keywords.map(async (keyword) => {
                        try {
                            const result: SearchResult = await this.googleScraper.scrape(keyword);
                            scrapeResult.searchResult.push(result);
                        } catch (error) {
                            console.error(`Error while scraping keyword "${keyword}":`, error);
                        }
                    })
                );

                // TODO: publish keywords_scraped event
                // events.emit(KeywordEventTypes.keywordsScraped, { userId: scrapeResult.userId, totalKeywords: cleansed.keywords.length })

                const keywordEntities: IKeywordBulkCreateRequest = {
                    user_id: scrapeResult.userId,
                    keywords: scrapeResult.searchResult.map((result) => ({
                        value: result.keyword || '',
                        num_of_links: result.numLinks,
                        num_of_adwords: result.numAdwords,
                        search_result_information: result.totalResultsText || '',
                        html_code: result.htmlContent || ''
                    }))
                };

                const total = await this.bulkInsertKeywords(keywordEntities, scrapeResult.userId);

                console.log(`stop at: ${new Date().toLocaleTimeString()} for ${total}`);
            });
        } catch (err) {
            // TODO: publish error event
            console.log(`Error while scraping ${err}`);
        }
    }
}

const startSubscriber = async () => {
    const dataSource = await connect();
    if (!dataSource) {
        throw new Error('Failed to initialize DB from subscriber');
    }

    const subscriber = new KeywordEventSubscriber(dataSource);

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
