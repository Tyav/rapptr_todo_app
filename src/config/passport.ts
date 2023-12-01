import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';
import config from './config';
import userService from '../services/user.service';


const jwtStrategy = new JwtStrategy(
  {
    secretOrKey: config.jwt.secret,
    jwtFromRequest: ExtractJwt.fromHeader('x-auth-token')
  },
  async (payload, done) => {
    try {
  
      //get user
      const authUser = await userService.getUserById(payload.sub);
  
      if (!authUser) {
        return done(null, false);
      }

      done(null, {
        authUser,
      });
    } catch (err) {
      done(err, false);
    }
  }
);

export default jwtStrategy;
