import express, { Router } from "express";
const router: Router = express.Router();
import {
  login,
  registration,
  statistics,
} from "../controllers/users.controllers";
import { verifyToken } from "../utils/jwt";

router.post("/signup", registration);
router.post("/signin", login);
router.get("/statistics", verifyToken, statistics);

export default router;
