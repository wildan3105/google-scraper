import { Request } from 'express';
import csvParser from 'csv-parser';

import { ErrorCodes } from '../generated/error-codes';
import { StandardError } from '../utils/standard-error';

export class CSVService {
    constructor() {}

    async processCSV(req: Request): Promise<any | Error> {
        // Ensure that the request contains CSV content
        if (req.headers['content-type'] !== 'text/csv') {
            throw new StandardError(ErrorCodes.API_VALIDATION_ERROR, 'Invalid Content-Type. Must be text/csv.');
        }

        // Initialize an array to store the CSV data
        const csvData: any[] = [];

        // Parse the CSV content using csv-parser
        await new Promise<void | any[]>((resolve, reject) => {
            req.pipe(csvParser())
                .on('data', (row) => {
                    if (Object.keys(row)[0] !== 'keywords') {
                        reject(
                            new StandardError(ErrorCodes.API_VALIDATION_ERROR, 'First row must be equals to "keywords"')
                        );
                    }

                    // Process each row of the CSV data
                    const values = Object.values(row);
                    values.forEach((value) => {
                        const trimmedValue = (value as string).trim(); // Remove leading and trailing whitespace
                        if (trimmedValue !== '') {
                            csvData.push(trimmedValue); // Push trimmed value into the array
                        }
                    });
                })
                .on('end', () => {
                    // Handle the completion of CSV parsing
                    if (csvData.length === 0) {
                        reject(new StandardError(ErrorCodes.API_VALIDATION_ERROR, 'Keywords cannot be empty'));
                    }

                    console.log('CSV Data:', csvData);
                    if (csvData.length > 100) {
                        reject(new StandardError(ErrorCodes.API_VALIDATION_ERROR, 'Maximum keywords is 100'));
                    }
                    resolve(csvData);
                })
                .on('error', (error) => {
                    // Handle any errors that occur during CSV parsing
                    console.error('Error parsing CSV:', error);
                    reject(error);
                });
        });

        return csvData;
    }
}
