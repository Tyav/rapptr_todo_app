import express from 'express';
import router from './routes';
import { errorConverter, notFoundHandler } from './services/error.service';

const app = express()

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// version api
app.use('/api/v1', router);


app.use(notFoundHandler);

// handle uncaught API errors
app.use(errorConverter);

export default app
