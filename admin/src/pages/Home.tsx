import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const email = localStorage.getItem("email") ?? "User";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    navigate("/");
  };

  return (
    <div style={{ maxWidth: 400, margin: "100px auto", fontFamily: "sans-serif" }}>
      <h1>Hi, {email}!</h1>
      <p>You are logged in.</p>
      <button onClick={handleLogout} style={{ padding: "8px 16px" }}>
        Logout
      </button>
    </div>
  );
}