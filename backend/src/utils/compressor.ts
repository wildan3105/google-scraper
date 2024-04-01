import zlib from 'zlib';

export async function compressHtml(htmlContent: string): Promise<Buffer> {
    return zlib.gzipSync(htmlContent, { level: zlib.constants.Z_BEST_COMPRESSION });
}

export async function decompressHtml(compressedHtmlContent: Buffer): Promise<string> {
    return zlib.gunzipSync(compressedHtmlContent).toString();
}
