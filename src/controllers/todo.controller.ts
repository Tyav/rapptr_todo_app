import { Request, Response } from 'express';
import { CreateTodo } from '../interfaces/todo.interface';
import todoService from '../services/todo.service';

class TodoController {
  async createTodo(req: Request, res: Response) {
    const { title } = req.body as CreateTodo;
    const todo = await todoService.createTodo(title);

    res.status(201).json({
      message: 'Todo created',
      data: todo,
    });
  }
}

export default new TodoController();
