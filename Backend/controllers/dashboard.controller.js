import pool from "../config/db.js";

export const dashboardSummary = async (req, res) => {
  const userId = req.user.id;

  const user = await pool.query(
    "SELECT name, age FROM users WHERE id=$1",
    [userId]
  );

  const profile = await pool.query(
    "SELECT * FROM menstrual_profiles WHERE user_id=$1",
    [userId]
  );

  const confidence = await pool.query(
    "SELECT confidence_percent FROM confidence_scores WHERE user_id=$1",
    [userId]
  );

  res.json({
    user: user.rows[0],
    cycleProfile: profile.rows[0],
    confidence: confidence.rows[0]?.confidence_percent ?? 30,
  });
};
