export default function Step1({ onNext }) {
  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="text-center space-y-3">
        <h2 className="text-3xl font-bold text-gray-800">
          Welcome to FlowTrack!
        </h2>
        <p className="text-gray-500 max-w-md mx-auto">
          Let’s get your account set up. We’ll ask a few questions to
          personalize your tracking experience.
        </p>
      </div>

      {/* Info Card */}
      <div className="bg-pink-50 rounded-2xl p-6 text-left max-w-lg mx-auto">
        <h3 className="font-semibold text-gray-800 mb-3">
          What to Expect:
        </h3>

        <ul className="space-y-2 text-gray-600 text-sm">
          <li className="flex items-start gap-2">
            <span className="text-purple-500 mt-1">•</span>
            We’ll ask about your last period date
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-500 mt-1">•</span>
            Your average cycle and period length
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-500 mt-1">•</span>
            A quick medical disclaimer
          </li>
        </ul>
      </div>

      {/* CTA */}
      <div className="flex justify-end">
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
