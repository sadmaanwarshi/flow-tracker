import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { logout } = useAuth();

  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-white shadow">
      <Link to="/dashboard" className="font-semibold text-lg">
        FlowTrack
      </Link>
      <button onClick={logout} className="text-sm text-red-500">
        Logout
      </button>
    </nav>
  );
}
