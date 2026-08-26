import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-dark bg-dark px-4 mb-4">
      <Link to="/" className="navbar-brand fw-bold">
        Task Manager
      </Link>
      {user && (
        <div className="d-flex align-items-center gap-3">
          <span className="text-white">Hi, {user.name}</span>
          <button
            className="btn btn-outline-light btn-sm"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
