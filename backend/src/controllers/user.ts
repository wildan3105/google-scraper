import { Router, Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user';
import { IUserVerificationRequest } from '../interfaces/user';
import verifyToken from './middlewares/auth';

export class UserController {
    private readonly userService: UserService;

    private router: Router;

    public constructor(userService: UserService) {
        this.userService = userService;
        this.router = Router();
        this.router.post('/', this.post.bind(this));
        this.router.get('/verify', this.verify.bind(this));
        this.router.post('/auth/login', this.login.bind(this));
        this.router.get('/profile', verifyToken, this.view.bind(this));
        this.router.post('/auth/logout', verifyToken, this.logout.bind(this));
    }

    getRouter(): Router {
        return this.router;
    }

    public async post(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const user = await this.userService.create(req.body);
            return res.status(201).json(user); // TODO: get status body from enum instead
        } catch (err) {
            return next(err);
        }
    }

    public async verify(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const userVerificationRequest: IUserVerificationRequest = {
                code: req.query.code as string
            };

            const userVerified = await this.userService.verify(userVerificationRequest.code);
            if (userVerified) {
                return res.status(200).json({
                    status: 'verified'
                });
            }
        } catch (err) {
            return next(err);
        }
    }

    public async login(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const loginResponse = await this.userService.login(req.body);
            return res.status(200).json(loginResponse);
        } catch (err) {
            return next(err);
        }
    }

    public async logout(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            await this.userService.logout(req.userId);
            return res.status(200).json({
                status: 'ok'
            });
        } catch (err) {
            return next(err);
        }
    }

    public async view(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const userDetailsResponse = await this.userService.getUserDetails(req.userId);
            return res.status(200).json(userDetailsResponse);
        } catch (err) {
            return next(err);
        }
    }
}
