import express, { Router } from "express";
import { createPost, getPosts } from "../controllers/post.controllers";
import { verifyToken } from "../utils/jwt";
const router: Router = express.Router();

router.post("/create-post", verifyToken, createPost);
router.get("/get-posts", verifyToken, getPosts);

export default router;
