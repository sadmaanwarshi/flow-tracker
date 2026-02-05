import express from "express";
import { getPrediction } from "../controllers/prediction.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { getPredictionForVerification } from "../controllers/prediction.verify.controller.js";
import { confirmPrediction } from "../controllers/prediction.confirm.controller.js";

const router = express.Router();

router.get("/", authenticate, getPrediction);
router.get("/verify", authenticate, getPredictionForVerification);
router.post("/confirm", authenticate, confirmPrediction);

export default router;
