import axios from 'axios';
import cheerio from 'cheerio';
import { userAgentList } from './user-agent-list';

import { compressHtml } from '../../../utils/compressor';

const baseURL = 'https://www.google.com/search';

export interface SearchResult {
    numLinks: number;
    numAdwords: number;
    totalResultsText: string | null;
    keyword: string | null;
    htmlContent: string | null;
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
            const links = $('a');
            const spans = $('span');

            let linkCount = 0;

            links.each((_, v) => {
                const linkHref = $(v).attr('href');

                if (linkHref && (linkHref.startsWith('http://') || linkHref.startsWith('https://'))) {
                    linkCount++;
                }
            });

            let numAdwords = 0;
            spans.each((_, span) => {
                const spanText = $(span).text();
                if (spanText && spanText.toLowerCase().includes('sponsored')) {
                    numAdwords++;
                }
            });
            const totalResultsText = $('#result-stats').text().trim();

            const htmlContent = response.data;

            const compressedHtmlContent = await compressHtml(htmlContent);

            return {
                numLinks: linkCount,
                numAdwords,
                totalResultsText: totalResultsText || null,
                keyword,
                htmlContent: compressedHtmlContent.toString('base64')
            };
        } catch (error) {
            console.error(`Error while scraping keyword "${keyword}":`, error);
            return {
                numLinks: 0,
                numAdwords: 0,
                totalResultsText: null,
                keyword,
                htmlContent: null
            };
        }
    }
}
