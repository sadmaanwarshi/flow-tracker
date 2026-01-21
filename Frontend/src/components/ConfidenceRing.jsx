export default function ConfidenceRing({ value }) {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="bg-white p-6 rounded-2xl shadow flex flex-col items-center">
      <h2 className="font-semibold mb-4">Prediction Confidence</h2>

      <svg width="140" height="140">
        <circle
          cx="70"
          cy="70"
          r={radius}
          stroke="#eee"
          strokeWidth="10"
          fill="none"
        />
        <circle
          cx="70"
          cy="70"
          r={radius}
          stroke="#7c3aed"
          strokeWidth="10"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 70 70)"
        />
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dy="8"
          className="fill-purple-700 font-bold text-xl"
        >
          {value}%
        </text>
      </svg>

      <p className="text-sm text-gray-500 mt-2 text-center">
        Improves as predictions are confirmed
      </p>
    </div>
  );
}
