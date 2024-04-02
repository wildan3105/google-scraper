import { Router, Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user';
import { IUserVerificationRequest } from '../interfaces/user';
import verifyToken from './middlewares/auth';
import { KeywordService } from '../services/keyword';

export class UserController {
    private readonly userService: UserService;
    private readonly keywordService: KeywordService;

    private router: Router;

    public constructor(userService: UserService, keywordService: KeywordService) {
        this.userService = userService;
        this.keywordService = keywordService;

        this.router = Router();

        this.router.post('/', this.post.bind(this));
        this.router.get('/verify', this.verify.bind(this));
        this.router.post('/auth/login', this.login.bind(this));
        this.router.post('/auth/logout', verifyToken, this.logout.bind(this));

        // keywords
        this.router.get('/keywords', verifyToken, this.getUserKeywords.bind(this));
        this.router.get('/keywords/:keyword_id', verifyToken, this.getUserSingleKeyword.bind(this));
        this.router.get('/keywords/:keyword_id/convert', verifyToken, this.convertToHTML.bind(this));
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

    public async getUserKeywords(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const keywords = await this.keywordService.getUserKeywords(req.userId, req.query.q as string);
            return res.status(200).json(keywords);
        } catch (err) {
            return next(err);
        }
    }

    public async getUserSingleKeyword(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const keyword = await this.keywordService.getUserSingleKeyword(req.userId, req.params.keyword_id);
            return res.status(200).json(keyword);
        } catch (err) {
            return next(err);
        }
    }

    public async convertToHTML(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const keywordHTML = await this.keywordService.convertKeywordToHTML(req.userId, req.params.keyword_id);
            return res.status(200).send(keywordHTML);
        } catch (err) {
            return next(err);
        }
    }
}
