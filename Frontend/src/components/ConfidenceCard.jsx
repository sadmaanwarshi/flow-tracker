export default function ConfidenceCard({ value }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow">
      <h2 className="font-semibold mb-2">Prediction Confidence</h2>
      <div className="text-4xl font-bold text-purple-600">
        {value}%
      </div>
      <p className="text-sm text-gray-500 mt-2">
        Improves as you use the app
      </p>
    </div>
  );
}
