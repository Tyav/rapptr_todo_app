import { Request, Response } from 'express';
import { CreateTodo, UpdateTodo } from '../interfaces/todo.interface';
import todoService from '../services/todo.service';
import catchAsync from '../utils/catchAsync';
import { ForbiddenAccess, ResourceNotFound } from '../services/error.service';

class TodoController {
  createTodo = catchAsync(async (req: Request, res: Response) => {
    const user = req.authUser;
    const { title } = req.body as CreateTodo;
    const todo = await todoService.createTodo(title, user.id);
    res.status(201).json({
      message: 'Todo created',
      data: todo,
    });
  });

  updateTodo = catchAsync(async (req: Request, res: Response) => {
    const user = req.authUser;
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
    if (todo.creator !== user.id) {
      return Promise.reject(
        new ForbiddenAccess({
          message: 'User does not have permission to update this todo',
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
    const user = req.authUser;
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
    if (todo.creator !== user.id) {
      return Promise.reject(
        new ForbiddenAccess({
          message: 'User does not have permission to delete this todo',
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

  getATodo = catchAsync(async (req: Request, res: Response) => {
    // get id and data
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

    // return response
    res.status(200).json({
      message: 'Todo retrieved successfully',
      data: todo,
    });
  });
}

export default new TodoController();
