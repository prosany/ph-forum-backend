import bcrypt from "bcrypt";
import crypto from "crypto";

export const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

export const comparePassword = async (
  password: string,
  hashedPassword: string
) => {
  return await bcrypt.compare(password, hashedPassword);
};

export const secretKey = async () => {
  return crypto.randomBytes(64).toString("hex");
};
