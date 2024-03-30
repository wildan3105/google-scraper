import { DataSource } from 'typeorm';
import { PostgresDriver } from 'typeorm/driver/postgres/PostgresDriver';
import { Pool } from 'pg';

import { sleep } from './libs/sleep';
import { OrmConfig } from './libs/typeorm/ormconfig';
import { IS_TEST } from './config';

// Handles unstable/intermittent connection lost to DB
function connectionGuard(connection: DataSource) {
    // Access underlying pg driver
    if (connection.driver instanceof PostgresDriver) {
        const pool = connection.driver.master as Pool;

        // Add handler on pool error event
        pool.on('error', async (err: any) => {
            console.error(`Connection pool erring out due to ${err}, Reconnecting...`);
            try {
                await connection.destroy();
            } catch (innerErr) {
                console.error(`Failed to close connection`);
            }
            while (!connection.isInitialized) {
                try {
                    await connection.initialize(); // eslint-disable-line
                    console.log(`Reconnected to the DB`);
                } catch (error) {
                    console.error(`Reconnection error due to ${error}`);
                }

                if (!connection.isInitialized) {
                    // Throttle retry
                    await sleep(500); // eslint-disable-line
                }
            }
        });
    }
}

// Retry connection initialization with a maximum number of attempts
export async function connect(maxAttempts = 10): Promise<DataSource | undefined> {
    let connection: DataSource | undefined;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            console.log(`Connecting to DB... Attempt ${attempt}`);
            const dataSource = new DataSource(OrmConfig);
            connection = await dataSource.initialize();
            if (connection.isInitialized) {
                console.log(`Connected to the DB`);
                connectionGuard(connection);
                return connection;
            }
        } catch (error) {
            console.error(`Connection attempt failed: ${error}`);
            if (IS_TEST) {
                throw error;
            }
        }

        // Throttle retry
        await sleep(500); // eslint-disable-line
    }

    console.error(`Maximum connection attempts reached. Unable to connect to the DB.`);
    return undefined;
}
