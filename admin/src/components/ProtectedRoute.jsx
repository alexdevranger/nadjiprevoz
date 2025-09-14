// src/components/ProtectedRoute.jsx
import { useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { useGlobalState } from "../helper/globalState";

export default function ProtectedRoute({ roles = [] }) {
  const navigate = useNavigate();
  const [user] = useGlobalState("user");
  const token = localStorage.getItem("token");

  let currentUser = user;

  if (!currentUser && token) {
    try {
      currentUser = JSON.parse(atob(token.split(".")[1]));
    } catch (e) {
      console.error("Invalid token");
    }
  }

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    if (
      roles.length > 0 &&
      !roles.some((r) => currentUser.roles?.includes(r))
    ) {
      navigate("/login");
    }
  }, [currentUser, navigate, roles]);

  // Vrati Outlet da se child rute renderuju
  return <Outlet />;
}
