// redis.ts
import Redis from 'ioredis';
import { EventEmitter } from 'events';

interface IRedisConfig {
    redisURL: string;
}

export class RedisStorage extends EventEmitter {
    private readonly redisConfig: IRedisConfig;
    private redisClient: Redis | null = null;
    private isInitialized = false;

    constructor(redisConfig: IRedisConfig) {
        super();
        this.redisConfig = redisConfig;
    }

    public async init(): Promise<void> {
        this.redisClient = new Redis(this.redisConfig.redisURL);

        await this.setupListeners();
        await this.waitToConnect();
    }

    private async waitToConnect(): Promise<void> {
        return new Promise<void>((resolve) => {
            if (!this.redisClient) {
                throw new Error('Redis client not initialized');
            }

            this.redisClient.on('connect', () => {
                this.isInitialized = true;
                resolve();
            });
        });
    }

    private async setupListeners(): Promise<void> {
        if (!this.redisClient) {
            throw new Error('Redis client not initialized');
        }

        this.redisClient.on('error', (e) => {
            console.log(`An error occurred`, e);
        });
    }

    public async close(): Promise<void> {
        if (this.redisClient) {
            this.redisClient.quit();
        }
    }

    public initialized(): boolean {
        return this.isInitialized;
    }

    public async get(key: string): Promise<string | null> {
        if (!this.redisClient) {
            throw new Error('Redis client not initialized');
        }

        return this.redisClient.get(key);
    }

    public async set(key: string, value: string | number, ttl_value: number): Promise<string> {
        if (!this.redisClient) {
            throw new Error('Redis client not initialized');
        }

        return this.redisClient.set(key, value, 'EX', ttl_value);
    }

    public async publish(channel: string, message: string): Promise<number> {
        if (!this.redisClient) {
            throw new Error('Redis client not initialized');
        }

        return this.redisClient.publish(channel, message);
    }

    public async subscribe(channel: string): Promise<void> {
        if (!this.redisClient) {
            throw new Error('Redis client not initialized');
        }

        this.redisClient.subscribe(channel);
        this.redisClient.on('message', (channel: any, message: any) => {
            this.emit('message', channel, message);
        });
    }

    public async unsubscribe(channel: string): Promise<void> {
        if (!this.redisClient) {
            throw new Error('Redis client not initialized');
        }

        this.redisClient.unsubscribe(channel);
    }

    public async getTTL(key: string): Promise<number> {
        if (!this.redisClient) {
            throw new Error('Redis client not initialized');
        }

        return this.redisClient.ttl(key);
    }
}
