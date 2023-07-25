import express, { Router } from "express";
import {
  createComment,
  createPost,
  getPosts,
  trendingIssue,
  updateActivity,
  updatePost,
} from "../controllers/post.controllers";
import { verifyToken } from "../utils/jwt";
const router: Router = express.Router();

router.post("/create-post", verifyToken, createPost);
router.post("/update-post/:postId", verifyToken, updatePost);
router.get("/get-posts", verifyToken, getPosts);
router.post("/update-activity/:postId", verifyToken, updateActivity);
router.post("/comment-on/:postId", verifyToken, createComment);
router.get("/trending-issue", verifyToken, trendingIssue);

export default router;
