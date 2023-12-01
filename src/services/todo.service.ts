import { CreateTodo, ITodoDoc, UpdateTodo } from '../interfaces/todo.interface';
import TodoModel from '../models/todo.model';

class TodoService {
  createTodo(title: string, creator: string) {
    return TodoModel.create({
      title,
      creator,
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
    return TodoModel.find().populate({
      path: 'creator',
      // using transform to avoid more logic on models
      transform(doc) {
        if (doc) {
          return doc.toJSON();
        }
        return doc;
      },
      select: 'id username',
    });
  }
}

export default new TodoService();
