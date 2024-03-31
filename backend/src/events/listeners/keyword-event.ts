export class KeywordEventListener {
    constructor() {}

    async handleKeywordsUploadEvent(userId: string, keywords: string[]): Promise<void> {
        console.log(`incoming event for user ${userId} with the following keywords: ${keywords}`);
    }
}
