import { useState } from "react";
import Modal from "./Modal";
import api from "../api/api";

export default function EditPredictionModal({
  cycleId,
  current,
  onClose,
  onSaved,
}) {
  const defaultPeriodLength = current.periodLength || 5;

  const [start, setStart] = useState(current.nextStart || "");
  const [end, setEnd] = useState(current.nextEnd || "");
  const [endTouched, setEndTouched] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const addDays = (dateStr, days) => {
    const d = new Date(dateStr);
    d.setDate(d.getDate() + days);
    return d.toISOString().split("T")[0];
  };

  const handleStartChange = (value) => {
    setStart(value);
    if (!endTouched || new Date(end) < new Date(value)) {
      setEnd(addDays(value, defaultPeriodLength - 1));
    }
  };

  const handleEndChange = (value) => {
    setEnd(value);
    setEndTouched(true);
  };

  const validate = () => {
    if (!start || !end) return "Both start and end dates are required.";
    if (new Date(end) < new Date(start))
      return "End date cannot be before start date.";
    return "";
  };

  const save = async () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");
    setLoading(true);

    try {
      await api.post("/cycle/feedback", {
        cycleId,
        actualStart: start,
        actualEnd: end,
      });
      onSaved();
    } catch {
      setError("Failed to save changes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isDisabled = loading || !start || !end;

  return (
    <Modal isOpen={true} onClose={onClose}>
      <h2 className="text-xl font-bold text-purple-700 mb-2">
        Edit Period Dates
      </h2>

      <p className="text-sm text-gray-600 mb-4">
        Adjust your actual period dates if they differ from the prediction.
      </p>

      {error && (
        <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {error}
        </div>
      )}

      <div className="space-y-5">
        {/* Start Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Period start date
          </label>
          <input
            type="date"
            value={start}
            onChange={(e) => handleStartChange(e.target.value)}
            className="
              w-full px-4 py-3 rounded-xl
              border border-gray-300
              bg-white text-gray-900
              appearance-none
              color-scheme-light
              focus:outline-none focus:ring-2 focus:ring-purple-500
            "
          />
        </div>

        {/* End Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Period end date
          </label>
          <input
            type="date"
            value={end}
            onChange={(e) => handleEndChange(e.target.value)}
            className="
              w-full px-4 py-3 rounded-xl
              border border-gray-300
              bg-white text-gray-900
              appearance-none
              color-scheme-light
              focus:outline-none focus:ring-2 focus:ring-purple-500
            "
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-8">
        <button
          onClick={onClose}
          disabled={loading}
          className="px-4 py-2 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-100"
        >
          Cancel
        </button>

        <button
          onClick={save}
          disabled={isDisabled}
          className="
            bg-purple-600 text-white px-6 py-2 rounded-xl
            hover:bg-purple-700 disabled:opacity-50
          "
        >
          {loading ? "Saving..." : "Save changes"}
        </button>
      </div>
    </Modal>
  );
}
