import pool from "../config/db.js";
import { predictNextCycle } from "../services/prediction.service.js";

/**
 * POST /api/prediction/confirm
 */
export const confirmPrediction = async (req, res) => {
  const userId = req.user.id;
  const { cycleId } = req.body;
  const today = new Date();

  const result = await pool.query(
    `
    SELECT *
    FROM cycle_history
    WHERE id = $1
      AND user_id = $2
      AND is_predicted = true
      AND needs_verification = true
    `,
    [cycleId, userId]
  );

  if (!result.rows.length) {
    return res.status(400).json({
      message: "Prediction already verified or not found",
    });
  }

  const cycle = result.rows[0];

  // 1️⃣ Mark as confirmed
  await pool.query(
    `
    UPDATE cycle_history
    SET
      is_predicted = false,
      needs_verification = false,
      prediction_accuracy = 100
    WHERE id = $1
    `,
    [cycleId]
  );

  // 2️⃣ Increase confidence
  await pool.query(
    `
    UPDATE confidence_scores
    SET confidence_percent = LEAST(95, confidence_percent + 5),
        last_updated = NOW()
    WHERE user_id = $1
    `,
    [userId]
  );

  // 3️⃣ Advance cycle if period is over
  if (new Date(cycle.cycle_end) < today) {
    // Remove any future predictions
    await pool.query(
      `DELETE FROM cycle_history WHERE user_id=$1 AND is_predicted=true`,
      [userId]
    );

    const prediction = await predictNextCycle(userId);

    await pool.query(
      `
      INSERT INTO cycle_history
        (user_id, cycle_start, cycle_end, cycle_length, period_length, is_predicted, needs_verification)
      VALUES ($1,$2,$3,$4,$5,true,true)
      `,
      [
        userId,
        prediction.nextStart,
        prediction.nextEnd,
        prediction.cycleLength,
        prediction.periodLength,
      ]
    );
  }

  res.json({ message: "Prediction confirmed successfully" });
};
