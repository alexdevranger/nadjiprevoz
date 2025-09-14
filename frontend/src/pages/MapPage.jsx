import React from "react";
import MapView from "../components/MapView";

export default function MapPage() {
  return (
    <div>
      <h2 className="text-2xl mb-4">Map and Routing</h2>
      <div style={{ height: "500px", maxWidth: "900px", margin: "auto" }}>
        <MapView />
      </div>

      {/* Ovde možeš kasnije dodati opcije za filtere, unos start/end, kontrole itd */}
    </div>
  );
}
