import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // {
    //   name: "fix-react-datepicker",
    //   config() {
    //     return {
    //       resolve: {
    //         alias: {
    //           "./dist/date_utils": path.resolve(
    //             __dirname,
    //             "node_modules/react-datepicker/dist/date_utils.d.ts"
    //           ),
    //         },
    //       },
    //     };
    //   },
    // },
    // VitePWA({
    //   registerType: "autoUpdate", // automatski update service worker-a
    //   includeAssets: [
    //     "/favicon.ico",
    //     "/icons/icon-192x192.png",
    //     "/icons/icon-512x512.png",
    //   ],
    //   manifest: {
    //     name: "Transport App",
    //     short_name: "Transport",
    //     description: "Transport asistent aplikacija",
    //     theme_color: "#2563eb",
    //     background_color: "#ffffff",
    //     display: "standalone",
    //     scope: "/",
    //     start_url: "/",
    //     id: "/",
    //     icons: [
    //       {
    //         src: "/icons/icon-192x192.png",
    //         sizes: "192x192",
    //         type: "image/png",
    //       },
    //       {
    //         src: "/icons/icon-512x512.png",
    //         sizes: "512x512",
    //         type: "image/png",
    //       },
    //       {
    //         src: "/icons/icon-512x512.png",
    //         sizes: "512x512",
    //         type: "image/png",
    //         purpose: "any",
    //       },
    //     ],
    //     screenshots: [
    //       {
    //         src: "/screenshots/home.png",
    //         sizes: "1280x720",
    //         type: "image/png",
    //         form_factor: "wide",
    //       },
    //       {
    //         src: "/screenshots/mobile.png",
    //         sizes: "540x720",
    //         type: "image/png",
    //         form_factor: "narrow",
    //       },
    //     ],
    //   },

    //   srcDir: "src",
    //   filename: "sw-custom.js",
    //   strategies: "injectManifest",
    //   // ✅ Dodaj debug flag da u dev modu ne loguje sve requeste
    //   injectManifest: {
    //     swSrc: "src/sw-custom.js",
    //     swDest: "dist/sw-custom.js",
    //     maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
    //   },
    // }),
  ],
  server: {
    proxy: {
      "/api": "http://localhost:4000",
    },
  },
  resolve: {
    alias: {
      // "./dist/date_utils": "react-datepicker/dist/date_utils.d.ts",
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
