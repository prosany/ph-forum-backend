import { IUser } from "../types";
import User from "../models/users.model";
import { comparePassword, hashPassword } from "../utils/encrypt";
import { signToken } from "../utils/jwt";
import { userError } from "../utils/user";
import Post from "../models/post.model";

export const getUserByEmail = async (email: string): Promise<IUser | null> => {
  const user = await User.findByEmail(email);
  return user;
};

export const createUser = async (userData: IUser): Promise<any> => {
  try {
    const { email, password } = userData;
    const user = await User.findByEmail(email);
    if (user) {
      return userError(409, "User already exists.");
    }
    const hashedPass = await hashPassword(password);
    const newUser = new User({ ...userData, password: hashedPass });
    const savedUser = await newUser.save();
    const userResponse = {
      status: 1,
      message: "Congratulations! You have successfully registered.",
      result: {
        name: savedUser.name,
        email: savedUser.email,
        role: savedUser.role,
        batch: savedUser.batch,
      },
    };
    return userResponse;
  } catch (error: any) {
    return userError(500, error.message || "Internal Server Error.");
  }
};

export const verifyUserLogin = async (
  email: string,
  password: string
): Promise<any> => {
  try {
    const user = await User.findByEmail(email);
    if (!user) {
      return userError(401, "Invalid login credentials. Try again.");
    }
    const { password: hashedPass, isBlocked, isDeleted, isVerified } = user;
    if (isBlocked) {
      return userError(
        401,
        "Your account has been blocked. Please contact with Programming Hero."
      );
    }
    if (isDeleted) {
      return userError(
        401,
        "Your account has been deleted. Please contact with Programming Hero."
      );
    }
    if (!isVerified) {
      return userError(
        401,
        "Your account is not verified. Please contact with Programming Hero."
      );
    }
    const isPassMatched = await comparePassword(password, hashedPass);
    if (!isPassMatched) {
      return userError(401, "Invalid login credentials. Try again.");
    }
    const token = await signToken(user?.email, user?.uid);
    return {
      status: 1,
      message: "Congratulations! You have successfully logged in.",
      result: {
        name: user.name,
        email: user.email,
        role: user.role,
        batch: user.batch,
        token,
        picture: user.picture,
      },
    };
  } catch (error: any) {
    return userError(500, error.message || "Internal Server Error.");
  }
};

export const userStatistics = async (email: string) => {
  return await Post.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "userDetails",
      },
    },
    {
      $unwind: "$userDetails",
    },
    {
      $match: {
        "userDetails.email": email,
      },
    },
    {
      $group: {
        _id: "$userDetails.email",
        totalPosts: {
          $sum: 1,
        },
        resolvedCount: {
          $sum: {
            $cond: ["$isResolved", 1, 0],
          },
        },
        unresolvedCount: {
          $sum: {
            $cond: ["$isUnresolved", 1, 0],
          },
        },
        rejectedCount: {
          $sum: {
            $cond: [
              {
                $or: ["$isRejected", { $eq: ["$status", "Closed"] }],
              },
              1,
              0,
            ],
          },
        },
      },
    },
    {
      $project: {
        userEmail: "$_id",
        _id: 0,
        totalPosts: 1,
        resolvedCount: 1,
        unresolvedCount: 1,
        rejectedCount: 1,
      },
    },
  ]);
};
