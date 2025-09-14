// import React, { useEffect, useState } from "react";
// import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
// import { useGlobalState, setGlobalState } from "./helper/globalState";
// import Navbar from "./components/Navbar";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import MapPage from "./pages/MapPage";
// import Dashboard from "./pages/Dashboard";
// import AddVehicle from "./pages/AddVehicle";
// import MyVehicles from "./pages/MyVehicles";
// import MyTours from "./pages/MyTours";
// import TourDetails from "./pages/TourDetails";
// import AddTour from "./pages/AddTour";
// import AllTours from "./pages/AllTours";
// import AddShipment from "./pages/AddShipment";
// import AllShipments from "./pages/AllShipments";
// import MyShipments from "./pages/MyShipments";
// import EditShipment from "./pages/EditShipment";
// import DashboardChat from "./pages/DashboardChat";
// import Agent from "./components/Agent";
// import { io } from "socket.io-client";
// import ProtectedRoute from "./components/ProtectedRoute";

// export const socket = io("http://localhost:4000", {
//   auth: { token: localStorage.getItem("token") },
// });

// export default function App() {
//   const [user] = useGlobalState("user");
//   const [isLoading, setIsLoading] = useState(true);
//   const [newMessageCount, setNewMessageCount] = useState(0);

//   // učitaj user/token iz localStorage
//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     if (storedUser) {
//       setGlobalState("user", JSON.parse(storedUser));
//     }
//     const storedToken = localStorage.getItem("token");
//     if (storedToken) {
//       setGlobalState("token", storedToken);
//     }
//     setIsLoading(false);
//   }, []);

//   // registracija usera na socket serveru
//   useEffect(() => {
//     if (user?._id) {
//       console.log("registering user", user._id);
//       socket.emit("registerUser", user._id);
//     }
//   }, [user?._id]);

//   // slušaj service worker poruke
//   useEffect(() => {
//     if ("serviceWorker" in navigator) {
//       const listener = (event) => {
//         const { type, message, conversationId } = event.data || {};
//         if (type === "NEW_MESSAGE") {
//           const activeConvId = localStorage.getItem("activeConvId");
//           if (conversationId !== activeConvId) {
//             setNewMessageCount((prev) => {
//               console.log("Unread count ->", prev + 1);
//               return prev + 1;
//             });
//           }
//         }
//       };
//       navigator.serviceWorker.addEventListener("message", listener);
//       return () =>
//         navigator.serviceWorker.removeEventListener("message", listener);
//     }
//   }, []);

//   // pretplata na push (radi jednom)
//   useEffect(() => {
//     if ("serviceWorker" in navigator && "PushManager" in window) {
//       navigator.serviceWorker.ready.then(async (registration) => {
//         const existing = await registration.pushManager.getSubscription();
//         if (!existing) {
//           const sub = await registration.pushManager.subscribe({
//             userVisibleOnly: true,
//             applicationServerKey: urlBase64ToUint8Array(
//               import.meta.env.VITE_VAPID_PUBLIC_KEY
//             ),
//           });

//           await fetch("http://localhost:4000/subscribe", {
//             method: "POST",
//             body: JSON.stringify(sub),
//             headers: { "Content-Type": "application/json" },
//           });
//         }
//       });
//     }
//   }, []);

//   // reset badge kad korisnik otvori chat
//   const handleOpenChat = () => {
//     setNewMessageCount(0);
//   };

//   // update favicon badge
//   useEffect(() => {
//     updateFaviconBadge(newMessageCount);
//   }, [newMessageCount]);

//   return (
//     <HashRouter>
//       <div className="app min-h-screen bg-gray-100">
//         <Navbar newMessageCount={newMessageCount} />
//         <Agent />
//         <main className="p-4">
//           <Routes>
//             <Route path="/" element={<Navigate to="/map" replace />} />
//             <Route path="/alltours" element={<AllTours />} />
//             <Route path="/login" element={<Login />} />
//             <Route path="/register" element={<Register />} />
//             <Route path="/map" element={<MapPage />} />
//             <Route path="/add-vehicle" element={<AddVehicle />} />
//             <Route path="/my-vehicles" element={<MyVehicles />} />
//             <Route path="/allshipments" element={<AllShipments />} />
//             <Route path="/add-shipment" element={<AddShipment />} />
//             <Route
//               path="/my-tours"
//               element={
//                 <ProtectedRoute>
//                   <MyTours />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/my-tours/:id"
//               element={
//                 <ProtectedRoute>
//                   <TourDetails />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/chat"
//               element={
//                 <ProtectedRoute>
//                   <DashboardChat onOpen={handleOpenChat} />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/add-tour"
//               element={
//                 <ProtectedRoute>
//                   <AddTour />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/my-shipments"
//               element={
//                 <ProtectedRoute>
//                   <MyShipments />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/my-shipments/edit/:id"
//               element={
//                 <ProtectedRoute>
//                   <EditShipment />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/dashboard"
//               element={
//                 <ProtectedRoute>
//                   <Dashboard />
//                 </ProtectedRoute>
//               }
//             />
//           </Routes>
//         </main>
//       </div>
//     </HashRouter>
//   );
// }

// // helper za konverziju ključa
// function urlBase64ToUint8Array(base64String) {
//   const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
//   const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
//   const rawData = atob(base64);
//   return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
// }

// function updateFaviconBadge(unreadCount) {
//   console.log("Updating favicon badge with count:", unreadCount);
//   localStorage.setItem("unreadCount", unreadCount);

//   // Kreirajte favicon ako ne postoji
//   let favicon = document.querySelector("link[rel~='icon']");
//   if (!favicon) {
//     favicon = document.createElement("link");
//     favicon.rel = "icon";
//     favicon.type = "image/x-icon";
//     document.head.appendChild(favicon);
//   }

//   const img = new Image();
//   img.crossOrigin = "Anonymous";
//   img.src = "/icons/icon-192x192.png?" + Date.now();

//   img.onload = function () {
//     const canvas = document.createElement("canvas");
//     canvas.width = img.width;
//     canvas.height = img.height;
//     const ctx = canvas.getContext("2d");

//     // Nacrtaj osnovnu ikonu
//     ctx.drawImage(img, 0, 0);

//     if (unreadCount > 0) {
//       // Nacrtaj crvenu tacku
//       ctx.fillStyle = "#ff0000";
//       ctx.beginPath();
//       ctx.arc(canvas.width - 30, 30, 25, 0, 2 * Math.PI);
//       ctx.fill();

//       // Opciono: dodaj broj
//       if (unreadCount < 10) {
//         ctx.fillStyle = "#ffffff";
//         ctx.font = "bold 10px Arial";
//         ctx.textAlign = "center";
//         ctx.textBaseline = "middle";
//         ctx.fillText(unreadCount.toString(), canvas.width - 10, 10);
//       }
//     }
//     document.body.appendChild(canvas);
//     // Ažuriraj favicon
//     favicon.href = canvas.toDataURL("image/png");

//     // Forciraj osvežavanje
//     const newLink = favicon.cloneNode();
//     newLink.href = canvas.toDataURL("image/png") + "?" + Date.now();
//     favicon.parentNode.replaceChild(newLink, favicon);
//   };

//   img.onerror = function () {
//     console.error("Failed to load icon image");
//   };
// }
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
      setGlobalState("user", JSON.parse(storedUser));
    }
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setGlobalState("token", storedToken);
    }
    setIsLoading(false);
  }, []);
  useEffect(() => {
    if (user?._id) {
      console.log("registering user", user._id);
      socket.emit("registerUser", user._id);
    }
  }, [user?._id]);

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
      <div className="app min-h-screen bg-gray-100">
        <ServiceWorkerCleanup />
        <Navbar />
        <Agent />
        <main>
          <Routes>
            <Route path="/" element={<Pocetna />} />
            <Route path="/intro" element={<Intro />} />
            <Route path="/alltours" element={<AllTours />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/add-vehicle" element={<AddVehicle />} />
            <Route path="/my-vehicles" element={<MyVehicles />} />
            <Route path="/allshipments" element={<AllShipments />} />
            <Route path="/add-shipment" element={<AddShipment />} />
            <Route path="/moja-vozila" element={<VozilaUser />} />
            <Route path="/kontakt" element={<Kontakt />} />
            <Route path="/moje-ture" element={<MojeTureUser />} />
            <Route path="/shop/:slug" element={<ShopPage />} />

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
    </HashRouter>
  );
}
