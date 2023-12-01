import { Document, Model } from "mongoose";

export type UserDto = {
  username: string;
}

export interface IUserDoc extends UserDto, Document {

}

export interface IUserModel extends Model<IUserDoc> {}