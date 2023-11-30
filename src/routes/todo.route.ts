import express from 'express';
import todoController from '../controllers/todo.controller';
import validate from '../middlewares/validator.middleware';
import { createTodo, updateTodo } from '../validations/todo.validation';

const router = express.Router();

router.post('/', validate(createTodo),todoController.createTodo);
router.patch('/:todoId', validate(updateTodo),todoController.updateTodo);

export default router