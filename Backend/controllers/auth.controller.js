import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../config/db.js";

export const signup = async (req, res) => {
  const { name, email, age, password } = req.body;

  const hashed = await bcrypt.hash(password, 10);

  const user = await pool.query(
    `INSERT INTO users (name, email, age, password_hash)
     VALUES ($1,$2,$3,$4)
     RETURNING id, name, email, age, is_setup_completed`,
    [name, email, age, hashed]
  );

  const token = jwt.sign(
    { id: user.rows[0].id },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({ token, user: user.rows[0] });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await pool.query(
    "SELECT * FROM users WHERE email=$1",
    [email]
  );

  if (!user.rows.length)
    return res.status(404).json({ message: "User not found" });

  const valid = await bcrypt.compare(
    password,
    user.rows[0].password_hash
  );

  if (!valid)
    return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign(
    { id: user.rows[0].id },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({
    token,
    user: {
      id: user.rows[0].id,
      name: user.rows[0].name,
      age: user.rows[0].age,
      is_setup_completed: user.rows[0].is_setup_completed,
    },
  });
};
