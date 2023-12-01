import mongoose from 'mongoose';
import { IUserDoc, IUserModel } from '../interfaces/user.interface';
import toJSONPlugin from '../utils/toJSON';

const UserSchema = new mongoose.Schema<IUserDoc>(
  {
    username: {
      type: String,
      unique: true,
      index: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.plugin(toJSONPlugin);

const UserModel = mongoose.model<IUserDoc, IUserModel>('User', UserSchema);

export default UserModel;
