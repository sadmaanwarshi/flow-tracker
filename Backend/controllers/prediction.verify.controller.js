import pool from "../config/db.js";

/**
 * GET /api/prediction/verify
 */
export const getPredictionForVerification = async (req, res) => {
  const userId = req.user.id;
  const today = new Date().toISOString().split("T")[0];

  const result = await pool.query(
    `
    SELECT id, cycle_start, cycle_end
    FROM cycle_history
    WHERE user_id = $1
      AND is_predicted = true
      AND needs_verification = true
      AND cycle_start <= $2
    ORDER BY cycle_start DESC
    LIMIT 1
    `,
    [userId, today]
  );

  if (!result.rows.length) {
    return res.json({ status: "none" });
  }

  const cycle = result.rows[0];

  res.json({
    status: "pending_verification",
    cycleId: cycle.id,
    predictedStart: cycle.cycle_start,
    predictedEnd: cycle.cycle_end,
  });
};
