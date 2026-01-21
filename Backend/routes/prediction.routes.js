import express from "express";
import { getPrediction } from "../controllers/prediction.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", authenticate, getPrediction);

export default router;
