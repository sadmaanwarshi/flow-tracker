import express from "express";
import { predictionFeedback } from "../controllers/cycle.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/feedback", authenticate, predictionFeedback);

export default router;
