import mongoose from 'mongoose';
import { ITodoDoc, ITodoModel } from '../interfaces/todo.interface';

const TodoSchema = new mongoose.Schema<ITodoDoc>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    deleted: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
    id: true
  }
);

// add instance methods directly

// add static methods here
TodoSchema.method('toJSON', function (...doc) {
  const obj = this.toObject()
  obj.id = obj._id.toString();

  delete obj.__v;
  delete obj._id
  return obj
})

const TodoModel = mongoose.model<ITodoDoc, ITodoModel>('Todo', TodoSchema);

export default TodoModel;
