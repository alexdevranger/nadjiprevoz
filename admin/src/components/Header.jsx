import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState(null);
  const token = localStorage.getItem("token");
  const user = token ? parseJwt(token) : null;

  const userData = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;

  function parseJwt(token) {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch {
      return null;
    }
  }

  useEffect(() => {
    if (userData) {
      console.log("User data loaded:", userData);
      setUserDetails(userData);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <header className="flex items-center justify-between bg-slate-900 text-white p-4 shadow">
      <h1
        className="text-xl font-bold cursor-pointer"
        onClick={() => navigate("/")}
      >
        Admin Panel
      </h1>
      <div className="flex items-center gap-4">
        {userDetails && (
          <span className="text-sm">Ulogovan: {userDetails.email}</span>
        )}
        {userDetails ? (
          <button
            onClick={handleLogout}
            className="bg-red-600 px-3 py-1 rounded hover:bg-red-700 transition"
          >
            Logout
          </button>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="bg-blue-600 px-3 py-1 rounded hover:bg-blue-700 transition"
          >
            Login
          </button>
        )}
      </div>
    </header>
  );
}
