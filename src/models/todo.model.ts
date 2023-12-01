import mongoose from 'mongoose';
import { ITodoDoc, ITodoModel } from '../interfaces/todo.interface';
import softDeletePlugin from '../utils/softDelete';
import toJSONPlugin from '../utils/toJSON';

const TodoSchema = new mongoose.Schema<ITodoDoc>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    isDeleted: {
      type: Boolean,
      default: false
    },
    isCompleted: {
      type: Boolean,
      default: false
    },
    creator: {
      type: String,
      ref: 'User'
    }
  },
  {
    timestamps: true,
  }
);

TodoSchema.plugin(softDeletePlugin);
TodoSchema.plugin(toJSONPlugin);

// add instance methods directly

// add static methods here

const TodoModel = mongoose.model<ITodoDoc, ITodoModel>('Todo', TodoSchema);

export default TodoModel;
