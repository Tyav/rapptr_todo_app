import passport from 'passport';
import { NextFunction, Request, Response } from 'express';
import { UnauthorizedAccess } from '../services/error.service';
import { IAuthData } from '../interfaces/auth.interface';

const verifyCallback =
  // eslint-disable-next-line
    (req: Request, resolve: any, reject: any) =>
    async (err: Error, authData: IAuthData, info: string) => {
      // check that user is authenticated
      if (err || info || !authData) {
        return reject(
          new UnauthorizedAccess({ message: 'Please authenticate' })
        );
      }
      const { authUser } = authData;

      // add user to req object
      req.authUser = authUser;

      resolve();
    };

/**
 * Middleware to authenticate users permission
 */
const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) =>
  new Promise<void>((resolve, reject) => {
    passport.authenticate(
      'jwt',
      { session: false },
      verifyCallback(req, resolve, reject)
    )(req, res, next);
  })
    .then(() => next())
    .catch((err) => next(err));

export default authMiddleware;
