import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api";
import { useAuth } from "../AuthContext";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const { data } = await API.post("/auth/login", form);
      login(data.user, data.token);
      navigate("/");
    } catch (e) {
      setError(e.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-vh-100 d-flex">
      <div
        className="w-50 d-none d-md-flex flex-column justify-content-center p-5 text-white"
        style={{ background: "linear-gradient(135deg,#071d52,#0866e9)" }}
      >
        <h2 className="fw-bold mb-5">✓ Task Manager</h2>
        <h1 className="fw-bold display-5">
          Organize tasks.
          <br />
          Boost productivity.
          <br />
          Achieve more.
        </h1>
        <p className="fs-5 mt-3 opacity-75">
          Manage your tasks, deadlines and projects all in one place.
        </p>
      </div>

      <div className="flex-grow-1 d-flex align-items-center justify-content-center bg-light p-4">
        <div
          className="bg-white p-5 rounded-4 shadow"
          style={{ width: "100%", maxWidth: 480 }}
        >
          <div className="text-center mb-4">
            <h2 className="fw-bold mt-2">Welcome Back</h2>
            <p className="text-muted">Sign in to continue to your account</p>
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={submit}>
            <label className="form-label">Email</label>
            <input
              className="form-control form-control-lg mb-3"
              type="email"
              name="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={change}
              required
            />

            <label className="form-label">Password</label>
            <input
              className="form-control form-control-lg mb-4"
              type="password"
              name="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={change}
              required
            />

            <button className="btn btn-primary btn-lg w-100">Login</button>
          </form>

          <p className="text-center mt-4 mb-0">
            Don't have an account? <Link to="/signup">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
