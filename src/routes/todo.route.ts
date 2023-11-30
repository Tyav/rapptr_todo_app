import express from 'express';
import todoController from '../controllers/todo.controller';
import validate from '../middlewares/validator.middleware';
import {
  createTodo,
  deleteTodo,
  getATodo,
  updateTodo,
} from '../validations/todo.validation';

const router = express.Router();

router
  .route('/')
  .post(validate(createTodo), todoController.createTodo)
  .get(todoController.getAllTodo);
router
  .route('/:todoId')
  .patch(validate(updateTodo), todoController.updateTodo)
  .delete(validate(deleteTodo), todoController.deleteTodo)
  .get(validate(getATodo), todoController.getATodo);

export default router;
