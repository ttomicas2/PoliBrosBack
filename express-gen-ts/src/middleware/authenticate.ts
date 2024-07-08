
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export function authenticateToken(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).send('Unauthorized');
    }

    jwt.verify(token, 'your_secret_key', (err, user: any) => {
        if (err) {
            return res.status(403).send('Forbidden');
        }
        req.body.user = user;
        next();
    });
}
