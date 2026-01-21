export default function ProgressBar({ step, total }) {
  return (
    <div className="mb-6">
      <div className="h-2 bg-slate-200 rounded">
        <div className="h-2 bg-purple-500 rounded" style={{ width: `${(step / total) * 100}%` }} />
      </div>
      <p className="text-xs text-center mt-2">Step {step} of {total}</p>
    </div>
  );
}
