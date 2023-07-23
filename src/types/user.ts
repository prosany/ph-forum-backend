import { Document, Model, ObjectId, Query } from "mongoose";
import { Request } from "express";

export interface IUser extends Document {
  uid: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  role: string;
  batch: string;
  isVerified: boolean;
  isBlocked: boolean;
  isDeleted: boolean;
  picture: string;
  _id?: ObjectId | string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface IUserModel extends Model<IUser> {
  findByEmail(email: string): Query<IUser | null, IUser>;
}

export interface RequestWithUser extends Request {
  user?: {
    user_email: string;
    user_uid: string;
  };
}
