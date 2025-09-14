import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Kombinuje Tailwind klase i rešava konflikte (npr. px-2 i px-4)
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// export function updateFaviconBadge(unreadCount) {
//   const favicon = document.querySelector("link[rel='icon']");
//   if (!favicon) return;

//   const img = document.createElement("img");
//   img.src = "/favicon.ico";
//   img.onload = () => {
//     const canvas = document.createElement("canvas");
//     canvas.width = img.width;
//     canvas.height = img.height;
//     const ctx = canvas.getContext("2d");

//     ctx.drawImage(img, 0, 0);

//     if (unreadCount > 0) {
//       ctx.fillStyle = "red";
//       ctx.beginPath();
//       ctx.arc(canvas.width - 8, 8, 6, 0, 2 * Math.PI);
//       ctx.fill();
//     }

//     favicon.href = canvas.toDataURL("image/png");
//   };
// }
// export function updateFaviconBadge(unreadCount) {
//   console.log("Updating favicon with count:", unreadCount);

//   // Koristite manifest umesto direktno favicon.ico
//   const favicon =
//     document.querySelector("link[rel='icon']") ||
//     document.querySelector("link[rel='shortcut icon']");

//   if (!favicon) {
//     console.error("Favicon element not found");
//     return;
//   }

//   // Koristite manifest ikonu kao osnovu
//   const iconUrl = "/icons/icon-192x192.png";

//   const img = new Image();
//   img.crossOrigin = "Anonymous";
//   img.src = iconUrl;

//   img.onload = () => {
//     const canvas = document.createElement("canvas");
//     canvas.width = img.width;
//     canvas.height = img.height;
//     const ctx = canvas.getContext("2d");

//     // Nacrtajte osnovnu ikonu
//     ctx.drawImage(img, 0, 0, img.width, img.height);

//     if (unreadCount > 0) {
//       // Nacrtajte crvenu tačku
//       ctx.fillStyle = "red";
//       ctx.beginPath();
//       ctx.arc(canvas.width - 10, 10, 8, 0, 2 * Math.PI);
//       ctx.fill();

//       // Opcionalno: dodajte broj
//       if (unreadCount < 10) {
//         ctx.fillStyle = "white";
//         ctx.font = "bold 12px Arial";
//         ctx.textAlign = "center";
//         ctx.textBaseline = "middle";
//         ctx.fillText(unreadCount.toString(), canvas.width - 10, 10);
//       }
//     }

//     // Ažurirajte favicon
//     const newFaviconUrl = canvas.toDataURL("image/png");
//     favicon.href = newFaviconUrl;

//     // Dodajte timestamp da bi se izbeglo keširanje
//     // favicon.href = newFaviconUrl + '?' + Date.now();
//   };

//   img.onerror = () => {
//     console.error("Failed to load icon image");
//   };
// }
export function updateFaviconBadge(unreadCount) {
  console.log("Updating favicon badge with count:", unreadCount);

  // Kreirajte favicon ako ne postoji
  let favicon = document.querySelector("link[rel~='icon']");
  if (!favicon) {
    favicon = document.createElement("link");
    favicon.rel = "icon";
    favicon.type = "image/x-icon";
    document.head.appendChild(favicon);
  }

  const img = new Image();
  img.crossOrigin = "Anonymous";
  img.src = "/icons/icon-192x192.png?" + Date.now();

  img.onload = function () {
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d");

    // Nacrtaj osnovnu ikonu
    ctx.drawImage(img, 0, 0);

    if (unreadCount > 0) {
      // Nacrtaj crvenu tacku
      ctx.fillStyle = "#ff0000";
      ctx.beginPath();
      ctx.arc(canvas.width - 10, 10, 8, 0, 2 * Math.PI);
      ctx.fill();

      // Opciono: dodaj broj
      if (unreadCount < 10) {
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 10px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(unreadCount.toString(), canvas.width - 10, 10);
      }
    }

    // Ažuriraj favicon
    favicon.href = canvas.toDataURL("image/png");

    // Forciraj osvežavanje
    const newLink = favicon.cloneNode();
    newLink.href = canvas.toDataURL("image/png") + "?" + Date.now();
    favicon.parentNode.replaceChild(newLink, favicon);
  };

  img.onerror = function () {
    console.error("Failed to load icon image");
  };
}
