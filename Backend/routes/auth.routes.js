import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../config/db.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = express.Router();

/* Signup */
router.post("/signup", async (req, res) => {
  
  try {
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

    res.status(201).json({ token, user });

  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ message: "An account with this email already exists." });
    }

    console.error("Signup Route Error:", error);
    res.status(500).json({ message: "An unexpected error occurred. Please try again." });
  }
});

/* Login */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    const user = result.rows[0];
    
    // Security best practice: Same message for wrong email or wrong password
    const securityMessage = "Invalid credentials. Please check your email and password.";

    if (!user) return res.status(401).json({ message: securityMessage });

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ message: securityMessage });

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

  } catch (error) {
    console.error("Login Route Error:", error);
    res.status(500).json({ message: "An unexpected error occurred during login." });
  }
});

/* Restore user on refresh */
router.get("/me", authenticate, (req, res) => {
  res.json({ user: req.user });
});

export default router;
