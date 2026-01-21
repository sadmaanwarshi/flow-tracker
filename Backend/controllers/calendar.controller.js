import pool from "../config/db.js";
import { calculatePhases } from "../utils/phase.utils.js";

export const getCalendar = async (req, res) => {
  const userId = req.user.id;

  // Show ONLY confirmed cycles
  const cycles = await pool.query(
    `SELECT *
     FROM cycle_history
     WHERE user_id=$1 AND is_predicted=false
     ORDER BY cycle_start DESC`,
    [userId]
  );

  const calendar = cycles.rows.map((c) => ({
    cycleId: c.id,
    start: c.cycle_start,
    end: c.cycle_end,
    phases: calculatePhases(c.cycle_start, c.cycle_length),
  }));

  res.json(calendar);
};
