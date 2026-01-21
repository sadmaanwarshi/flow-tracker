import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import setupRoutes from "./routes/setup.routes.js";
import predictionRoutes from "./routes/prediction.routes.js";
import cycleRoutes from "./routes/cycle.routes.js";
import calendarRoutes from "./routes/calendar.routes.js";
import historyRoutes from "./routes/history.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";

dotenv.config();

const app = express();

app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/setup", setupRoutes);
app.use("/api/prediction", predictionRoutes);
app.use("/api/cycle", cycleRoutes);
app.use("/api/calendar", calendarRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.get("/", (req, res) => {
  res.send("🚀 Period Tracker API Running");
});

app.listen(5000, () => {
  console.log("🚀 Server running on port 5000");
});
