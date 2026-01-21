// controllers/setup.controller.js
import pool from "../config/db.js";

export const setupCycle = async (req, res) => {
  const userId = req.user.id;
  const { lastPeriodDate, cycleLength, periodLength } = req.body;

  // Allow setup only once
  const exists = await pool.query(
    "SELECT 1 FROM menstrual_profiles WHERE user_id=$1",
    [userId]
  );

  if (exists.rows.length) {
    return res.status(400).json({ message: "Setup already completed" });
  }

  // Save profile
  await pool.query(
    `INSERT INTO menstrual_profiles
     (user_id, last_period_start, average_cycle_length, average_period_length)
     VALUES ($1,$2,$3,$4)`,
    [userId, lastPeriodDate, cycleLength, periodLength]
  );

  // ✅ FIRST CONFIRMED PERIOD (not prediction)
  const cycleStart = new Date(lastPeriodDate);
  const cycleEnd = new Date(lastPeriodDate);
  cycleEnd.setDate(cycleEnd.getDate() + periodLength - 1);

  await pool.query(
    `INSERT INTO cycle_history
     (user_id, cycle_start, cycle_end, cycle_length, period_length, is_predicted)
     VALUES ($1,$2,$3,$4,$5,false)`,
    [userId, cycleStart, cycleEnd, cycleLength, periodLength]
  );

  // Init confidence
  await pool.query(
    "INSERT INTO confidence_scores (user_id) VALUES ($1)",
    [userId]
  );

  await pool.query(
    "UPDATE users SET is_setup_completed=true WHERE id=$1",
    [userId]
  );

  res.json({ message: "Setup completed successfully" });
};
