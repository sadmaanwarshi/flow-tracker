import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import { useAuth } from "../../context/AuthContext";

import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import Step4 from "./Step4";

export default function SetupWizard() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    lastPeriodDate: "",
    cycleLength: 28,
    periodLength: 5,
  });

  const navigate = useNavigate();
  const { setUser } = useAuth();

  const next = () => setStep((s) => s + 1);
  const back = () => setStep((s) => s - 1);

  const submitSetup = async () => {
    try {
      setLoading(true);
      await api.post("/setup", formData);

      // 🔥 Update auth state
      setUser((prev) => ({
        ...prev,
        is_setup_completed: true,
      }));

      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Setup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100 flex items-center justify-center">
      <div className="bg-white w-full max-w-2xl p-8 rounded-3xl shadow-lg">
        <Progress step={step} />

        {step === 1 && <Step1 onNext={next} />}
        {step === 2 && (
          <Step2
            data={formData}
            setData={setFormData}
            onNext={next}
            onBack={back}
          />
        )}
        {step === 3 && (
          <Step3
            data={formData}
            setData={setFormData}
            onNext={next}
            onBack={back}
          />
        )}
        {step === 4 && (
          <Step4
            data={formData}
            onBack={back}
            onSubmit={submitSetup}
            loading={loading}
          />
        )}
      </div>
    </div>
  );
}

function Progress({ step }) {
  return (
    <>
      <div className="h-2 bg-gray-200 rounded-full mb-4">
        <div
          className="h-full bg-purple-600 rounded-full transition-all"
          style={{ width: `${(step / 4) * 100}%` }}
        />
      </div>
      <p className="text-center text-sm text-gray-500 mb-6">
        Step {step} of 4
      </p>
    </>
  );
}
