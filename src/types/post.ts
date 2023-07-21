import { Document, ObjectId } from "mongoose";

export interface IPost extends Document {
  user: ObjectId;
  body: string;
  tags: string[];
  category: string;
  status: string;
  upVotes: string[];
  priority: string;
  isResolved: boolean;
  isRejected: boolean;
  isUnresolved: boolean;
  isDeleted: boolean;
  isEdited: boolean;
  editedBy: string;
  editedHistory: string[];
  photosOrVideos: string[];
  _id?: ObjectId | string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

// export interface IPostModel extends Model<IPost> {
//   findByEmail(email: string): Query<IPost | null, IPost>;
// }
