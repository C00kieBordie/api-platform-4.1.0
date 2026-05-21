import { useLocation, useNavigate } from "react-router-dom";

export default function Home() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email ?? "User";

  return (
    <div style={{ maxWidth: 400, margin: "100px auto", fontFamily: "sans-serif" }}>
      <h1>Hi, {email}!</h1>
      <p>You have successfully registered.</p>
      <button onClick={() => navigate("/")} style={{ padding: "8px 16px" }}>
        Back to Register
      </button>
    </div>
  );
}