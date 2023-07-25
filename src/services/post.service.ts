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

export const getAllPost = async ({
  email,
  admin,
  no_comment,
  unresolved,
}: any) => {
  let options: any = {
    status: {
      $ne: "Draft",
    },
    isDeleted: {
      $ne: true,
    },
  };
  if (admin) {
    options = {
      ...options,
      isPostedByAdmin: true,
    };
  }
  if (no_comment) {
    options = {
      ...options,
      commentsFromAdmin: false,
      isPostedByAdmin: false,
    };
  }
  if (unresolved) {
    options = {
      ...options,
      isResolved: false,
      isPostedByAdmin: false,
    };
  }
  if (email) {
    const user: any = await getUserByEmail(email as string);
    if (user) {
      options = { user: user._id };
    }
  }
  // const posts = await Post.find(options)
  //   .select("-__v")
  //   .populate("user")
  //   .sort({ createdAt: -1 });
  let threeHoursAgo = new Date();
  threeHoursAgo.setHours(threeHoursAgo.getHours() - 3);
  const posts = await Post.aggregate([
    {
      $match: { ...options },
    },
    {
      $addFields: {
        upVotesCount: {
          $size: "$upVotes",
        },
        commentsCount: {
          $size: "$comments",
        },
        isRecent: { $gte: ["$createdAt", threeHoursAgo] },
      },
    },
    {
      $sort: {
        isRecent: -1,
        priority: -1,
        createdAt: -1,
        upVotesCount: -1,
        commentsCount: -1,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $unwind: "$user",
    },
    {
      $project: {
        __v: 0,
      },
    },
  ]);
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
    updateBody = {
      ...data,
      isCommentOffByAdmin: user.role === "admin" || user.role === "moderator",
    };
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

  if (data.isUpdateStatus) {
    console.log("Five");
    updateBody = {
      ...data,
      status: data.isUpdateStatus,
      isResolved: data.isUpdateStatus === "Resolved",
      isRejected: data.isUpdateStatus === "Rejected",
      isUnresolved: data.isUpdateStatus === "Unresolved",
      editedBy:
        user.role === "admin" || user.role === "moderator" ? "admin" : "N/A",
    };
  }

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

export const storeComments = async (
  postId: string,
  data: any,
  options: any
) => {
  const user: any = await getUserByEmail(options.user_email);
  if (!user) throw new Error("Unauthorized");
  const queryPost: any = await Post.findOne({ _id: postId });
  let updateBody: any = {};
  if (queryPost?.commentsFromAdmin === true) {
    updateBody = {
      comments: [
        ...queryPost.comments,
        {
          user: {
            name: user.name,
            email: user.email,
            id: user._id,
            role: user.role,
            batch: user.batch,
            picture: user.picture,
          },
          comment: data.comment,
        },
      ],
    };
  } else if (user.role === "admin" || user.role === "moderator") {
    updateBody = {
      comments: [
        ...queryPost.comments,
        {
          user: {
            name: user.name,
            email: user.email,
            id: user._id,
            role: user.role,
            batch: user.batch,
            picture: user.picture,
          },
          comment: data.comment,
        },
      ],
      commentsFromAdmin: true,
    };
  } else {
    updateBody = {
      comments: [
        ...queryPost.comments,
        {
          user: {
            name: user.name,
            email: user.email,
            id: user._id,
            role: user.role,
            batch: user.batch,
            picture: user.picture,
          },
          comment: data.comment,
        },
      ],
      commentsFromAdmin: false,
    };
  }

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

export const getTrendingIssues = async () => {
  let threeHoursAgo = new Date();
  threeHoursAgo.setHours(threeHoursAgo.getHours() - 3);
  return await Post.aggregate([
    {
      $addFields: {
        upVotesCount: {
          $size: "$upVotes",
        },
        commentsCount: {
          $size: "$comments",
        },
        isRecent: { $gte: ["$createdAt", threeHoursAgo] },
      },
    },
    {
      $sort: {
        priority: -1,
        isRecent: -1,
        createdAt: -1,
        upVotesCount: -1,
        commentsCount: -1,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $unwind: "$user",
    },
    {
      $project: {
        __v: 0,
        user: 0,
        tags: 0,
        category: 0,
        status: 0,
        upVotes: 0,
        upVotesCount: 0,
        priority: 0,
        isResolved: 0,
        isUnresolved: 0,
        isRejected: 0,
        isDeleted: 0,
        isCommentOff: 0,
        isCommentOffByAdmin: 0,
        commentsFromAdmin: 0,
        comments: 0,
        editedBy: 0,
        isPostedByAdmin: 0,
        commentsCount: 0,
        isEdited: 0,
        editedHistory: 0,
        photosOrVideos: 0,
      },
    },
  ]);
};
