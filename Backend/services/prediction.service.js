// services/prediction.service.js
import pool from "../config/db.js";

const normalizeDate = (d) =>
  new Date(d).toISOString().split("T")[0];

export const predictNextCycle = async (userId) => {
  const history = await pool.query(
    `SELECT cycle_start, cycle_length, period_length
     FROM cycle_history
     WHERE user_id=$1 AND is_predicted=false
     ORDER BY cycle_start DESC
     LIMIT 5`,
    [userId]
  );

  const rows = history.rows;

  // Defaults
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

  // Validation (ISSUE 4 FIX)
  if (avgCycle < 21 || avgCycle > 35) avgCycle = 28;
  if (avgPeriod < 3 || avgPeriod > 8) avgPeriod = 5;

  // ISSUE 1 FIX: Empty history
  const lastStart = rows.length
    ? new Date(rows[0].cycle_start)
    : new Date();

  const nextStart = new Date(lastStart);
  nextStart.setDate(nextStart.getDate() + avgCycle);

  const nextEnd = new Date(nextStart);
  nextEnd.setDate(nextEnd.getDate() + avgPeriod - 1);

  return {
    nextStart: normalizeDate(nextStart),
    nextEnd: normalizeDate(nextEnd),
    cycleLength: avgCycle,
    periodLength: avgPeriod,
  };
};
