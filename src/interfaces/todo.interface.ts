import { Document, Model } from 'mongoose';

export type TodoDto = {
  title: string;
  isCompleted: boolean;
  isDeleted: boolean;
  creator: string
};

export type CreateTodo = Omit<TodoDto, 'isCompleted'|'isDeleted'|'creator'>;
export type UpdateTodo = Partial<Omit<TodoDto, 'isDeleted'|'creator'>>;

export interface ITodoDoc extends TodoDto, Document {
  delete: () => void;
}

export interface ITodoModel extends Model<ITodoDoc> {}
