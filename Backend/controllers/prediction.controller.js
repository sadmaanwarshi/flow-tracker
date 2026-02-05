import pool from "../config/db.js";
import { predictNextCycle } from "../services/prediction.service.js";
import { calculatePhases } from "../utils/phase.utils.js";

export const getPrediction = async (req, res) => {
  const userId = req.user.id;
  const today = new Date().toISOString().split("T")[0];

  let cycle = null;

  // 1️⃣ ACTIVE CYCLE
  const active = await pool.query(
    `
    SELECT *
    FROM cycle_history
    WHERE user_id=$1
      AND cycle_start <= $2
      AND cycle_end >= $2
    ORDER BY cycle_start DESC
    LIMIT 1
    `,
    [userId, today]
  );

  if (active.rows.length) {
    cycle = active.rows[0];
  }

  // 2️⃣ NEXT UPCOMING CYCLE (predicted OR confirmed)
  if (!cycle) {
    const upcoming = await pool.query(
      `
      SELECT *
      FROM cycle_history
      WHERE user_id=$1
        AND cycle_start > $2
      ORDER BY cycle_start ASC
      LIMIT 1
      `,
      [userId, today]
    );

    if (upcoming.rows.length) {
      cycle = upcoming.rows[0];
    }
  }

  // 3️⃣ LAST CONFIRMED CYCLE (fallback)
  if (!cycle) {
    const last = await pool.query(
      `
      SELECT *
      FROM cycle_history
      WHERE user_id=$1
      ORDER BY cycle_start DESC
      LIMIT 1
      `,
      [userId]
    );

    cycle = last.rows[0];
  }

  // 4️⃣ FIRST-TIME SAFETY
  if (!cycle) {
    const prediction = await predictNextCycle(userId);

    const inserted = await pool.query(
      `
      INSERT INTO cycle_history
        (user_id, cycle_start, cycle_end, cycle_length, period_length, is_predicted, needs_verification)
      VALUES ($1,$2,$3,$4,$5,true,true)
      RETURNING *
      `,
      [
        userId,
        prediction.nextStart,
        prediction.nextEnd,
        prediction.cycleLength,
        prediction.periodLength,
      ]
    );

    cycle = inserted.rows[0];
  }

  // 5️⃣ PHASES — MUST USE SAME CYCLE DATA
  const phases = calculatePhases(
    cycle.cycle_start,
    cycle.cycle_length,
    cycle.period_length
  );

  res.json({
    cycleId: cycle.id,
    prediction_accuracy: cycle.prediction_accuracy,
    prediction: {
      nextStart: cycle.cycle_start,
      nextEnd: cycle.cycle_end,
      cycleLength: cycle.cycle_length,
      periodLength: cycle.period_length,
    },
    phases,
  });
};
