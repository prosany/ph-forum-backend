import { Document, Model, model, Schema, Query } from "mongoose";

const userSchema = new Schema({
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
    unique: true,
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
});

// export interface IUser extends Document {
//   name: string;
//   email: string;
//   password: string;
//   phone: string;
//   role: string;
//   batch: string;
// }

// export interface IUserModel extends Model<IUser> {
//   findByEmail(email: string): Query<IUser | null, IUser>;
// }

// userSchema.statics.findByEmail = function (email: string) {
//   return this.findOne({ email });
// };

// export default model<IUser, IUserModel>("User", userSchema);

const User = model("User", userSchema);

export default User;
