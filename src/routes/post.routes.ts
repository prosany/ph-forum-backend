import express, { Router } from "express";
import {
  createPost,
  getPosts,
  updateActivity,
} from "../controllers/post.controllers";
import { verifyToken } from "../utils/jwt";
const router: Router = express.Router();

router.post("/create-post", verifyToken, createPost);
router.get("/get-posts", verifyToken, getPosts);
router.post("/update-activity/:postId", verifyToken, updateActivity);

export default router;
