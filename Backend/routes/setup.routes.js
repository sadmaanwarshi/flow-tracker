import express from "express";
import { setupCycle } from "../controllers/setup.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", authenticate, setupCycle);

export default router;
