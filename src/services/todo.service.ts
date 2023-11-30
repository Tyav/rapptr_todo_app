import { CreateTodo, ITodoDoc } from '../interfaces/todo.interface';
import TodoModel from '../models/todo.model';

class TodoService {
  createTodo(title: string) {
    return TodoModel.create({
      title,
    });
  }

  getTodoById(id: string) {
    return TodoModel.findById(id)
  }

  updateTodo(todoId: string, data: Partial<CreateTodo>) {
    return TodoModel.findByIdAndUpdate(todoId, {
      $set: {
        ...data
      }
    }, {
      new: true
    })
  }

  async deleteTodo(todo: ITodoDoc) {
    return todo.delete()
  }
}

export default new TodoService();
