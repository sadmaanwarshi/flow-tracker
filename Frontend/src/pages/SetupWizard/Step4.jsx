import { formatDate } from "../../utils/dateFormat";

export default function Step4({ data, onBack, onSubmit, loading }) {
  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-800">
          Review your details
        </h2>
        <p className="text-gray-500">
          Please confirm the information below before finishing setup.
        </p>
      </div>

      {/* Summary Card */}
      <div className="bg-purple-50 rounded-2xl p-6 space-y-4">
        <div className="flex justify-between">
          <span className="text-gray-600">Last period started</span>
          <span className="font-semibold text-gray-800">
            {formatDate(data.lastPeriodDate)}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">Cycle length</span>
          <span className="font-semibold text-gray-800">
            {data.cycleLength} days
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">Period length</span>
          <span className="font-semibold text-gray-800">
            {data.periodLength} days
          </span>
        </div>
      </div>

      {/* Medical Disclaimer */}
      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl text-sm text-gray-700">
        <strong>Medical Disclaimer:</strong> This app is for tracking
        purposes only and is not a substitute for professional medical
        advice. Predictions may vary based on individual health factors.
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center pt-4">
        <button
          onClick={onBack}
          className="px-6 py-2 rounded-xl border text-gray-600 hover:bg-gray-50 transition"
        >
          Back
        </button>

        <button
          onClick={onSubmit}
          disabled={loading}
          className="bg-purple-600 text-white px-8 py-3 rounded-xl font-medium hover:bg-purple-700 transition disabled:opacity-50"
        >
          {loading ? "Saving..." : "Finish Setup"}
        </button>
      </div>
    </div>
  );
}
