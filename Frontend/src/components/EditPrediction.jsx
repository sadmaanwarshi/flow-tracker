import { useState } from "react";
import EditPredictionModal from "./EditPredictionModal";

export default function EditPrediction({ prediction, onUpdated, variant }) {
  const [open, setOpen] = useState(false);

  /* ✅ Already edited / finalized */
  if (prediction.prediction_accuracy !== null) {
    return (
      <div
        className={
          variant === "icon"
            ? "flex items-center gap-2 text-xs text-green-200"
            : "flex justify-end"
        }
      >
        <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
          ✓ Dates updated
        </span>
      </div>
    );
  }

  /* ✏️ Editable */
  return (
    <>
      {variant === "icon" ? (
        <button
          onClick={() => setOpen(true)}
          className="
            inline-flex items-center gap-2
            bg-white/20 hover:bg-white/30
            px-4 py-2 rounded-full
            text-white text-sm font-medium
            transition
          "
          title="Edit predicted dates"
        >
          ✏️ Edit
        </button>
      ) : (
        <div className="flex justify-end">
          <button
            onClick={() => setOpen(true)}
            className="
              inline-flex items-center gap-2
              bg-purple-50 hover:bg-purple-100
              text-purple-700
              px-4 py-2 rounded-full
              text-sm font-medium
              transition
            "
          >
            ✏️ Edit prediction
          </button>
        </div>
      )}

      {open && (
        <EditPredictionModal
          cycleId={prediction.cycleId}
          current={prediction.prediction}
          onClose={() => setOpen(false)}
          onSaved={() => {
            setOpen(false);
            onUpdated();
          }}
        />
      )}
    </>
  );
}
