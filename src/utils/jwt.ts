import { Request, Response, NextFunction } from "express";
import JWT, { SignOptions, VerifyOptions } from "jsonwebtoken";
import createError from "http-errors";
import { JWT_SECRET } from "../config";

interface DecodedToken {
  user_email: string;
  iat: number;
  exp: number;
  iss: string;
  aud: string;
}

interface RequestWithUser extends Request {
  user_email: string;
}

const signToken = (user_email: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const signOptions: SignOptions = {
      expiresIn: "7d",
      issuer: "Programming-Hero.Com",
      audience: user_email,
    };

    JWT.sign({ user_email }, JWT_SECRET, signOptions, (err, token) => {
      if (err) return reject(createError.InternalServerError());
      resolve(token as string);
    });
  });
};

const verifyToken = (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
): void => {
  let token = req.headers["authorization"];

  if (!token) return next(createError.Unauthorized());

  token = token.split(" ")[1];

  const verifyOptions: VerifyOptions = {
    issuer: "Programming-Hero.Com",
  };

  JWT.verify(token, JWT_SECRET, verifyOptions, (err, decoded) => {
    if (err) return next(createError(401, "Invalid token"));

    const decodedToken = decoded as DecodedToken;
    req.user_email = decodedToken.aud;
    next();
  });
};

export { signToken, verifyToken };
