// controllers/prediction.controller.js
import pool from "../config/db.js";
import { predictNextCycle } from "../services/prediction.service.js";
import { calculatePhases } from "../utils/phase.utils.js";

export const getPrediction = async (req, res) => {
  const userId = req.user.id;
  const today = new Date();

  // 1️⃣ ACTIVE PERIOD (highest priority)
  const active = await pool.query(
    `SELECT *
     FROM cycle_history
     WHERE user_id=$1
       AND cycle_start <= $2
       AND cycle_end >= $2
     ORDER BY cycle_start DESC
     LIMIT 1`,
    [userId, today]
  );

  let cycle = active.rows[0];

  // 2️⃣ FUTURE PREDICTION
  if (!cycle) {
    const future = await pool.query(
      `SELECT *
       FROM cycle_history
       WHERE user_id=$1
         AND is_predicted=true
         AND cycle_start > $2
       ORDER BY cycle_start ASC
       LIMIT 1`,
      [userId, today]
    );

    cycle = future.rows[0];
  }

  // 3️⃣ CLEAN OLD PREDICTIONS
  await pool.query(
    `UPDATE cycle_history
     SET is_predicted=false
     WHERE user_id=$1
       AND is_predicted=true
       AND cycle_end < $2`,
    [userId, today]
  );

  // 4️⃣ CREATE NEW PREDICTION IF NEEDED
  if (!cycle) {
    const prediction = await predictNextCycle(userId);

    const inserted = await pool.query(
      `INSERT INTO cycle_history
       (user_id, cycle_start, cycle_end, cycle_length, period_length, is_predicted)
       VALUES ($1,$2,$3,$4,$5,true)
       RETURNING *`,
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
