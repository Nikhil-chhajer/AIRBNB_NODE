import { v4 as uuidv4 } from 'uuid';
import { Request, Response, NextFunction } from 'express';
import { asyncLocalStorage } from '../utils/helpers/request.helpers';
export const attachCorrelationIdMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const correlationId = uuidv4();
    console.log(req.body)
    req.headers['x-correlation-id'] = correlationId;
    asyncLocalStorage.run({correlationId: correlationId}, () => {
        next();
    })

}
