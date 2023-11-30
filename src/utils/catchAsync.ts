import { type Request, type Response, type NextFunction } from 'express';
import { HandleErrorResponse } from '../services/error.service';

// this higher order function handles error thrown in the request handlers and uses the errorhandler to return an error response
const catchAsync = (fn: (req: Request, res: Response, next: NextFunction) => void) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch((err) => { HandleErrorResponse(err, res); });
};

export default catchAsync;
