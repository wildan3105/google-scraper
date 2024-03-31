import 'reflect-metadata'; // for TypeORM

import { HealthcheckController } from './controllers/healthcheck';
import { UserController } from './controllers/user';
import { CSVController } from './controllers/csv';

import { HealthcheckService } from './services/healthcheck';
import { UserService } from './services/user';
import { CSVService } from './services/csv';

import { UserRepository } from './libs/typeorm/repository/user';
import { UserVerificationCodeRepository } from './libs/typeorm/repository/user-verification-code';

import { DataSource } from 'typeorm';

interface InitResponse {
    healthcheckController: HealthcheckController;
    userController: UserController;
    csvController: CSVController;
}

/**
 * Initialize all ENV values and dependencies here so that they are re-usable across web servers, queue runners and crons
 */
/* eslint-disable  @typescript-eslint/no-explicit-any */
export async function init(dataSource: DataSource): Promise<InitResponse> {
    const userRepo = new UserRepository(dataSource);
    const userVerificationCodeRepo = new UserVerificationCodeRepository(dataSource);

    // services
    const healthcheckService = new HealthcheckService(dataSource);
    const userService = new UserService(userRepo, userVerificationCodeRepo);
    const csvService = new CSVService();

    // controllers
    const healthcheckController = new HealthcheckController(healthcheckService);
    const userController = new UserController(userService);
    const csvController = new CSVController(csvService);

    return {
        healthcheckController,
        userController,
        csvController
    };
}
