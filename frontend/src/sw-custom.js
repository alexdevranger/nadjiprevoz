import { clientsClaim } from "workbox-core";
import { precacheAndRoute } from "workbox-precaching";

self.__WB_DISABLE_DEV_LOGS = true;

// 🚀 Workbox deo: preuzmi fajlove iz build-a u cache
self.skipWaiting();
clientsClaim();
precacheAndRoute([
  { url: "/icons/icon-192x192.png", revision: "1" },
  { url: "/icons/icon-512x512.png", revision: "1" },
  { url: "/favicon.ico", revision: "1" },
  ...self.__WB_MANIFEST,
]);

// --- Tvoj custom kod ---

// Install
self.addEventListener("install", (event) => {
  self.skipWaiting(); // odmah aktivira novi SW
});

// Activate
self.addEventListener("activate", (event) => {
  self.clients.claim(); // odmah preuzima kontrolu nad svim tabovima
});

// Push notifikacije
self.addEventListener("push", (event) => {
  let data = {};
  if (event.data) {
    data = event.data.json();
  }

  const title = data.title || "Nova poruka";
  const options = {
    body: data.body || "Imate novu poruku",
    icon: "/icons/icon-192x192.png",
    badge: "/icons/icon-192x192.png",
    data: {
      url: data.url || "/chat",
      messageId: data.messageId,
    },
  };

  // Pokaži sistemsku notifikaciju
  event.waitUntil(self.registration.showNotification(title, options));

  // Obavesti otvorene tabove da je stigla poruka
  event.waitUntil(
    self.clients.matchAll({ includeUncontrolled: true }).then((clients) => {
      clients.forEach((client) => {
        client.postMessage({
          type: "NEW_MESSAGE",
          message: data,
          conversationId: data.conversationId,
        });
      });
    })
  );
});

// Klik na notifikaciju
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const urlToOpen = event.notification.data?.url || "/";

  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clients) => {
        for (const client of clients) {
          if (client.url.includes(urlToOpen) && "focus" in client) {
            return client.focus();
          }
        }
        if (self.clients.openWindow) {
          return self.clients.openWindow(urlToOpen);
        }
      })
  );
});
