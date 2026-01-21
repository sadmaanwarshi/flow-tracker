export default function Step2({ data, setData, onNext, onBack }) {
  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="text-center space-y-3">
        <h2 className="text-2xl font-bold text-gray-800">
          When did your last period start?
        </h2>
        <p className="text-gray-500">
          This helps us calculate your cycle and predict upcoming periods.
        </p>
      </div>

      {/* Date Picker */}
      <div className="flex justify-center">
        <div className="relative w-full max-w-sm">
          <input
            type="date"
            value={data.lastPeriodDate}
            onChange={(e) =>
              setData({ ...data, lastPeriodDate: e.target.value })
            }
            required
            className="w-full px-5 py-3 rounded-full bg-purple-50 border border-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-400 text-gray-700"
          />
        </div>
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
          onClick={onNext}
          disabled={!data.lastPeriodDate}
          className="bg-purple-600 text-white px-8 py-3 rounded-xl font-medium hover:bg-purple-700 transition disabled:opacity-50"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
