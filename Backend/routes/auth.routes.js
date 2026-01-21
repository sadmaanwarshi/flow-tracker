import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../config/db.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = express.Router();

/* Signup */
router.post("/signup", async (req, res) => {
  const { name, email, password, age } = req.body;

  const hashed = await bcrypt.hash(password, 10);

  const result = await pool.query(
    `INSERT INTO users (name, email, password_hash, age)
     VALUES ($1,$2,$3,$4)
     RETURNING id, name, email, is_setup_completed`,
    [name, email, hashed, age]
  );

  const user = result.rows[0];

  const token = jwt.sign(user, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.json({ token, user });
});

/* Login */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const result = await pool.query(
    "SELECT * FROM users WHERE email=$1",
    [email]
  );

  const user = result.rows[0];
  if (!user) return res.status(400).json({ message: "Invalid credentials" });

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) return res.status(400).json({ message: "Invalid credentials" });

  const payload = {
    id: user.id,
    name: user.name,
    email: user.email,
    is_setup_completed: user.is_setup_completed,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.json({ token, user: payload });
});

/* Restore user on refresh */
router.get("/me", authenticate, (req, res) => {
  res.json({ user: req.user });
});

export default router;
