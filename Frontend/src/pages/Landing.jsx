import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="bg-gradient-to-br from-pink-50 to-purple-100 min-h-screen">
      {/* ================= NAVBAR ================= */}
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2 text-purple-700 font-bold text-xl">
          <span className="bg-purple-600 text-white p-2 rounded-xl">🗓</span>
          FlowTrack
        </div>

        <div className="flex gap-4">
          <Link
            to="/login"
            className="text-gray-600 hover:text-purple-600"
          >
            Log In
          </Link>
          <Link
            to="/signup"
            className="bg-purple-600 text-white px-4 py-2 rounded-xl hover:bg-purple-700"
          >
            Sign Up
          </Link>
        </div>
      </nav>

      {/* ================= HERO ================= */}
      <section className="text-center px-6 py-24">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
          Track Your Cycle with{" "}
          <span className="text-purple-600">Confidence</span>
        </h1>

        <p className="mt-6 max-w-2xl mx-auto text-gray-600 text-lg">
          A modern, privacy-focused period tracker designed to help you
          understand your body and plan ahead with accurate predictions.
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <Link
            to="/signup"
            className="bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700"
          >
            Get Started Free
          </Link>
          <Link
            to="/login"
            className="border border-purple-600 text-purple-600 px-6 py-3 rounded-xl hover:bg-purple-50"
          >
            Sign In
          </Link>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-14">
          Everything You Need to Track Your Health
        </h2>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <FeatureCard
            title="Cycle Tracking"
            desc="Track your menstrual cycle with confidence and predict upcoming periods accurately."
            icon="📅"
          />
          <FeatureCard
            title="Insights & Trends"
            desc="Understand your cycle patterns with detailed analytics and personalized insights."
            icon="📈"
          />
          <FeatureCard
            title="Privacy First"
            desc="Your health data stays private and secure. We never share your personal information."
            icon="🔒"
          />
          <FeatureCard
            title="Smart Reminders"
            desc="Get timely notifications about your upcoming period and fertile window."
            icon="⏰"
          />
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="max-w-4xl mx-auto px-6 py-20">
        <div className="bg-white rounded-3xl shadow-lg p-10 text-center">
          <h3 className="text-3xl font-bold text-gray-800">
            Ready to Start Tracking?
          </h3>
          <p className="text-gray-600 mt-4">
            Join thousands of people who trust FlowTrack to understand their
            menstrual health better.
          </p>

          <Link
            to="/signup"
            className="mt-8 inline-block bg-purple-600 text-white px-8 py-4 rounded-xl hover:bg-purple-700"
          >
            Create Your Free Account
          </Link>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="text-center text-sm text-gray-500 py-8">
        © 2026 FlowTrack. Your health, your data, your privacy.
        <br />
        This app is for tracking purposes only and is not a substitute for
        professional medical advice.
      </footer>
    </div>
  );
}

/* ---------- Feature Card Component ---------- */
function FeatureCard({ title, desc, icon }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
      <div className="text-3xl mb-4">{icon}</div>
      <h4 className="font-semibold text-lg mb-2">{title}</h4>
      <p className="text-sm text-gray-600">{desc}</p>
    </div>
  );
}
