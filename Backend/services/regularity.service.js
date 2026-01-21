import pool from "../config/db.js";

export const detectRegularity = async (userId) => {
  const result = await pool.query(
    `SELECT cycle_length FROM cycle_history
     WHERE user_id=$1 AND is_predicted=false
     ORDER BY cycle_start DESC
     LIMIT 5`,
    [userId]
  );

  if (result.rows.length < 3) return "Not enough data";

  const lengths = result.rows.map(r => r.cycle_length);
  const avg = lengths.reduce((a, b) => a + b, 0) / lengths.length;

  const maxDeviation = Math.max(
    ...lengths.map(l => Math.abs(l - avg))
  );

  return maxDeviation <= 2 ? "Regular" : "Irregular";
};
