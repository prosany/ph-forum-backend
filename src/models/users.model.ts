import { Model, model, Schema } from "mongoose";
import { IUser, IUserModel } from "../interfaces";

export const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      unique: false,
    },
    role: {
      type: String,
      required: true,
      enum: ["student", "moderator", "admin", "superadmin"],
      default: "student",
    },
    batch: {
      type: String,
      required: true,
      default: null,
    },
    isVerified: {
      type: Boolean,
      default: true,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.statics.findByEmail = function (
  this: Model<IUserModel>,
  email: string
) {
  return this.findOne({ email });
};

const User = model<IUser, IUserModel>("User", userSchema);

export default User;
