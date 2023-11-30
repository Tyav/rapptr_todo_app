import { Request, Response } from 'express';
import { CreateTodo, UpdateTodo } from '../interfaces/todo.interface';
import todoService from '../services/todo.service';
import catchAsync from '../utils/catchAsync';
import { ResourceNotFound } from '../services/error.service';

class TodoController {
  createTodo = catchAsync(async (req: Request, res: Response) => {
    const { title } = req.body as CreateTodo;
    const todo = await todoService.createTodo(title);
    res.status(201).json({
      message: 'Todo created',
      data: todo,
    });
  });

  updateTodo = catchAsync(async (req: Request, res: Response) => {
    // get id and data
    const todoId = req.params.todoId as string;
    const data = req.body as UpdateTodo;

    // check that todo exist or error
    const todo = await todoService.getTodoById(todoId);
    if (!todo) {
      return Promise.reject(
        new ResourceNotFound({
          message: 'Todo does not exist',
          data: { todoId },
        })
      );
    }

    // update todo
    const updateTodo = await todoService.updateTodo(todoId, data);

    // return response
    res.status(200).json({
      message: 'Todo updated successfully',
      data: updateTodo,
    });
  });

  deleteTodo = catchAsync(async (req: Request, res: Response) => {
    // get todoId
    const todoId = req.params.todoId as string;

    // check that todo exist or error
    const todo = await todoService.getTodoById(todoId);
    if (!todo) {
      return Promise.reject(
        new ResourceNotFound({
          message: 'Todo does not exist',
          data: { todoId },
        })
      );
    }

    await todoService.deleteTodo(todo);

    res.status(200).json({
      message: 'Todo deleted successfully',
    });
    // return response
  });

  getAllTodo = catchAsync(async (req: Request, res: Response) => {
    const todos = await todoService.getAllTodos();

    res.status(200).json({
      message: 'Todos retrieved successfully',
      data: {
        todos,
      },
    });
  });
}

export default new TodoController();
