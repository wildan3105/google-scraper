/* eslint no-process-env: "off" */

import { injectEnv } from './libs/env';

injectEnv();

export const { NODE_ENV } = process.env;

export const APP_ENV = process.env.APP_ENV || 'local';
export const APP_MODE = process.env.APP_MODE || 'development';
export const APP_NAME = process.env.APP_NAME || 'google-scraper';

export const PORT = process.env.PORT;
export const SOCKET_PORT = process.env.SOCKET_PORT || 2000;

export const IS_PRODUCTION = APP_ENV === 'production';
export const IS_LOCAL = APP_ENV === 'local';
export const IS_TEST = APP_ENV === 'test';

export const DATABASE_URL = process.env.DATABASE_URL;

export const ELASTIC_EMAIL_BASE_URL = process.env.ELASTIC_EMAIL_BASE_URL;
export const ELASTIC_EMAIL_API_KEY = process.env.ELASTIC_EMAIL_API_KEY;

export const APP_BASE_URL = process.env.APP_BASE_URL;
export const FRONTEND_BASE_URL = process.env.FRONTEND_BASE_URL || 'http://localhost:5173';

export const BASE_URL = APP_ENV === 'local' ? `http://localhost:${PORT}` : APP_BASE_URL;

export const TOKEN_SECRET_KEY = process.env.TOKEN_SECRET_KEY;

export const REDIS_URL = process.env.REDIS_URL;
