import express, { Router } from "express";
const router: Router = express.Router();
import { login, registration } from "../controllers/users.controllers";

router.post("/signup", registration);
router.post("/signin", login);

export default router;
