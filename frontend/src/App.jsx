import React, { useEffect, useState } from "react";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { useGlobalState, setGlobalState } from "./helper/globalState";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MapPage from "./pages/MapPage";
import Dashboard from "./pages/Dashboard";
import AddVehicle from "./pages/AddVehicle";
import MyVehicles from "./pages/MyVehicles";
import MyTours from "./pages/MyTours";
import TourDetails from "./pages/TourDetails";
import AddTour from "./pages/AddTour";
import AllTours from "./pages/AllTours";
import AddShipment from "./pages/AddShipment";
import AllShipments from "./pages/AllShipments";
import MyShipments from "./pages/MyShipments";
import EditShipment from "./pages/EditShipment";
import DashboardChat from "./pages/DashboardChat";
import Agent from "./components/Agent";
import { io } from "socket.io-client";
import ProtectedRoute from "./components/ProtectedRoute";
import ServiceWorkerCleanup from "./components/ServiceWorkerCleanup";
import { initMessageService, fetchUnreadCount } from "./helper/messageService";
import VozilaUser from "./pages/VozilaUser";
import MojeTureUser from "./pages/MojeTureUser";
import Pocetna from "./pages/Pocetna";
import Kontakt from "./pages/Kontakt";
import ScrollToTopButton from "./components/ScrollToTopButton";
import Intro from "./pages/Intro";
import ShopPage from "./components/ShopPage";
import ShopDashboard from "./components/ShopDashboard";
import { ToastProvider } from "./components/ToastContext";
import Faq from "./pages/FAQ";
import AddJob from "./pages/AddJob";
import MyJobs from "./pages/MyJobs";
import AllJobs from "./pages/AllJobs";
import ViberCommunity from "./pages/ViberCommunity";
import DriverPortfolioPage from "./pages/DriverPortfolioPage";
import PublicPortfolio from "./pages/PublicPorfolio";
import JobApplicationsPage from "./pages/JobApplicationsPage";
import MyJobApplications from "./pages/MyJobApplications";
import MyCompanyReviews from "./pages/MyCompanyReviews.jsx";
import MyCandidateReviews from "./pages/MyCandidateReviews.jsx";

export const socket = io("http://localhost:4000", {
  auth: { token: localStorage.getItem("token") },
});

export default function App() {
  const [user] = useGlobalState("user");
  const [token] = useGlobalState("token");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      console.log("storedUser", storedUser);
      setGlobalState("user", JSON.parse(storedUser));
    }
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setGlobalState("token", storedToken);
    }
    setIsLoading(false);
  }, []);
  useEffect(() => {
    if (user?.id) {
      console.log("registering user", user.id);
      socket.emit("registerUser", user.id);
    }
  }, [user?.id]);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken && user) {
      // Inicijalizuj servis za praćenje poruka
      initMessageService(token, user.id);

      // Uzmi početni broj nepročitanih poruka
      fetchUnreadCount(token);
    }
  }, [token, user]);

  return (
    <HashRouter>
      <ToastProvider>
        <div className="app min-h-screen bg-gray-100">
          <ServiceWorkerCleanup />
          <Navbar />
          <Agent />
          <main>
            <Routes>
              <Route path="/" element={<Pocetna />} />
              <Route path="/intro" element={<Intro />} />
              <Route path="/alltours" element={<AllTours />} />
              <Route path="/all-jobs" element={<AllJobs />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/map" element={<MapPage />} />
              <Route path="/add-vehicle" element={<AddVehicle />} />
              <Route path="/my-vehicles" element={<MyVehicles />} />
              <Route path="/pitanja-i-odgovori" element={<Faq />} />
              <Route path="/allshipments" element={<AllShipments />} />
              <Route path="/add-shipment" element={<AddShipment />} />
              <Route path="/moja-vozila" element={<VozilaUser />} />
              <Route path="/kontakt" element={<Kontakt />} />
              <Route path="/moje-ture" element={<MojeTureUser />} />
              <Route path="/shop/:slug" element={<ShopPage />} />
              <Route path="/viber" element={<ViberCommunity />} />
              <Route path="/driver/:slug" element={<PublicPortfolio />} />
              <Route
                path="/job/:jobId/applications"
                element={<JobApplicationsPage />}
              />
              <Route
                path="/driver-portfolio"
                element={
                  <ProtectedRoute>
                    <DriverPortfolioPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-company-reviews"
                element={
                  <ProtectedRoute>
                    <MyCompanyReviews />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-candidate-reviews"
                element={
                  <ProtectedRoute>
                    <MyCandidateReviews />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-job-applications"
                element={
                  <ProtectedRoute>
                    <MyJobApplications />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/my-tours"
                element={
                  <ProtectedRoute>
                    <MyTours />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-shop"
                element={
                  <ProtectedRoute>
                    <ShopDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-tours/:id"
                element={
                  <ProtectedRoute>
                    <TourDetails />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-jobs"
                element={
                  <ProtectedRoute>
                    <MyJobs />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/chat"
                element={
                  <ProtectedRoute>
                    <DashboardChat />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/add-tour"
                element={
                  <ProtectedRoute>
                    <AddTour />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/add-job"
                element={
                  <ProtectedRoute>
                    <AddJob />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-shipments"
                element={
                  <ProtectedRoute>
                    <MyShipments />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-shipments/edit/:id"
                element={
                  <ProtectedRoute>
                    <EditShipment />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
        </div>
        <ScrollToTopButton />
      </ToastProvider>
    </HashRouter>
  );
}
