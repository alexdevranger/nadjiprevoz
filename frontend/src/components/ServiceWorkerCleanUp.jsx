import React, { useEffect } from "react";

const ServiceWorkerCleanup = () => {
  useEffect(() => {
    // Funkcija za uklanjanje service worker-a
    const unregisterServiceWorkers = async () => {
      if ("serviceWorker" in navigator) {
        try {
          const registrations =
            await navigator.serviceWorker.getRegistrations();
          for (let registration of registrations) {
            await registration.unregister();
            console.log("Service Worker deregistrovani");
          }
        } catch (error) {
          console.log("Greška pri deregistraciji Service Worker-a:", error);
        }
      }
    };

    // Pozovi funkciju za uklanjanje
    unregisterServiceWorkers();

    // Dodatno: Ukloni service worker iz keša
    if (window.caches) {
      caches.keys().then((cacheNames) => {
        cacheNames.forEach((cacheName) => {
          if (cacheName.includes("workbox") || cacheName.includes("sw")) {
            caches.delete(cacheName);
          }
        });
      });
    }
  }, []);

  return null; // Ova komponenta ne renderira ništa
};

export default ServiceWorkerCleanup;
