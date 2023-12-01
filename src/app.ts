import express from 'express';
import cors from 'cors';

import router from './routes';
import { errorConverter, notFoundHandler } from './services/error.service';
import passport from 'passport';
import jwtStrategy from './config/passport';

const app = express()

// enable cors
app.use(cors());
app.options('*', cors());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// jwt authentication
app.use(passport.initialize());
passport.use('jwt', jwtStrategy);


// version api
app.use('/api/v1', router);


app.use(notFoundHandler);

// handle uncaught API errors
app.use(errorConverter);

export default app
