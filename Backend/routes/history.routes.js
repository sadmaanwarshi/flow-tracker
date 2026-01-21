import express from "express";
import { getHistory } from "../controllers/history.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", authenticate, getHistory);

export default router;
