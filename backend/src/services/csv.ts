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
                    csvData.push(...values); // Push each value into the array
                })
                .on('end', () => {
                    // Handle the completion of CSV parsing
                    console.log('CSV Data:', csvData);
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
