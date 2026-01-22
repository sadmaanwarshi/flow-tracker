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
    confirmPassword: "",
    age: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Real-time password match state
  const passwordsMatch =
    form.password &&
    form.confirmPassword &&
    form.password === form.confirmPassword;

  const passwordsMismatch =
    form.confirmPassword &&
    form.password !== form.confirmPassword;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!passwordsMatch) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...payload } = form;
      const user = await signup(payload);

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
          <p className="bg-red-100 text-red-700 p-2 rounded mb-4 text-sm text-center">
            {error}
          </p>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Name */}
          <input
            name="name"
            placeholder="Full name"
            required
            disabled={loading}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-purple-50 border border-purple-100 focus:ring-2 focus:ring-purple-400"
          />

          {/* Email */}
          <input
            name="email"
            type="email"
            placeholder="Email address"
            required
            disabled={loading}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-purple-50 border border-purple-100 focus:ring-2 focus:ring-purple-400"
          />

          {/* Password */}
          <div className="relative">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              required
              disabled={loading}
              onChange={handleChange}
              className="w-full px-4 py-3 pr-12 rounded-xl bg-purple-50 border border-purple-100 focus:ring-2 focus:ring-purple-400"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <input
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm password"
              required
              disabled={loading}
              onChange={handleChange}
              className={`w-full px-4 py-3 pr-12 rounded-xl bg-purple-50 border ${
                passwordsMatch
                  ? "border-green-400"
                  : passwordsMismatch
                  ? "border-red-400"
                  : "border-purple-100"
              } focus:ring-2 focus:ring-purple-400`}
            />
            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showConfirmPassword ? "🙈" : "👁️"}
            </button>
          </div>

          {/* Live Match Message */}
          {passwordsMatch && (
            <p className="text-green-600 text-sm">
              ✔ Passwords match
            </p>
          )}
          {passwordsMismatch && (
            <p className="text-red-600 text-sm">
              ✖ Passwords do not match
            </p>
          )}

          {/* Age */}
          <input
            name="age"
            type="number"
            placeholder="Age"
            required
            disabled={loading}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-purple-50 border border-purple-100 focus:ring-2 focus:ring-purple-400"
          />

          {/* Submit */}
          <button
            disabled={loading || !passwordsMatch}
            className="w-full bg-purple-600 text-white py-3 rounded-xl hover:bg-purple-700 transition disabled:opacity-50"
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
