import { DataSource, EntityManager } from 'typeorm';
import { Server } from 'socket.io';
import express from 'express';
import http from 'http';

import { connect } from '../../db-connection';
import { GoogleScraper, SearchResult } from '../../services/external/google-scraper';
import { RedisStorage } from '../../services/redis';
import { REDIS_URL } from '../../config';
import { KeywordEventTypes } from '../enum';
import { KeywordService } from '../../services/keyword';
import { IKeywordBulkCreateRequest } from '../../interfaces/keyword';
import { KeywordRepository } from '../../libs/typeorm/repository/keyword';
import { UserRepository } from '../../libs/typeorm/repository/user';
import { SOCKET_PORT } from '../../config';

const socketEvents = {
    keywordsScrapedSuccessfully: 'keywords_scraped_succeed'
};

const redisConfig = {
    redisURL: REDIS_URL as string
};

interface Response {
    userId: string;
    keywords: string[];
}

interface scrapeResult {
    userId: string;
    userEmail: string | undefined;
    searchResult: SearchResult[];
}

export class KeywordEventSubscriber {
    private dataSource: DataSource;

    private keywordRepo: KeywordRepository;
    private userRepo: UserRepository;

    private keywordService: KeywordService;

    private googleScraper: GoogleScraper;
    private redis: RedisStorage;
    private io: Server;

    constructor(dataSource: DataSource, io: Server) {
        this.redis = new RedisStorage(redisConfig);
        this.googleScraper = new GoogleScraper();

        this.dataSource = dataSource;
        this.keywordRepo = new KeywordRepository(dataSource as unknown as EntityManager);
        this.userRepo = new UserRepository(dataSource);

        this.keywordService = new KeywordService(this.keywordRepo, this.userRepo);
        this.io = io;
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
                // get userEmail to make the event unique for socket clients
                const userEmail = (await this.userRepo.findOneByFilter({ id: cleansed.userId }))?.email;
                const scrapeResult: scrapeResult = {
                    userId: cleansed.userId,
                    userEmail,
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

                this.io.emit(socketEvents.keywordsScrapedSuccessfully, { userId: cleansed.userId, userEmail, total });

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

    const app = express();
    const server = http.createServer(app);
    const io = new Server(server);

    io.on('connection', () => {
        console.log(`client is connected!`);
    });

    const subscriber = new KeywordEventSubscriber(dataSource, io);

    await subscriber.handleKeywordsUploadEvent(KeywordEventTypes.keywordsUploaded);

    console.log(`subscriber started`);

    server.listen(SOCKET_PORT, () => {
        console.log(`listening on ${SOCKET_PORT}`);
    });

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
