import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav
      className="navbar navbar-expand-lg px-3 px-md-5 py-3 mb-4"
      style={{
        background: "linear-gradient(135deg, #071d52, #0866e9)",
        boxShadow: "0 4px 18px rgba(7, 29, 82, 0.15)",
      }}
    >
      <div className="container-fluid">
        <Link
          to="/"
          className="navbar-brand d-flex align-items-center gap-2 text-white fw-bold"
          style={{ fontSize: "1.35rem", letterSpacing: "-0.5px" }}
        >
          <span
            className="d-flex align-items-center justify-content-center rounded-3"
            style={{
              width: 40,
              height: 40,
              background: "rgba(255,255,255,0.16)",
              fontSize: "1.3rem",
            }}
          >
            ✓
          </span>
          Task Manager
        </Link>

        {user && (
          <div className="d-flex align-items-center gap-3">
            <div className="text-end d-none d-sm-block">
              <div className="text-white fw-semibold">
                {user.name}
              </div>
              <small style={{ color: "#dbeafe" }}>
                Workspace
              </small>
            </div>

            <div
              className="d-flex align-items-center justify-content-center rounded-circle text-white fw-bold"
              style={{
                width: 42,
                height: 42,
                background: "rgba(255,255,255,0.2)",
                border: "1px solid rgba(255,255,255,0.35)",
              }}
              title={user.name}
            >
              {user.name?.charAt(0).toUpperCase() || "U"}
            </div>

            <button
              type="button"
              className="btn btn-sm fw-semibold"
              onClick={handleLogout}
              style={{
                color: "#fff",
                background: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.45)",
                borderRadius: 9,
                padding: "9px 15px",
              }}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}