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
  let options: any = {
    status: {
      $ne: "Draft",
    },
    isDeleted: {
      $ne: true,
    },
  };
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

export const updatePostActivity = async (
  postId: string,
  data: any,
  options: any
) => {
  const user: any = await getUserByEmail(options.user_email);
  if (!user) throw new Error("Unauthorized");
  let updateBody: any = { ...data };
  if (data.isCommentOff === true || data.isCommentOff === false) {
    console.log("One");
    updateBody = { ...data, isCommentOffByAdmin: user.role === "admin" };
  }

  if (data.isResolved === true || data.isResolved === false) {
    console.log("Two");
    updateBody = {
      ...data,
      status: data.isResolved ? "Resolved" : "Unresolved",
      isUnresolved: !data.isResolved,
    };
  }

  if (data.votesCount === true || data.votesCount === false) {
    console.log("Three");
    updateBody = {
      upVotesCount: data.upVotesCount,
      upVotes: [...data.upVotes],
    };
  }

  if (data.isDeleted === true || data.isDeleted === false) {
    console.log("Four");
    updateBody = {
      isDeleted: data.isDeleted,
      status: "Closed",
    };
  }
  console.log(updateBody);
  const updatedPost = await Post.findByIdAndUpdate(
    { _id: postId },
    {
      ...updateBody,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  return updatedPost;
};
