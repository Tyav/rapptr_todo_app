import { CreateTodo, ITodoDoc, UpdateTodo } from '../interfaces/todo.interface';
import TodoModel from '../models/todo.model';

class TodoService {
  createTodo(title: string, creator: string) {
    return TodoModel.create({
      title,
      creator
    });
  }

  getTodoById(id: string) {
    return TodoModel.findById(id);
  }

  updateTodo(todoId: string, data: UpdateTodo) {
    return TodoModel.findByIdAndUpdate(
      todoId,
      {
        $set: {
          ...data,
        },
      },
      {
        new: true,
      }
    );
  }

  deleteTodo(todo: ITodoDoc) {
    return todo.delete();
  }

  // consider pagination
  getAllTodos() {
    return TodoModel.find();
  }
}

export default new TodoService();
