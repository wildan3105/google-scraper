import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { TOKEN_SECRET_KEY } from '../../config';

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const token: string | undefined = req.headers['x-access-token'] as string;

    if (!token) {
        return res.status(403).send({
            error_code: 'REQUEST_FORBIDDEN_ERROR',
            message: 'No token provided!'
        });
    }

    jwt.verify(token, TOKEN_SECRET_KEY as string, (err, decoded) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(401).send({
                    error_code: 'UNAUTHORIZED',
                    message: 'Token has expired'
                });
            } else {
                return res.status(401).send({
                    error_code: 'UNAUTHORIZED',
                    message: 'Unauthorized!'
                });
            }
        }

        if (decoded) {
            const decodedPayload = decoded as JwtPayload;
            req.userId = decodedPayload.id as string;
            next();
        } else {
            return res.status(401).send({
                error_code: 'UNAUTHORIZED',
                message: 'Unauthorized!'
            });
        }
    });
};

export default verifyToken;
