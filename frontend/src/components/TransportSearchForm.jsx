import React, { useState } from "react";
import { useToast } from "../components/ToastContext";

export default function TransportSearchForm() {
  const [formData, setFormData] = useState({
    startLocation: "",
    startLocationLat: null,
    startLocationLng: null,
    endLocation: "",
    endLocationLat: null,
    endLocationLng: null,
    date: "",
    goodsDescription: "",
  });
  const { success, error, warning, info } = useToast();

  const handleSendToOfferers = () => {
    // Ovde ide logika slanja AI-u
    // Simulacija poruke
    const message = `
      Potreban prevoz od ${formData.startLocation} do ${formData.endLocation}
      Datum: ${formData.date}
      Opis robe: ${formData.goodsDescription}
    `;
    console.log("Šaljem AI agentu:", message);

    // Ovde bi zvao svoj backend endpoint koji će AI-jem obraditi i poslati poruku ponuđačima
    fetch("/api/sendToOfferers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ formData }),
    })
      .then((res) => res.json())
      .then((data) => {
        success("Poruka uspešno poslata ponuđačima!");
      })
      .catch((err) => {
        console.error("Greška:", err);
        error("Došlo je do greške pri slanju poruke.");
      });
  };

  return (
    <div className="p-4 border rounded-lg max-w-md mx-auto bg-white shadow">
      <h2 className="text-lg font-bold mb-4">Pronađi prevoz</h2>

      <input
        type="text"
        placeholder="Početna lokacija"
        className="border p-2 w-full mb-2"
        value={formData.startLocation}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, startLocation: e.target.value }))
        }
      />

      <input
        type="text"
        placeholder="Krajnja lokacija"
        className="border p-2 w-full mb-2"
        value={formData.endLocation}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, endLocation: e.target.value }))
        }
      />

      <input
        type="date"
        className="border p-2 w-full mb-2"
        value={formData.date}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, date: e.target.value }))
        }
      />

      <textarea
        placeholder="Opis robe, paletnih mesta ili dimenzija"
        className="border p-2 w-full mb-2"
        value={formData.goodsDescription}
        onChange={(e) =>
          setFormData((prev) => ({
            ...prev,
            goodsDescription: e.target.value,
          }))
        }
      />

      <button
        onClick={handleSendToOfferers}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
      >
        Pošalji poruku ponuđačima
      </button>
    </div>
  );
}
