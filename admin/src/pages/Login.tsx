import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", plainPassword: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("http://localhost:8080/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/ld+json",
        },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        const data = await res.json();
        navigate("/home", { state: { email: data.email } });
      } else {
        const data = await res.json();
        setError(data["hydra:description"] || "Registration failed");
      }
    } catch (err) {
      setError("Could not connect to the server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "100px auto", fontFamily: "sans-serif" }}>
      <h2>Register</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <input
        name="email"
        type="email"
        placeholder="Email"
        onChange={handleChange}
        style={{ display: "block", width: "100%", marginBottom: 12, padding: 8 }}
      />
      <input
        name="plainPassword"
        type="password"
        placeholder="Password (min 8 characters)"
        onChange={handleChange}
        style={{ display: "block", width: "100%", marginBottom: 12, padding: 8 }}
      />
      <button onClick={handleSubmit} disabled={loading} style={{ padding: "8px 16px" }}>
        {loading ? "Registering..." : "Register"}
      </button>
    </div>
  );
}