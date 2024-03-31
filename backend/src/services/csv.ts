import { Request } from 'express';
import csvParser from 'csv-parser';

import { ErrorCodes } from '../generated/error-codes';
import { StandardError } from '../utils/standard-error';
import events from '../events';
import { KeywordEventTypes } from '../events/enum';

export class CSVService {
    constructor() {}

    async processCSV(req: Request): Promise<any | Error> {
        // Ensure that the request contains CSV content
        if (req.headers['content-type'] !== 'text/csv') {
            throw new StandardError(ErrorCodes.API_VALIDATION_ERROR, 'Invalid Content-Type. Must be text/csv.');
        }

        const userId = req.userId;

        const uniqueKeywords: Set<string> = new Set();

        await new Promise<void | any[]>((resolve, reject) => {
            let rowCount = 0;

            req.pipe(csvParser())
                .on('data', (row) => {
                    rowCount++;
                    if (rowCount > 100) {
                        reject(
                            new StandardError(ErrorCodes.API_VALIDATION_ERROR, 'Maximum number of rows (100) exceeded')
                        );
                        return;
                    }

                    if (Object.keys(row)[0] !== 'keywords') {
                        reject(
                            new StandardError(ErrorCodes.API_VALIDATION_ERROR, 'First row must be equals to "keywords"')
                        );
                    }

                    const values = Object.values(row);
                    values.forEach((value) => {
                        const trimmedValue = (value as string).trim(); // Remove leading and trailing whitespace
                        if (trimmedValue !== '') {
                            uniqueKeywords.add(trimmedValue);
                        }
                    });
                })
                .on('end', () => {
                    if (Array.from(uniqueKeywords).length === 0) {
                        reject(new StandardError(ErrorCodes.API_VALIDATION_ERROR, 'Keywords cannot be empty'));
                    }

                    resolve(Array.from(uniqueKeywords));
                })
                .on('error', (error) => {
                    console.error('Error parsing CSV:', error);
                    reject(error);
                });
        });

        events.emit(KeywordEventTypes.keywordsUploaded, userId, Array.from(uniqueKeywords));

        return Array.from(uniqueKeywords);
    }
}
