export default function Step3({ data, setData, onNext, onBack }) {
  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-800">
          Tell us about your cycle
        </h2>
        <p className="text-gray-500">
          This helps us personalize your predictions.
        </p>
      </div>

      {/* Cycle Length */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium text-gray-700">
            Cycle length
          </label>
          <span className="text-purple-600 font-semibold">
            {data.cycleLength} days
          </span>
        </div>

        <input
          type="range"
          min="20"
          max="45"
          value={data.cycleLength}
          onChange={(e) =>
            setData({ ...data, cycleLength: Number(e.target.value) })
          }
          className="w-full accent-purple-600"
        />

        <div className="flex justify-between text-xs text-gray-400">
          <span>20</span>
          <span>45</span>
        </div>
      </div>

      {/* Period Length */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium text-gray-700">
            Period length
          </label>
          <span className="text-purple-600 font-semibold">
            {data.periodLength} days
          </span>
        </div>

        <input
          type="range"
          min="2"
          max="10"
          value={data.periodLength}
          onChange={(e) =>
            setData({ ...data, periodLength: Number(e.target.value) })
          }
          className="w-full accent-purple-600"
        />

        <div className="flex justify-between text-xs text-gray-400">
          <span>2</span>
          <span>10</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between pt-4">
        <button
          onClick={onBack}
          className="px-6 py-2 rounded-xl border text-gray-600 hover:bg-gray-50 transition"
        >
          Back
        </button>

        <button
          onClick={onNext}
          className="bg-purple-600 text-white px-8 py-3 rounded-xl font-medium hover:bg-purple-700 transition"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
