import Post from "../models/post.model";

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

export const getAllPost = async () => {
  const posts = await Post.find({})
    .select("-__v")
    .populate("user")
    .sort({ createdAt: -1 });
  return posts;
};
