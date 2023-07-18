import { Document, Model, ObjectId, Query } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: string;
  batch: string;
  isVerified: boolean;
  isBlocked: boolean;
  isDeleted: boolean;
  _id?: ObjectId | string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface IUserModel extends Model<IUser> {
  findByEmail(email: string): Query<IUser | null, IUser>;
}
