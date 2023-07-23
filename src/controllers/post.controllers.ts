import { NextFunction, Request, Response } from "express";
import { createPostValidation } from "../schemas/post.schemas";
import { getUserByEmail } from "../services/users.service";
import { sepereateByComma } from "../utils/general";
import { createSinglePost, getAllPost } from "../services/post.service";

interface IRequest extends Request {
  user?: {
    user_email: string;
    user_uid: string;
  };
}

export const createPost = async (
  req: IRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { body, category, status } = req.body;
    await createPostValidation.validateAsync({
      body,
      category,
      status,
    });
    const user = await getUserByEmail(req?.user?.user_email as string);
    if (!user) throw next({ status: 401, message: "Unauthorized" });
    const createdRes = await createSinglePost({
      user: user._id,
      ...req.body,
      tags: sepereateByComma(req.body.tags),
    });
    if (createdRes.status === 1) {
      res.send(createdRes);
    } else {
      next({ status: 500, message: createdRes.message });
    }
  } catch (error) {
    next(error);
  }
};

export const getPosts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.query;
    const posts = await getAllPost(email as string);
    res.send({
      status: 1,
      message: "Successfully retrieved posts",
      result: posts,
    });
  } catch (error) {
    next(error);
  }
};
