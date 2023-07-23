import { NextFunction, Request, Response } from "express";
import { signinValidation, signupValidation } from "../schemas/user.schemas";
import {
  createUser,
  userStatistics,
  verifyUserLogin,
} from "../services/users.service";

export const registration = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await signupValidation.validateAsync(req.body);
    const savedUser = await createUser(req.body);
    if (savedUser.status === 0) {
      throw next({ status: 409, message: savedUser.result.message });
    }
    res.status(201);
    res.send(savedUser);
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    await signinValidation.validateAsync(req.body);
    const user = await verifyUserLogin(email, password);
    if (user.status === 0) {
      throw next({ status: 401, message: user.result.message });
    }
    res.status(200);
    res.send(user);
  } catch (error) {
    next(error);
  }
};

export const statistics = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.query;
    const statis = await userStatistics(email as string);
    if (statis.length > 0) {
      res.status(200);
      res.send({
        status: 1,
        message: "User Statistics were successfully retrieved.",
        result: statis,
      });
    } else {
      res.status(200);
      res.send({
        status: 0,
        message: "No statistics found.",
      });
    }
  } catch (error) {
    next(error);
  }
};
