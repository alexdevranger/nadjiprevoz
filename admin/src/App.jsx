import React, { useEffect, useState } from "react";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { useGlobalState, setGlobalState } from "./helper/globalState";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Ads from "./pages/Ads";
import Payments from "./pages/Payments";
import Settings from "./pages/Settings";
import { io } from "socket.io-client";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./components/DashboardLayout";
import UserDetails from "./pages/UserDetails";
import SponsorAds from "./pages/SponsorAds";
import { ToastProvider } from "./components/ToastContext";

// Kreirajte socket instancu za admin
export const socket = io("http://localhost:4000", {
  auth: {
    token: localStorage.getItem("token"),
    isAdmin: true,
  },
});

export default function App() {
  const [user] = useGlobalState("user");
  const [token] = useGlobalState("token");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Konektuj se na socket kada se komponenta mount-uje
    socket.connect();

    socket.on("connect", () => {
      console.log("Admin socket connected:", socket.id);
      // Join admin payments room
      socket.emit("joinAdminPayments");
    });

    socket.on("disconnect", () => {
      console.log("Admin socket disconnected");
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Učitavanje usera i tokena iz localStorage pri startu
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setGlobalState("user", JSON.parse(storedUser));

    const storedToken = localStorage.getItem("token");
    if (storedToken) setGlobalState("token", storedToken);

    setIsLoading(false);
  }, []);

  if (isLoading) return <div>Loading...</div>;

  return (
    <HashRouter>
      <ToastProvider>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<Login />} />

          {/* Protected (samo admin/moderator) */}
          <Route element={<ProtectedRoute roles={["admin", "moderator"]} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/users" element={<Users />} />
              <Route path="/users/:id" element={<UserDetails />} />
              <Route path="/ads" element={<Ads />} />
              <Route path="/sponsor-ads" element={<SponsorAds />} />
              <Route path="/payments" element={<Payments />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
          </Route>

          {/* Default redirect ako nije ništa od gore navedenog */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ToastProvider>
    </HashRouter>
  );
}
