import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const API_URL = window.location.origin.replace(window.location.port, "5000") + "/api/auth";

function Login() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function login() {
    if (!phone || !password) {
      alert("Please enter phone number and password");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, password }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("farmer", JSON.stringify(data.user));
      navigate("/dashboard");
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function register() {
    if (!name || !phone || !password) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, password }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      localStorage.setItem("token", data.token || "");
      localStorage.setItem("farmer", JSON.stringify(data.user));
      navigate("/dashboard");
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page">
      <div className="auth-card">
        <h1>🌾 Krishi Mithra</h1>

        {mode === "login" ? (
          <>
            <h2>Existing Farmer Login</h2>

            <label>Phone Number</label>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} />

            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button onClick={login} disabled={loading}>
              {loading ? "Signing in..." : "Login"}
            </button>

            <div className="note-box">
              <b>Demo Login</b>
              <p>Phone: 9876543210</p>
              <p>Password: farmer123</p>
            </div>

            <button onClick={() => setMode("register")}>
              Create New Account
            </button>

            <br />
            <Link to="/">Back Home</Link>
          </>
        ) : (
          <>
            <h2>New Farmer Registration</h2>

            <label>Full Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} />

            <label>Phone Number</label>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} />

            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button onClick={register} disabled={loading}>
              {loading ? "Creating account..." : "Create Account"}
            </button>
            <button onClick={() => setMode("login")}>Back to Login</button>
          </>
        )}
      </div>
    </div>
  );
}

export default Login;