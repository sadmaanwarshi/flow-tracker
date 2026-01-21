import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, requireSetup }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  if (requireSetup && user.is_setup_completed)
    return <Navigate to="/dashboard" replace />;

  if (!requireSetup && !user.is_setup_completed)
    return <Navigate to="/setup" replace />;

  return children;
}
