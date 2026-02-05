import Modal from "./Modal";
import { formatDate } from "../utils/dateFormat";

export default function PredictionVerifyModal({
  data,
  onConfirm,
  onEdit,
  onClose,
}) {
  return (
    <Modal isOpen={true} onClose={onClose}>
      <h2 className="text-xl font-bold text-purple-700 mb-2">
        Was our prediction accurate?
      </h2>

      <p className="text-sm text-gray-600 mb-5">
        We predicted your last period from{" "}
        <strong>{formatDate(data.predictedStart)}</strong> to{" "}
        <strong>{formatDate(data.predictedEnd)}</strong>.
      </p>

      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={onEdit}
          className="px-4 py-2 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-100"
        >
          Edit dates
        </button>

        <button
          onClick={onConfirm}
          className="bg-purple-600 text-white px-6 py-2 rounded-xl hover:bg-purple-700"
        >
          Yes, it was correct
        </button>
      </div>
    </Modal>
  );
}
