import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Header";

export default function Settings() {
  const [settings, setSettings] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/settings", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSettings(res.data);
    } catch (err) {
      console.error("Greška pri učitavanju podešavanja", err);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put("/api/settings", settings, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Podešavanja sačuvana!");
    } catch (err) {
      console.error("Greška pri čuvanju podešavanja", err);
      alert("Došlo je do greške!");
    } finally {
      setSaving(false);
    }
  };

  if (!settings) return <div>Učitavanje...</div>;

  return (
    <div className="min-h-screen bg-slate-100">
      <Header />
      <main className="p-6 mx-auto space-y-6">
        <h2 className="text-2xl font-bold mb-4">Podešavanja</h2>

        {/* General */}
        <div className="bg-white shadow rounded p-4 space-y-4">
          <h3 className="text-lg font-semibold">General</h3>

          <div>
            <label className="block text-sm font-medium mb-1">
              Naziv sajta
            </label>
            <input
              type="text"
              name="siteName"
              value={settings.siteName}
              onChange={handleChange}
              placeholder="Naziv sajta"
              className="w-full border rounded p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Logo URL</label>
            <input
              type="text"
              name="logoUrl"
              value={settings.logoUrl}
              onChange={handleChange}
              placeholder="https://example.com/logo.png"
              className="w-full border rounded p-2"
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Jezik</label>
              <select
                name="language"
                value={settings.language}
                onChange={handleChange}
                className="w-full border rounded p-2"
              >
                <option value="sr">Srpski</option>
                <option value="en">English</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Valuta</label>
              <select
                name="currency"
                value={settings.currency}
                onChange={handleChange}
                className="w-full border rounded p-2"
              >
                <option value="RSD">RSD</option>
                <option value="EUR">EUR</option>
              </select>
            </div>
          </div>
        </div>

        {/* Ads */}
        <div className="bg-white shadow rounded p-4 space-y-4">
          <h3 className="text-lg font-semibold">Oglasi</h3>

          <div>
            <label className="block text-sm font-medium mb-1">
              Maksimalan broj besplatnih oglasa
            </label>
            <input
              type="number"
              name="maxFreeAds"
              value={settings.maxFreeAds}
              onChange={handleChange}
              placeholder="npr. 5"
              className="w-full border rounded p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Cena oglasa (RSD)
            </label>
            <input
              type="number"
              name="adPrice"
              value={settings.adPrice}
              onChange={handleChange}
              placeholder="npr. 500"
              className="w-full border rounded p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Trajanje oglasa (u danima)
            </label>
            <input
              type="number"
              name="adDurationDays"
              value={settings.adDurationDays}
              onChange={handleChange}
              placeholder="npr. 30"
              className="w-full border rounded p-2"
            />
          </div>
        </div>

        {/* AI */}
        <div className="bg-white shadow rounded p-4 space-y-4">
          <h3 className="text-lg font-semibold">AI Podešavanja</h3>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="aiEnabled"
              checked={settings.aiEnabled}
              onChange={handleChange}
            />
            Omogući AI preporuke
          </label>

          <div>
            <label className="block text-sm font-medium mb-1">
              Broj AI rezultata
            </label>
            <input
              type="number"
              name="aiMaxResults"
              value={settings.aiMaxResults}
              onChange={handleChange}
              placeholder="npr. 10"
              className="w-full border rounded p-2"
            />
          </div>
        </div>

        <button
          onClick={saveSettings}
          disabled={saving}
          className="px-6 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? "Čuvanje..." : "Sačuvaj"}
        </button>
      </main>
    </div>
  );
}
