import { Schema, model } from "mongoose";
import { IPost } from "../types";

export const photosVideosSchema = new Schema({
  type: {
    type: String,
    enum: ["image", "video"],
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
});

export const postSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    tags: {
      type: [String],
      required: false,
      default: [],
    },
    category: {
      type: String,
      required: true,
      default: "General",
    },
    status: {
      type: String,
      required: true,
      enum: [
        "New",
        "Draft",
        "Under Investigation",
        "Resolved",
        "Unresolved",
        "Rejected",
        "Closed",
      ],
    },
    upVotes: {
      type: [String],
      required: false,
      default: [],
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      required: true,
      default: "low",
    },
    isResolved: {
      type: Boolean,
      required: true,
      default: false,
    },
    isRejected: {
      type: Boolean,
      required: true,
      default: false,
    },
    isUnresolved: {
      type: Boolean,
      required: true,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      required: true,
      default: false,
    },
    isEdited: {
      type: Boolean,
      required: true,
      default: false,
    },
    editedBy: {
      type: String,
      required: false,
      enum: ["user", "admin"],
      default: null,
    },
    editedHistory: {
      type: [String],
      required: false,
      default: [],
    },
    photosOrVideos: {
      type: [photosVideosSchema],
      required: false,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Post = model<IPost>("Post", postSchema);

export default Post;
