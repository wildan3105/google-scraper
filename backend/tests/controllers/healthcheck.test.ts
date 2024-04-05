import { Request, Response } from 'express';
import { HealthcheckController } from '../../src/controllers/healthcheck';
import { HealthcheckService } from '../../src/services/healthcheck';
import { DataSource } from 'typeorm';

jest.mock('../../src/services/healthcheck');
const MockedHealthcheckService = HealthcheckService as jest.Mocked<typeof HealthcheckService>;
const mockedHealthcheckServiceInstance = new MockedHealthcheckService(null as unknown as DataSource);

describe('HealthcheckController', () => {
    const res = { status: undefined, json: undefined } as unknown as Response;
    let req: Request;
    beforeEach(() => {
        res.status = jest.fn().mockReturnValue(res);
        res.json = jest.fn().mockReturnValue(res);
        req = {} as Request;
    });

    describe('GET /healthcheck/liveness', () => {
        test('should return 200 OK', async () => {
            const controller = new HealthcheckController(mockedHealthcheckServiceInstance);
            await controller.getHealthcheckLiveness(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ status: 'OK' });
        });
    });

    describe('GET /healthcheck/readiness', () => {
        test('should return 200 OK', async () => {
            mockedHealthcheckServiceInstance.isDBReady = jest.fn().mockResolvedValueOnce(true);
            const controller = new HealthcheckController(mockedHealthcheckServiceInstance);
            await controller.getHealthcheckReadiness(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ status: 'OK' });
        });

        test('should return 503 Service Unavailable when DB is not ready', async () => {
            mockedHealthcheckServiceInstance.isDBReady = jest.fn().mockResolvedValueOnce(false);
            const controller = new HealthcheckController(mockedHealthcheckServiceInstance);
            await controller.getHealthcheckReadiness(req, res);

            expect(res.status).toHaveBeenCalledWith(503);
            expect(res.json).toHaveBeenCalledWith({ status: 'Service Unavailable' });
        });
    });
});
