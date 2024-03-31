// keyword-event.ts
import { GoogleScraper } from '../../services/external/google-scraper';
import { RedisStorage } from '../../services/redis';
import { REDIS_URL } from '../../config';
import { KeywordEventTypes } from '../enum';

const redisConfig = {
    redisURL: REDIS_URL as string
};

interface Response {
    userId: string;
    keywords: string[];
}

export class KeywordEventListener {
    private googleScraper: GoogleScraper;
    private redis: RedisStorage;

    constructor() {
        this.redis = new RedisStorage(redisConfig);
        this.googleScraper = new GoogleScraper(); // Initialize GoogleScraper here
    }

    private async initializeRedis(): Promise<void> {
        if (!this.redis.initialized()) {
            await this.redis.init();
        }
    }

    async handleKeywordsUploadEvent(channel: string): Promise<void> {
        try {
            console.log(`Subscriber is listening on ${channel}`);
            await this.initializeRedis();
            await this.redis.subscribe(channel);
            this.redis.on('message', async (_, message) => {
                const cleansed: Response = JSON.parse(message);
                console.log(`At ${new Date().toLocaleTimeString()}`, cleansed);
                await Promise.all(
                    cleansed.keywords.map(async (keyword) => {
                        try {
                            const result = await this.googleScraper.scrape(keyword);
                            console.log(`Scraped result for keyword "${keyword}": ${result}`);
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

    async stopListening(channel: string): Promise<void> {
        await this.redis.unsubscribe(channel);
    }
}

const startSubscriber = async () => {
    const subscriber = new KeywordEventListener();

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
