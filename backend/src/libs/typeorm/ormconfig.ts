import { DataSourceOptions } from 'typeorm';
import { entities } from '../../libs/typeorm/entities';
import { migrations } from '../../libs/typeorm/migrations';

import { IS_PRODUCTION, IS_TEST, DATABASE_URL, APP_ENV } from '../../config';

export const OrmConfig = {
    logging: ['error'],
    entities,
    migrations,
    subscribers: [],
    migrationsRun: true,
    cli: {
        entitiesDir: 'src/libs/typeorm/entities',
        migrationsDir: 'src/libs/typeorm/migrations'
    },

    // Will be overwritten by env vars refer .env.example
    type: 'postgres',

    // DB Extensions need ADMIN privileges to install. We disable it here since it will always fail using app credentials
    installExtensions: false,
    extra: {
        // db.getClient wait time on a full pool connection before timing out
        connectionTimeoutMillis: 10000,

        // time before the pool releases the client and db.getClient has to reconnect
        idleTimeoutMillis: 60000,

        // time to consider query is taking too long
        statement_timeout: 360000, // 6 minutes

        max: IS_PRODUCTION ? 50 : 10
    },
    replication: {
        master: {
            url: DATABASE_URL,
            ssl:
                APP_ENV === 'local'
                    ? undefined
                    : {
                          rejectUnauthorized: false
                      }
        },
        slaves: []
    }
} as DataSourceOptions;
