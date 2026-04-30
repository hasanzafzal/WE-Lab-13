import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext.jsx";

function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { isAdmin, adminName, login, logout } = useContext(AuthContext);

  // Simple mocked credentials
  const ADMIN_PASSWORD = "admin123";

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      login("Admin");
      setPassword("");
      setError("");
    } else {
      setError("Invalid password. Try: admin123");
    }
  };

  if (isAdmin) {
    return (
      <div className="alert alert-success d-flex justify-content-between align-items-center">
        <span>✓ Admin logged in as: <strong>{adminName}</strong></span>
        <button
          onClick={logout}
          className="btn btn-sm btn-outline-danger"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className="card p-4 mb-4 border-info">
      <h5>Admin Login (Required to view feedback list)</h5>
      <p className="text-muted small">Demo password: <code>admin123</code></p>
      <form onSubmit={handleLogin} className="d-flex gap-2">
        <input
          type="password"
          className="form-control"
          placeholder="Enter admin password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="btn btn-info">
          Login
        </button>
      </form>
      {error && <div className="alert alert-danger mt-2 mb-0">{error}</div>}
    </div>
  );
}

export default AdminLogin;
