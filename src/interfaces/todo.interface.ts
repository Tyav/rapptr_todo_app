import { Document, Model } from 'mongoose';

export type TodoDto = {
  title: string;
  isCompleted: boolean;
  isDeleted: boolean;
};

export type CreateTodo = Omit<TodoDto, 'isCompleted' | 'isDeleted'>;
export type UpdateTodo = Partial<Omit<TodoDto, 'isDeleted'>>;

export interface ITodoDoc extends TodoDto, Document {
  delete: () => void;
}

export interface ITodoModel extends Model<ITodoDoc> {}
