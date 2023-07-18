import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import compress from "compression";
import createError from "http-errors";
import morgan from "morgan";
// Custom import
import { PORT } from "./config";
import dbConnection from "./config/database.config";
import userRoutes from "./routes/user.routes";

// Initialize the application
const app: Application = express();

// Database connection
(async () => {
  try {
    await dbConnection;
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
})();

// Middleware
app.use(cors({}));
app.use(morgan("dev"));
app.use(compress());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Routes middleware
app.use("/api", userRoutes);

// Error handeler
app.use(async (req: Request, res: Response, next: NextFunction) => {
  next(createError.NotFound("This route does not exist"));
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  res.status(err.status || 500);
  res.send({
    status: 0,
    message: err.message,
  });
});

app.listen(PORT, () => console.log(`Server Listening on ${PORT}`));
