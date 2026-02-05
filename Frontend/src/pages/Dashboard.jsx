import { useEffect, useState, useCallback } from "react";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";
import { formatDate } from "../utils/dateFormat";

import PhaseCard from "../components/PhaseCard";
import ConfidenceRing from "../components/ConfidenceRing";
import HistoryTable from "../components/HistoryTable";
import PhaseDetailsModal from "../components/PhaseDetailsModal";
import EditPrediction from "../components/EditPrediction";
import PredictionVerifyModal from "../components/PredictionVerifyModal";
import EditPredictionModal from "../components/EditPredictionModal";

export default function Dashboard() {
  const { logout } = useAuth();

  const [summary, setSummary] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedPhase, setSelectedPhase] = useState(null);
  const [selectedPhaseData, setSelectedPhaseData] = useState(null);

  // 🔔 Verification UX state
  const [verifyData, setVerifyData] = useState(null);
  const [showVerify, setShowVerify] = useState(false);

  // ✏️ Force-open edit modal
  const [forceEdit, setForceEdit] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);


  // ================= LOAD DASHBOARD =================
  const loadDashboard = useCallback(async () => {
    try {
      const [s, p, h, v] = await Promise.all([
        api.get("/dashboard"),
        api.get("/prediction"),
        api.get("/history"),
        api.get("/prediction/verify"),
      ]);

      setSummary(s.data);
      setPrediction(p.data);
      setHistory(h.data);

      // Show verification popup if needed
      if (v.data.status === "pending_verification" && !showVerify) {
        setVerifyData(v.data);
        setShowVerify(true);
      }
    } catch (err) {
      console.error("Failed to load dashboard", err);
    } finally {
      setLoading(false);
    }
  }, [showVerify]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  // ================= VERIFY ACTIONS =================
  const confirmPrediction = async () => {
    try {
      await api.post("/prediction/confirm", {
        cycleId: verifyData.cycleId,
      });

      setShowVerify(false);
      setVerifyData(null);
      loadDashboard();
    } catch (err) {
      console.error("Prediction confirmation failed", err);
    }
  };

  const editPrediction = () => {
    setShowVerify(false);
     setShowEditModal(true);
  };

  if (loading || !summary || !prediction) {
    return <p className="p-6">Loading dashboard...</p>;
  }

  return (
    <div className="p-6 space-y-10 bg-gray-50 min-h-screen">
      {/* ================= HEADER ================= */}
      <header className="sticky top-0 z-40 backdrop-blur bg-white/80 border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center text-white font-bold">
              F
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-800">FlowTracker</h1>
              <p className="text-xs text-gray-500">Your cycle, simplified</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-gray-700">
                {summary.user.name}
              </p>
              <p className="text-xs text-gray-500">
                Confidence {summary.confidence}%
              </p>
            </div>

            <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-semibold">
              {summary.user.name.charAt(0).toUpperCase()}
            </div>

            <button
              onClick={logout}
              className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* ================= NEXT PERIOD CARD ================= */}
      <section className="relative bg-gradient-to-br from-purple-600 to-pink-500 text-white rounded-3xl shadow-xl p-8">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-sm uppercase tracking-wide text-purple-100">
              Next Period
            </h2>
            <p className="text-xs text-purple-200">
              Based on your cycle history
            </p>
          </div>

          <EditPrediction
            prediction={prediction}
            onUpdated={() => {
              setForceEdit(false);
              loadDashboard();
            }}
            variant="icon"
            forceOpen={forceEdit}
          />
        </div>

        <div className="mt-8 text-center">
          <p className="text-4xl font-bold">
            {formatDate(prediction.prediction.nextStart)}
          </p>
          <p className="mt-2 text-sm bg-white/20 inline-block px-4 py-1 rounded-full">
            Ends on {formatDate(prediction.prediction.nextEnd)}
          </p>
        </div>
      </section>

      {/* ================= VERIFY MODAL ================= */}
      {showVerify && verifyData && (
        <PredictionVerifyModal
          data={verifyData}
          onConfirm={confirmPrediction}
          onEdit={editPrediction}
          onClose={() => setShowVerify(false)}
        />
      )}

      {/* ================= CONFIDENCE ================= */}
      <ConfidenceRing value={summary.confidence} />

      {/* ================= PHASES ================= */}
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

      {/* ================= FERTILE WINDOW ================= */}
      <section className="bg-pink-50 border border-pink-200 rounded-2xl p-6 text-center">
        <p className="text-sm text-gray-700">
          <strong className="text-pink-600">Fertile Window</strong>
        </p>
        <p className="mt-2 text-lg font-semibold">
          {formatDate(prediction.phases.fertileWindow.start)} →{" "}
          {formatDate(prediction.phases.fertileWindow.end)}
        </p>
      </section>

      {/* ================= HISTORY ================= */}
      <HistoryTable data={history} />

      {/* ================= PHASE DETAILS MODAL ================= */}
      {selectedPhase && (
        <PhaseDetailsModal
          phase={selectedPhase}
          data={selectedPhaseData}
          onClose={() => setSelectedPhase(null)}
        />
      )}

{showEditModal && prediction && (
  <EditPredictionModal
    cycleId={verifyData?.cycleId}
    current={{
      nextStart: prediction.prediction.nextStart,
      nextEnd: prediction.prediction.nextEnd,
      periodLength: prediction.prediction.periodLength,
    }}
    onClose={() => setShowEditModal(false)}
    onSaved={() => {
      setShowEditModal(false);
      setVerifyData(null);
      loadDashboard();
    }}
  />
)}



    </div>
  );
}
