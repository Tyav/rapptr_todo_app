import { Document, Model } from 'mongoose';

export type CreateTodo = {
  title: string;
};

export interface ITodoDoc extends CreateTodo, Document {
  deleted: boolean;
}

export interface ITodoModel extends Model<ITodoDoc> {}
