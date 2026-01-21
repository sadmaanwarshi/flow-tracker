import { useEffect, useState } from "react";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";
import { formatDate } from "../utils/dateFormat";

import PhaseCard from "../components/PhaseCard";
import ConfidenceRing from "../components/ConfidenceRing";
import PredictionFeedback from "../components/PredictionFeedback";
import CalendarView from "../components/CalendarView";
import HistoryTable from "../components/HistoryTable";
import PhaseDetailsModal from "../components/PhaseDetailsModal";
import EditPrediction from "../components/EditPrediction";

export default function Dashboard() {
  const { logout } = useAuth();

  const [summary, setSummary] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [calendar, setCalendar] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedPhase, setSelectedPhase] = useState(null);
const [selectedPhaseData, setSelectedPhaseData] = useState(null);


  const loadDashboard = async () => {
    const [s, p, c, h] = await Promise.all([
      api.get("/dashboard"),
      api.get("/prediction"),
      api.get("/calendar"),
      api.get("/history"),
    ]);

    setSummary(s.data);
    setPrediction(p.data);
    setCalendar(c.data);
    setHistory(h.data);
    setLoading(false);
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  if (loading || !summary || !prediction) {
    return <p className="p-6">Loading dashboard...</p>;
  }

  return (
    <div className="p-6 space-y-10 bg-gray-50 min-h-screen">
      {/* Header */}
      {/* ================= MODERN HEADER ================= */}
<header className="sticky top-0 z-40 backdrop-blur bg-white/80 border-b">
  <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
    
    {/* Left: Brand */}
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center text-white font-bold">
        F
      </div>

      <div className="leading-tight">
        <h1 className="text-lg font-bold text-gray-800">
          FlowTracker
        </h1>
        <p className="text-xs text-gray-500">
          Your cycle, simplified
        </p>
      </div>
    </div>

    {/* Right: User */}
    <div className="flex items-center gap-4">
      <div className="hidden sm:block text-right">
        <p className="text-sm font-medium text-gray-700">
          {summary.user.name}
        </p>
        <p className="text-xs text-gray-500">
          Confidence {summary.confidence}%
        </p>
      </div>

      {/* Avatar */}
      <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-semibold">
        {summary.user.name.charAt(0).toUpperCase()}
      </div>

      {/* Logout */}
      <button
  onClick={logout}
  className="
    bg-red-500 text-white
  px-4 py-2 rounded-full
  hover:bg-red-600
  hover:text-gray-300
    hover:border-red-300
  transition text-sm font-medium
  "
  title="Logout"
>
  Logout
</button>

    </div>
  </div>
</header>


      {/* Highlight Next Period */}
      {/* ================= NEXT PERIOD CARD ================= */}
<section className="relative bg-gradient-to-br from-purple-600 via-purple-500 to-pink-500 text-white rounded-3xl shadow-xl p-8 overflow-hidden">

  {/* Soft background circle */}
  <div className="absolute -top-16 -right-16 w-56 h-56 bg-white/10 rounded-full" />

  {/* Header */}
  <div className="flex justify-between items-start relative z-10">
    <div>
      <h2 className="text-m uppercase tracking-wide text-purple-100">
        Next Period
      </h2>
      <p className="text-xs text-purple-200 mt-1">
        Based on your cycle history
      </p>
    </div>

    <EditPrediction
      prediction={prediction}
      onUpdated={loadDashboard}
      variant="icon"
    />
  </div>

  {/* Dates */}
  <div className="mt-8 text-center relative z-10">
    <p className="text-4xl font-bold leading-tight">
      {formatDate(prediction.prediction.nextStart)}
    </p>

    <div className="mt-3 inline-flex items-center gap-3 bg-white/20 px-5 py-2 rounded-full text-sm">
      <span>
        Ends on <strong>{formatDate(prediction.prediction.nextEnd)}</strong>
      </span>
    </div>
  </div>
</section>



      {/* Confidence */}
      <ConfidenceRing value={summary.confidence} />

      {/* Phases */}
      <div>
  <h2 className="font-semibold mb-4">Cycle Phases</h2>

  <div className="grid md:grid-cols-4 gap-4">
    {Object.entries(prediction.phases).map(
      ([key, value]) =>
        key !== "fertileWindow" && (
          <PhaseCard
            key={key}
            title={key}
            data={value}
            onClick={() => {
              setSelectedPhase(key);
              setSelectedPhaseData(value);
            }}
          />
        )
    )}
  </div>
</div>


      {/* Fertile Window */}
      {/* ================= FERTILE WINDOW ================= */}
<section className="bg-pink-50 border border-pink-200 rounded-2xl p-6 text-center">
  <p className="text-sm text-gray-700">
    <strong className="text-pink-600">Fertile Window</strong>
  </p>
  <p className="mt-2 text-lg font-semibold text-gray-800">
    {formatDate(prediction.phases.fertileWindow.start)}{" "}
    <span className="text-gray-400">→</span>{" "}
    {formatDate(prediction.phases.fertileWindow.end)}
  </p>
  <p className="text-xs text-gray-500 mt-1">
    Higher chances of ovulation during this time
  </p>
</section>


      {/* Feedback */}
      {/* <EditPrediction
  prediction={prediction}
  onUpdated={loadDashboard}
/> */}


      {/* Calendar */}
      {/* <CalendarView data={calendar} /> */}

      {/* History */}
      <HistoryTable data={history} />

      {selectedPhase && (
  <PhaseDetailsModal
    phase={selectedPhase}
    data={selectedPhaseData}
    onClose={() => setSelectedPhase(null)}
  />
)}


    </div>
  );
}
