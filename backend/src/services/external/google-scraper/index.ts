import puppeteer from 'puppeteer';
import { userAgentList } from './user-agent-list';

const baseURL = 'https://www.google.com/search';

interface SearchResult {
    numLinks: number;
    numAdwords: number;
    totalResultsText: string | null;
    keyword: string;
}

export class GoogleScraper {
    private browser: puppeteer.Browser | null = null;

    constructor() {}

    private async getBrowser(): Promise<puppeteer.Browser> {
        if (!this.browser) {
            this.browser = await puppeteer.launch();
        }
        return this.browser;
    }

    private getRandomUserAgent(): string {
        const index = Math.floor(Math.random() * userAgentList.length);
        return userAgentList[index];
    }

    async scrape(keyword: string): Promise<SearchResult> {
        const browser = await this.getBrowser();
        const page = await browser.newPage();

        try {
            const userAgent = this.getRandomUserAgent();
            await page.setUserAgent(userAgent);

            const searchUrl = `${baseURL}?q=${encodeURIComponent(keyword)}&hl=en&lr=lang_en`;
            await page.goto(searchUrl, { waitUntil: 'domcontentloaded' });

            await page.waitForSelector('div.g');

            const numLinks = (await page.$$eval('div.g', (links: string | any[]) => links.length)) || 0;
            const numAdwords = (await page.$$eval('div.ads-ad', (ads: string | any[]) => ads.length)) || 0;
            const totalResultsText = await page.$eval('#result-stats', (el: { textContent: any }) => el.textContent);

            return {
                numLinks,
                numAdwords,
                totalResultsText,
                keyword
            };
        } catch (error) {
            console.error(`Error while scraping keyword "${keyword}":`, error);
            return {
                numLinks: 0,
                numAdwords: 0,
                totalResultsText: null,
                keyword
            };
        } finally {
            await page.close();
        }
    }

    async close(): Promise<void> {
        if (this.browser) {
            await this.browser.close();
        }
    }
}
