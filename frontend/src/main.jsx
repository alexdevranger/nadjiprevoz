// // import React from "react";
// // import { createRoot } from "react-dom/client";
// // import App from "./App";
// // import "./index.css";
// // import { registerSW } from "virtual:pwa-register";

// // const updateSW = registerSW({
// //   onNeedRefresh() {},
// //   onOfflineReady() {},
// // });

// // createRoot(document.getElementById("root")).render(<App />);
// import React, { useState, useEffect } from "react";
// import { createRoot } from "react-dom/client";
// import App from "./App";
// import "./index.css";
// import { registerSW } from "virtual:pwa-register";

// function Root() {
//   const [needRefresh, setNeedRefresh] = useState(false);
//   const [offlineReady, setOfflineReady] = useState(false);

//   const updateSW = registerSW({
//     onNeedRefresh() {
//       setNeedRefresh(true);
//     },
//     onOfflineReady() {
//       setOfflineReady(true);
//     },
//   });

//   if ("serviceWorker" in navigator) {
//     navigator.serviceWorker.register("/sw-custom.js");
//   }

//   // Auto-hide offline toast after 3s
//   useEffect(() => {
//     if (offlineReady) {
//       const timer = setTimeout(() => setOfflineReady(false), 3000);
//       return () => clearTimeout(timer);
//     }
//   }, [offlineReady]);

//   return (
//     <>
//       <App />

//       {needRefresh && (
//         <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-4 py-3 rounded-lg shadow-lg flex items-center space-x-4 z-50">
//           <span>Nova verzija aplikacije je dostupna.</span>
//           <button
//             onClick={() => updateSW(true)}
//             className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
//           >
//             Osveži
//           </button>
//         </div>
//       )}

//       {offlineReady && (
//         <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg z-50">
//           Aplikacija je spremna za offline rad ✅
//         </div>
//       )}
//     </>
//   );
// }

// createRoot(document.getElementById("root")).render(<Root />);
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { ThemeProvider } from "./context/ThemeContext";

createRoot(document.getElementById("root")).render(
  <ThemeProvider>
    <App />
  </ThemeProvider>
);
