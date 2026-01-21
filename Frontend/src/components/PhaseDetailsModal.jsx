import Modal from "./Modal";
import { formatDate } from "../utils/dateFormat";
import { phaseInfo } from "../constants/phaseInfo";

export default function PhaseDetailsModal({ phase, data, onClose }) {
  if (!phase || !data) return null;

  const info = phaseInfo[phase];

  return (
    <Modal isOpen={true} onClose={onClose}>
      <h2 className="text-xl font-bold text-purple-700 mb-2">
        {info.title}
      </h2>

      <p className="text-sm text-gray-600 mb-4">
        {formatDate(data.start)} → {formatDate(data.end)}
      </p>

      <p className="text-gray-700 mb-3">{info.description}</p>

      <div className="bg-purple-50 p-3 rounded-lg text-sm">
        <strong>Tips:</strong> {info.tips}
      </div>
    </Modal>
  );
}
