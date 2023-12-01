import moment, { Moment } from "moment";
import mongoose from "mongoose";
import jwt from 'jsonwebtoken'
import { BadRequest } from "./error.service";

class TokenService {
  /**
   * Generate token
   */
  generateToken (
    userId: mongoose.Types.ObjectId,
    secret: string = process.env?.JWT_SECRET!
  ): string {
    const expires = moment().add(process.env.JWT_EXPIRES, 'minutes');
    const payload = {
      sub: userId,
      iat: moment().unix(),
      exp: expires.unix(),
    };
    return jwt.sign(payload, secret);
  }

  /**
   * Verify token and return token doc (or throw an error if it is not valid)
   */
  async verifyToken(token: string) {
    try {
      const payload = jwt.verify(token, process.env?.JWT_SECRET!);
      if (typeof payload.sub !== 'string') {
        throw new BadRequest({ message: 'bad user' });
      }
      //eslint-disable-next-line
    } catch (error: any) {
      return Promise.reject(new BadRequest({...error}));
    }
  }

}

export default new TokenService();


