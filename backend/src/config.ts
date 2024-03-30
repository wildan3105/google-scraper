/* eslint no-process-env: "off" */

// NOTE: All env vars from process.env are imported as STRINGS. It is important to keep this in mind and cast your env vars as needed.

import { injectEnv } from './libs/env';

injectEnv();

export const { NODE_ENV } = process.env;

export const APP_ENV = process.env.APP_ENV || 'local';
export const APP_MODE = process.env.APP_MODE || 'development';

export const PORT = process.env.PORT;

export const IS_PRODUCTION = APP_ENV === 'production';
export const IS_LOCAL = APP_ENV === 'local';
export const IS_TEST = APP_ENV === 'test';

export const DATABASE_URL = process.env.DATABASE_URL;

export const ELASTIC_EMAIL_BASE_URL = process.env.ELASTIC_EMAIL_BASE_URL;
export const ELASTIC_EMAIL_API_KEY = process.env.ELASTIC_EMAIL_API_KEY;

export const APP_BASE_URL = process.env.APP_BASE_URL;

export const BASE_URL = APP_ENV === 'local' ? `http://localhost:${PORT}` : APP_BASE_URL;

export const TOKEN_SECRET_KEY = process.env.TOKEN_SECRET_KEY;