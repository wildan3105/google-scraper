export class KeywordEventListener {
    constructor() {}

    async handleKeywordsScraped(userId: string, totalKeywords: number): Promise<void> {
        try {
            console.log(`new event for ${userId} with keywords: ${totalKeywords}`);
        } catch (e) {
            console.error(`error when handling new user event ${e}`);
        }
    }
}
