// services/prediction.service.js
import pool from "../config/db.js";

export const predictNextCycle = async (userId) => {
  const history = await pool.query(
    `SELECT cycle_start, cycle_length, period_length
     FROM cycle_history
     WHERE user_id=$1
     ORDER BY cycle_start DESC
     LIMIT 5`,
    [userId]
  );

  const rows = history.rows;

  // Fallback defaults
  let avgCycle = 28;
  let avgPeriod = 5;

  if (rows.length) {
    avgCycle = Math.round(
      rows.reduce((s, r) => s + r.cycle_length, 0) / rows.length
    );

    avgPeriod = Math.round(
      rows.reduce((s, r) => s + r.period_length, 0) / rows.length
    );
  }

  const lastStart = new Date(rows[0].cycle_start);

  const nextStart = new Date(lastStart);
  nextStart.setDate(nextStart.getDate() + avgCycle);

  const nextEnd = new Date(nextStart);
  nextEnd.setDate(nextEnd.getDate() + avgPeriod - 1);

  return {
    nextStart,
    nextEnd,
    cycleLength: avgCycle,
    periodLength: avgPeriod,
  };
};
