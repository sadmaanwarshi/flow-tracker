// controllers/cycle.controller.js
import pool from "../config/db.js";
import { diffDays } from "../utils/date.utils.js";
import { predictNextCycle } from "../services/prediction.service.js";

export const predictionFeedback = async (req, res) => {
  const userId = req.user.id;
  const { cycleId, actualStart, actualEnd } = req.body;

  const today = new Date();
  const endDate = new Date(actualEnd);

  // 1️⃣ Editable only once
  const result = await pool.query(
    `SELECT *
     FROM cycle_history
     WHERE id=$1
       AND user_id=$2
       AND prediction_accuracy IS NULL`,
    [cycleId, userId]
  );

  if (!result.rows.length) {
    return res.status(400).json({ message: "Prediction already finalized" });
  }

  // 2️⃣ UPDATE PERIOD (NOT cycle_length)
  const periodLength = diffDays(actualStart, actualEnd) + 1;

  await pool.query(
    `UPDATE cycle_history
     SET cycle_start=$1,
         cycle_end=$2,
         period_length=$3,
         is_predicted=false,
         prediction_accuracy=false
     WHERE id=$4`,
    [actualStart, actualEnd, periodLength, cycleId]
  );

  // 3️⃣ CONFIDENCE ↓
  await updateConfidence(userId, false);

  // 4️⃣ CREATE NEXT ONLY IF PERIOD IS OVER
  if (endDate < today) {
    const active = await pool.query(
      `SELECT 1 FROM cycle_history
       WHERE user_id=$1
         AND cycle_start <= $2
         AND cycle_end >= $2`,
      [userId, today]
    );

    if (!active.rows.length) {
      const prediction = await predictNextCycle(userId);

      await pool.query(
        `INSERT INTO cycle_history
         (user_id, cycle_start, cycle_end, cycle_length, period_length, is_predicted)
         VALUES ($1,$2,$3,$4,$5,true)`,
        [
          userId,
          prediction.nextStart,
          prediction.nextEnd,
          prediction.cycleLength,
          prediction.periodLength,
        ]
      );
    }
  }

  res.json({ message: "Cycle updated correctly" });
};

const updateConfidence = async (userId, success) => {
  const delta = success ? 5 : -3;

  await pool.query(
    `UPDATE confidence_scores
     SET confidence_percent = LEAST(95, GREATEST(30, confidence_percent + $1)),
         last_updated=NOW()
     WHERE user_id=$2`,
    [delta, userId]
  );
};
