import dotenv from "dotenv";
dotenv.config({});

export const PORT: number | string = process.env.PORT || 3010;
export const JWT_SECRET: string = process.env.JWT_SECRET as string;
export const APP_ENV: string = process.env.APP_ENV as string;
export const DB_URL: string = process.env.DB_URL as string;
export const DB_NAME: string = process.env.DB_NAME as string;
export const DB_USER: string = process.env.DB_USER as string;
export const DB_PASSWORD: string = process.env.DB_PASSWORD as string;
export const COLUD_NAME: string = process.env.COLUD_NAME as string;
export const CLOUD_API_KEY: string = process.env.CLOUD_API_KEY as string;
export const CLOUD_SECRET_KEY: string = process.env.CLOUD_SECRET_KEY as string;
