import { NextFunction, Request, Response, Router } from 'express';
import { CSVService } from '../services/csv';
import verifyToken from './middlewares/auth';

export class CSVController {
    private readonly csvService: CSVService;
    private router: Router;

    constructor(csvService: CSVService) {
        this.csvService = csvService;
        this.router = Router();
        this.router.post('/upload', verifyToken, this.handleCSVUpload.bind(this));
    }

    getRouter(): Router {
        return this.router;
    }

    async handleCSVUpload(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const result = await this.csvService.processCSV(req);
            return res.status(200).json({ result });
        } catch (err) {
            return next(err);
        }
    }
}
