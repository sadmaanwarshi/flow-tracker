import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    age: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const user = await signup(form);
      if (user.is_setup_completed) {
        navigate("/dashboard");
      } else {
        navigate("/setup");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Signup failed. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-lg border p-8">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-2xl">
            📅
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-semibold text-center text-gray-800">
          Welcome to FlowTrack
        </h2>
        <p className="text-center text-gray-500 mt-1 mb-6">
          Create your personal period tracking account
        </p>

        {/* Tabs */}
        <div className="flex bg-gray-100 rounded-full p-1 mb-6">
          <Link
            to="/login"
            className="flex-1 text-center py-2 text-gray-500"
          >
            Log In
          </Link>
          <div className="flex-1 text-center py-2 rounded-full bg-white font-medium text-gray-800 shadow">
            Sign Up
          </div>
        </div>

        {/* Error */}
        {error && (
          <p className="bg-red-100 text-red-700 p-2 rounded mb-4 text-sm">
            {error}
          </p>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-gray-600 block mb-1">
              Full Name
            </label>
            <input
              name="name"
              placeholder="Your name"
              required
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-purple-50 border border-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600 block mb-1">
              Email
            </label>
            <input
              name="email"
              type="email"
              placeholder="you@example.com"
              required
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-purple-50 border border-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600 block mb-1">
              Password
            </label>
            <input
              name="password"
              type="password"
              placeholder="••••••••"
              required
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-purple-50 border border-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600 block mb-1">
              Age
            </label>
            <input
              name="age"
              type="number"
              placeholder="Your age"
              required
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-purple-50 border border-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          <button
            disabled={loading}
            className="w-full bg-purple-600 text-white py-3 rounded-xl hover:bg-purple-700 transition disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center mt-6">
          <Link
            to="/"
            className="text-sm text-purple-600 hover:underline"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
