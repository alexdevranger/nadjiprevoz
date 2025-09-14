// components/ProtectedRoute.js
import { useNavigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  //   const user = JSON.parse(localStorage.getItem("user") || null);

  if (!token) {
    navigate("/login");
  }

  return children;
}
