import axios from 'axios';
import cheerio from 'cheerio';
import { userAgentList } from './user-agent-list';

const baseURL = 'https://www.google.com/search';

interface SearchResult {
    numLinks: number;
    numAdwords: number;
    totalResultsText: string | null;
    keyword: string;
}

export class GoogleScraper {
    private userAgent: string;

    constructor() {
        this.userAgent = this.getRandomUserAgent();
    }

    private getRandomUserAgent(): string {
        const index = Math.floor(Math.random() * userAgentList.length);
        return userAgentList[index];
    }

    async scrape(keyword: string): Promise<SearchResult> {
        try {
            const searchUrl = `${baseURL}?q=${encodeURIComponent(keyword)}&hl=en&lr=lang_en`;
            const response = await axios.get(searchUrl, {
                headers: {
                    'User-Agent': this.userAgent
                }
            });

            const $ = cheerio.load(response.data);

            const numLinks = $('div.g').length;
            const numAdwords = $('div.ads-ad').length;
            const totalResultsText = $('#result-stats').text();

            return {
                numLinks,
                numAdwords,
                totalResultsText: totalResultsText || null,
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
        }
    }
}
