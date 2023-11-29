import express from 'express';
import router from './routes';

const app = express()

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// version api
app.use('/api/v1', router);


export default app
