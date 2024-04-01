import axios from 'axios';
import cheerio from 'cheerio';
import { userAgentList } from './user-agent-list';
import zlib from 'zlib';
import fs from 'fs';
import path from 'path';

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

    private async saveHTML(htmlContent: string, keyword: string): Promise<string> {
        const fileName = `${keyword}.html`;
        const filePath = path.join(__dirname, fileName);

        try {
            await fs.promises.writeFile(filePath, htmlContent);
            return filePath;
        } catch (error) {
            console.error(`Error while saving HTML content for keyword "${keyword}":`, error);
            return '';
        }
    }

    private async compressHtml(htmlContent: string): Promise<Buffer> {
        return zlib.gzipSync(htmlContent, { level: zlib.constants.Z_BEST_COMPRESSION });
    }

    private async decompressHtml(compressedHtmlContent: Buffer): Promise<string> {
        return zlib.gunzipSync(compressedHtmlContent).toString();
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

            // const htmlSizeBeforeKB = Buffer.byteLength(htmlContent, 'utf8') / 1024;
            // console.log('Size of HTML content before compression:', htmlSizeBeforeKB.toFixed(2), 'KB');

            // Compress the HTML content
            const compressedHtmlContent = await this.compressHtml(htmlContent);

            // const htmlSizeAfterKB = Buffer.byteLength(compressedHtmlContent, 'utf8') / 1024;
            // console.log('Size of HTML content after compression:', htmlSizeAfterKB.toFixed(2), 'KB');

            // TODO: store compressed HTML content in postgres (possibly will be done in the caller). compress/decompress TBD
            // decompress to view the original

            return {
                numLinks: linkCount,
                numAdwords,
                totalResultsText: totalResultsText || null,
                keyword,
                htmlContent: compressedHtmlContent.toString('base64') // Convert to base64 to store binary data as string
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
