import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
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
      const user = await login(form.email.trim(), form.password);

      if (user.is_setup_completed) {
        navigate("/dashboard");
      } else {
        navigate("/setup");
      }
    } catch (err) {
      // 👇 Wrong password / invalid user logic
      if (err.response?.status === 401) {
        setError("Incorrect email or password");
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
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
          Your personal period tracking companion
        </p>

        {/* Tabs */}
        <div className="flex bg-gray-100 rounded-full p-1 mb-6">
          <div className="flex-1 text-center py-2 rounded-full bg-white font-medium text-gray-800 shadow">
            Log In
          </div>
          <Link
            to="/signup"
            className="flex-1 text-center py-2 text-gray-500"
          >
            Sign Up
          </Link>
        </div>

        {/* Error Message */}
        {error && (
          <p className="bg-red-100 text-red-700 p-2 rounded mb-4 text-sm text-center">
            {error}
          </p>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Email */}
          <div>
            <label className="text-sm text-gray-600 block mb-1">
              Email
            </label>
            <input
              name="email"
              type="email"
              placeholder="you@example.com"
              required
              disabled={loading}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-purple-50 border border-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-400 disabled:opacity-60"
            />
          </div>

          {/* Password with Eye Toggle */}
          <div>
            <label className="text-sm text-gray-600 block mb-1">
              Password
            </label>

            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                required
                disabled={loading}
                onChange={handleChange}
                className="w-full px-4 py-3 pr-12 rounded-xl bg-purple-50 border border-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-400 disabled:opacity-60"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {/* Forgot Password */}
          {/* <div className="text-right">
            <Link
              to="/forgot-password"
              className="text-sm text-purple-600 hover:underline"
            >
              Forgot password?
            </Link>
          </div> */}

          {/* Submit */}
          <button
            disabled={loading}
            className="w-full bg-purple-600 text-white py-3 rounded-xl hover:bg-purple-700 transition disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Log In"}
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
