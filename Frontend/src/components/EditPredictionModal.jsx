import { useState } from "react";
import Modal from "./Modal";
import api from "../api/api";

export default function EditPredictionModal({
  cycleId,
  current,
  onClose,
  onSaved,
}) {
  const [start, setStart] = useState(current.nextStart);
  const [end, setEnd] = useState(current.nextEnd);
  const [loading, setLoading] = useState(false);

  const save = async () => {
    setLoading(true);
    await api.post("/cycle/feedback", {
      cycleId,
      actualStart: start,
      actualEnd: end,
    });
    onSaved();
  };

  return (
    <Modal isOpen={true} onClose={onClose}>
      <h2 className="text-xl font-bold text-purple-700 mb-2">
        Edit Period Dates
      </h2>

      <p className="text-sm text-gray-600 mb-6">
        Adjust your actual period dates if they differ from the prediction.
      </p>

      <div className="space-y-5">
        {/* Start Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Period start date
          </label>
          <input
            type="date"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            className="
              w-full px-4 py-3 rounded-xl
              border border-gray-300
              bg-white text-gray-900
              focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500
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
            onChange={(e) => setEnd(e.target.value)}
            className="
              w-full px-4 py-3 rounded-xl
              border border-gray-300
              bg-white text-gray-900
              focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500
            "
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-8">
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-100"
        >
          Cancel
        </button>

        <button
          onClick={save}
          disabled={loading}
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
