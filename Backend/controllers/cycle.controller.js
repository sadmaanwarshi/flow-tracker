// controllers/cycle.controller.js
import pool from "../config/db.js";
import { diffDays } from "../utils/date.utils.js";
import { predictNextCycle } from "../services/prediction.service.js";

const todayDate = () => new Date().toISOString().split("T")[0];

export const predictionFeedback = async (req, res) => {
  const userId = req.user.id;
  const { cycleId, actualStart, actualEnd } = req.body;

  const today = todayDate();

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

  const predicted = result.rows[0];

  // 2️⃣ Calculate lengths
  const periodLength = diffDays(actualStart, actualEnd) + 1;

  const prev = await pool.query(
    `SELECT cycle_start
     FROM cycle_history
     WHERE user_id=$1
       AND cycle_start < $2
       AND is_predicted=false
     ORDER BY cycle_start DESC
     LIMIT 1`,
    [userId, actualStart]
  );

  let cycleLength = predicted.cycle_length;

  if (prev.rows.length) {
    cycleLength = diffDays(prev.rows[0].cycle_start, actualStart);
  }

  // 3️⃣ Prediction accuracy
  const diff = Math.abs(diffDays(predicted.cycle_start, actualStart));
  const accuracy = Math.max(0, 100 - diff * 10);

  await pool.query(
    `UPDATE cycle_history
     SET cycle_start=$1,
         cycle_end=$2,
         period_length=$3,
         cycle_length=$4,
         is_predicted=false,
         prediction_accuracy=$5
     WHERE id=$6`,
    [actualStart, actualEnd, periodLength, cycleLength, accuracy, cycleId]
  );

  // 4️⃣ Confidence update
  await updateConfidence(userId, accuracy >= 80);

  // 5️⃣ Remove future predictions (ISSUE 3 FIX)
  await pool.query(
    `DELETE FROM cycle_history
     WHERE user_id=$1
       AND is_predicted=true`,
    [userId]
  );

  // 6️⃣ Create next prediction only if period ended
  if (actualEnd < today) {
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

  res.json({ message: "Cycle updated and prediction recalculated" });
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
