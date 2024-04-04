import express, { Application, RequestHandler, Router } from 'express';
import httpContext from 'express-http-context';
import bodyParser from 'body-parser';
import compression from 'compression';
import helmet from 'helmet';
import cors from 'cors';
import path from 'path';
import * as OpenApiValidator from 'express-openapi-validator';

import swaggerUI from 'swagger-ui-express';
// import YAML from 'yaml';
import fs from 'fs';

import { PORT } from './config';

import { init } from './init';
import { DataSource } from 'typeorm';
import { connect } from './db-connection';
import { errorHandler } from './controllers/middlewares/handle-error-code';

// const openApiPath = path.join(__dirname, '..', 'docs', 'openapi.yaml');
// const file = fs.readFileSync(openApiPath, 'utf8');
// const swaggerDocument = YAML.parse(file);

/**
 * Setup the application routes with controllers
 * @param app
 */
async function setupRoutes(app: Application, dataSource: DataSource) {
    const { healthcheckController, userController, csvController } = await init(dataSource);

    const apiRouter = Router();

    apiRouter.use('/healthcheck', healthcheckController.getRouter());
    apiRouter.use('/users', userController.getRouter());
    apiRouter.use('/csv', csvController.getRouter());

    app.use('/api', apiRouter);
}

/**
 * Main function to setup Express application here
 */
export async function createApp(): Promise<{ app: Application; dataSource: DataSource }> {
    const dataSource = await connect();
    if (!dataSource) {
        throw new Error('failed connecting to DB');
    }

    const app = express();
    app.use(cors());
    app.set('port', PORT);
    app.use(helmet() as RequestHandler);
    app.use(compression());
    app.use(bodyParser.json({ limit: '5mb', type: 'application/json' }) as RequestHandler);
    app.use(bodyParser.urlencoded({ extended: true }) as RequestHandler);

    // app.use(
    //     '/api-docs',
    //     swaggerUI.serve,
    //     swaggerUI.setup(swaggerDocument, {
    //         customSiteTitle: 'Swagger UI for express-typescript-postgres-signup-login app'
    //     })
    // );

    app.use(
        OpenApiValidator.middleware({
            apiSpec: './docs/openapi.yaml',
            validateRequests: true, // (default)
            validateResponses: true // false by default
        })
    );

    // This should be last, right before routes are installed
    // so we can have access to context of all previously installed
    // middlewares inside our routes to be logged
    app.use(httpContext.middleware);

    await setupRoutes(app, dataSource);

    // In order for errors from async controller methods to be thrown here,
    // you need to catch the errors in the controller and use `next(err)`.
    // See https://expressjs.com/en/guide/error-handling.html

    app.use(errorHandler());

    return { app, dataSource };
}
