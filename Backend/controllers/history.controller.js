import pool from "../config/db.js";

export const getHistory = async (req, res) => {
  const userId = req.user.id;

  const history = await pool.query(
    `SELECT cycle_start, cycle_end, cycle_length,
            period_length, is_predicted, prediction_accuracy
     FROM cycle_history
     WHERE user_id=$1
     ORDER BY cycle_start DESC`,
    [userId]
  );

  res.json(history.rows);
};
