import TodoModel from '../models/todo.model';

class TodoService {
  createTodo(title: string) {
    return TodoModel.create({
      title,
    });
  }
}

export default new TodoService();
