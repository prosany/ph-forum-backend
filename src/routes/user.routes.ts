import express, { Router } from "express";
const router: Router = express.Router();
import {
  login,
  registration,
  statistics,
  updateProfile,
} from "../controllers/users.controllers";
import { verifyToken } from "../utils/jwt";

router.post("/signup", registration);
router.post("/signin", login);
router.get("/statistics", verifyToken, statistics);
router.post("/update", verifyToken, updateProfile);

export default router;
