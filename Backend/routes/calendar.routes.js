import express from "express";
import { getCalendar } from "../controllers/calendar.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", authenticate, getCalendar);

export default router;
