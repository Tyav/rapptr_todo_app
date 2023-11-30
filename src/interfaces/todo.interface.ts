import { Document, Model } from 'mongoose';

export type CreateTodo = {
  title: string;
};

export interface ITodoDoc extends CreateTodo, Document {
  isDeleted: boolean;
  isCompleted: boolean;
  delete: () => void;
}

export interface ITodoModel extends Model<ITodoDoc> {}
