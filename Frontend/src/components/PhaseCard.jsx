import { formatDate } from "../utils/dateFormat";

const PHASE_UI = {
  menstrual: {
    bg: "bg-rose-50",
    border: "border-rose-200 hover:border-rose-400",
    title: "text-rose-700",
    dot: "bg-rose-500",
    emoji: "🩸",
  },
  follicular: {
    bg: "bg-orange-50",
    border: "border-orange-200 hover:border-orange-400",
    title: "text-orange-700",
    dot: "bg-orange-500",
    emoji: "🌱",
  },
  ovulation: {
    bg: "bg-green-50",
    border: "border-green-200 hover:border-green-400",
    title: "text-green-700",
    dot: "bg-green-500",
    emoji: "🌸",
  },
  luteal: {
    bg: "bg-indigo-50",
    border: "border-indigo-200 hover:border-indigo-400",
    title: "text-indigo-700",
    dot: "bg-indigo-500",
    emoji: "🌙",
  },
};

export default function PhaseCard({ title, data, onClick }) {
  const key = title.toLowerCase();
  const ui = PHASE_UI[key] || PHASE_UI.luteal;

  return (
    <div
      onClick={onClick}
      className={`
        relative p-5 rounded-2xl cursor-pointer
        border ${ui.border} ${ui.bg}
        transition-all hover:shadow-lg hover:-translate-y-1
      `}
    >
      {/* Accent dot */}
      <div
        className={`absolute top-4 right-4 w-3 h-3 rounded-full ${ui.dot}`}
      />

      {/* Title */}
      <h3
        className={`
          capitalize font-semibold mb-2 text-center
          ${ui.title}
        `}
      >
        <span className="mr-1">{ui.emoji}</span>
        {title}
      </h3>

      {/* Dates (LOGIC PRESERVED) */}
      <p className="text-sm font-medium text-center text-gray-800">
        {formatDate(data.start || data.date)}
        {data.end && (
          <>
            <br />
            <span className="text-gray-400">→</span>
            <br />
            {formatDate(data.end)}
          </>
        )}
      </p>

      {/* Footer hint */}
      <p className="text-xs text-gray-500 text-center mt-3">
        Tap to view details
      </p>
    </div>
  );
}
