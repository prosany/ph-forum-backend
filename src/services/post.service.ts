import Post from "../models/post.model";
import { getUserByEmail } from "./users.service";

export const createSinglePost = async (postData: any): Promise<any> => {
  try {
    const newPost = new Post(postData);
    const savedPost = await newPost.save();
    if (savedPost) {
      return { status: 1, message: "Post successfully created." };
    }
  } catch (error: any) {
    return { status: 0, message: error.message };
  }
};

export const getAllPost = async (email?: string) => {
  let options: any = {};
  if (email) {
    const user: any = await getUserByEmail(email as string);
    if (user) {
      options = { user: user._id };
    }
  }
  const posts = await Post.find(options)
    .select("-__v")
    .populate("user")
    .sort({ createdAt: -1 });
  return posts;
};
