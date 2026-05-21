import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

type Mode = "login" | "register";

export default function Auth() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("login");
  const [form, setForm] = useState({ email: "", plainPassword: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // If a valid token already exists, skip straight to home
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/home");
    }
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      if (mode === "register") {
        const res = await fetch("http://localhost:8080/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/ld+json" },
          body: JSON.stringify(form),
        });

        if (res.ok) {
          // Auto-login after register
          setMode("login");
          await login();
        } else {
          const data = await res.json();
          setError(data["hydra:description"] || "Registration failed");
        }

      } else {
        await login();
      }
    } catch (err) {
      setError("Could not connect to the server");
    } finally {
      setLoading(false);
    }
  };

  const login = async () => {
    const res = await fetch("http://localhost:8080/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      const data = await res.json();
      localStorage.setItem("token", data.token);
      localStorage.setItem("email", form.email);
      navigate("/home");
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "100px auto", fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", marginBottom: 24 }}>
        <button
          onClick={() => { setMode("register"); setError(null); }}
          style={{
            flex: 1, padding: 10,
            background: mode === "register" ? "#1976d2" : "#eee",
            color: mode === "register" ? "#fff" : "#333",
            border: "none", cursor: "pointer", fontWeight: "bold"
          }}
        >
          Register
        </button>
        <button
          onClick={() => { setMode("login"); setError(null); }}
          style={{
            flex: 1, padding: 10,
            background: mode === "login" ? "#1976d2" : "#eee",
            color: mode === "login" ? "#fff" : "#333",
            border: "none", cursor: "pointer", fontWeight: "bold"
          }}
        >
          Login
        </button>
      </div>

      <h2>{mode === "register" ? "Create an account" : "Welcome back"}</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <input
        name="email"
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        style={{ display: "block", width: "100%", marginBottom: 12, padding: 8 }}
      />
      <input
        name="plainPassword"
        type="password"
        placeholder={mode === "register" ? "Password (min 6 characters)" : "Password"}
        value={form.plainPassword}
        onChange={handleChange}
        style={{ display: "block", width: "100%", marginBottom: 12, padding: 8 }}
      />

      <button
        onClick={handleSubmit}
        disabled={loading}
        style={{ width: "100%", padding: 10, background: "#1976d2", color: "#fff", border: "none", cursor: "pointer", fontWeight: "bold" }}
      >
        {loading ? "Please wait..." : mode === "register" ? "Register" : "Login"}
      </button>
    </div>
  );
}