import express from 'express';
import todoController from '../controllers/todo.controller';
import validate from '../middlewares/validator.middleware';
import { createTodo } from '../validations/todo.validation';

const router = express.Router();

router.post('/', validate(createTodo),todoController.createTodo);

export default router