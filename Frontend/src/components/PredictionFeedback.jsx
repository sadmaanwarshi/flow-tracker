import { useState } from "react";
import api from "../api/api";

export default function PredictionFeedback({
  cycleId,
  alreadyAnswered,
  onDone,
}) {
  const [showModal, setShowModal] = useState(false);
  const [actualStart, setActualStart] = useState("");
  const [actualEnd, setActualEnd] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (alreadyAnswered || submitted) return null;

  const submitYes = async () => {
    await api.post("/cycle/feedback", {
      cycleId,
      correct: true,
    });
    setSubmitted(true);
    onDone();
  };

  const submitNo = async () => {
    await api.post("/cycle/feedback", {
      cycleId,
      correct: false,
      actualStart,
      actualEnd,
    });
    setSubmitted(true);
    setShowModal(false);
    onDone();
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow space-y-4">
      <h3 className="font-semibold">
        Was this prediction correct?
      </h3>

      <div className="flex gap-4">
        <button
          onClick={submitYes}
          className="bg-green-500 text-white px-4 py-2 rounded-xl"
        >
          Yes
        </button>
        <button
          onClick={() => setShowModal(true)}
          className="bg-red-500 text-white px-4 py-2 rounded-xl"
        >
          No
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-2xl space-y-4 w-80">
            <h4 className="font-semibold">Update actual dates</h4>

            <input
              type="date"
              value={actualStart}
              onChange={(e) => setActualStart(e.target.value)}
              className="w-full border p-2 rounded"
            />

            <input
              type="date"
              value={actualEnd}
              onChange={(e) => setActualEnd(e.target.value)}
              className="w-full border p-2 rounded"
            />

            <div className="flex justify-between">
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={submitNo}
                disabled={!actualStart || !actualEnd}
                className="bg-purple-600 text-white px-4 py-2 rounded-xl disabled:opacity-50"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
