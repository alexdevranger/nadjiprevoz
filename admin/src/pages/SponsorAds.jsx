import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import moment from "moment";

export default function SponsorAds() {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newAd, setNewAd] = useState({
    title: "",
    imageUrl: "",
    link: "",
    position: "homepage",
    durationDays: 30,
  });
  const [filters, setFilters] = useState({
    status: "",
    position: "",
  });

  const fetchAds = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/sponsor-ads", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAds(res.data);
    } catch (err) {
      console.error("Greška prilikom učitavanja sponzorisanih oglasa", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post("/api/sponsor-ads", newAd, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNewAd({
        title: "",
        imageUrl: "",
        link: "",
        position: "homepage",
        durationDays: 30,
      });
      fetchAds();
    } catch (err) {
      console.error("Greška prilikom dodavanja oglasa", err);
    }
  };

  const handleArchive = async (id) => {
    if (!window.confirm("Arhivirati oglas?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `/api/sponsor-ads/${id}/archive`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchAds();
    } catch (err) {
      console.error("Greška prilikom arhiviranja", err);
    }
  };

  const handleRenew = async (id) => {
    if (!window.confirm("Produžiti oglas za još 30 dana?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `/api/sponsor-ads/${id}/renew`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchAds();
    } catch (err) {
      console.error("Greška prilikom produžavanja", err);
    }
  };

  useEffect(() => {
    fetchAds();
  }, []);

  // FILTER
  const filteredAds = ads.filter((ad) => {
    let match = true;
    if (filters.status && ad.status !== filters.status) match = false;
    if (filters.position && ad.position !== filters.position) match = false;
    return match;
  });

  return (
    <div className="min-h-screen bg-slate-100">
      <Header />
      <main className="p-6">
        <h2 className="text-2xl font-bold mb-4">Sponzorisani oglasi</h2>

        {/* Forma za dodavanje novog oglasa */}
        <form
          onSubmit={handleCreate}
          className="bg-white shadow rounded p-4 space-y-4 mb-6"
        >
          <h3 className="text-lg font-semibold">Dodaj novi oglas</h3>
          <input
            type="text"
            placeholder="Naslov"
            value={newAd.title}
            onChange={(e) => setNewAd({ ...newAd, title: e.target.value })}
            className="w-full border rounded p-2"
            required
          />
          <input
            type="text"
            placeholder="URL slike"
            value={newAd.imageUrl}
            onChange={(e) => setNewAd({ ...newAd, imageUrl: e.target.value })}
            className="w-full border rounded p-2"
            required
          />
          <input
            type="text"
            placeholder="Link (odredišna stranica)"
            value={newAd.link}
            onChange={(e) => setNewAd({ ...newAd, link: e.target.value })}
            className="w-full border rounded p-2"
          />
          <div className="flex gap-4">
            <div>
              <label>Pozicija</label>
              <select
                value={newAd.position}
                onChange={(e) =>
                  setNewAd({ ...newAd, position: e.target.value })
                }
                className="border rounded p-2"
              >
                <option value="homepage">Početna stranica</option>
                <option value="sidebar">Sidebar</option>
                <option value="listings">Lista oglasa</option>
              </select>
            </div>
            <div>
              <label>Trajanje (dana)</label>
              <input
                type="number"
                value={newAd.durationDays}
                onChange={(e) =>
                  setNewAd({ ...newAd, durationDays: e.target.value })
                }
                className="border rounded p-2"
              />
            </div>
          </div>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700"
          >
            Dodaj
          </button>
        </form>

        {/* Filteri */}
        <div className="bg-white shadow rounded p-4 mb-6 flex gap-4">
          <div>
            <label>Status</label>
            <select
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
              className="border rounded p-2"
            >
              <option value="">Svi</option>
              <option value="active">Aktivni</option>
              <option value="expired">Istekli</option>
              <option value="archived">Arhivirani</option>
            </select>
          </div>
          <div>
            <label>Pozicija</label>
            <select
              value={filters.position}
              onChange={(e) =>
                setFilters({ ...filters, position: e.target.value })
              }
              className="border rounded p-2"
            >
              <option value="">Sve</option>
              <option value="homepage">Početna stranica</option>
              <option value="sidebar">Sidebar</option>
              <option value="listings">Lista oglasa</option>
            </select>
          </div>
        </div>

        {/* Lista oglasa */}
        {loading ? (
          <p>Učitavanje...</p>
        ) : (
          <table className="w-full bg-white rounded shadow overflow-hidden">
            <thead className="bg-slate-200">
              <tr>
                <th className="p-2 text-left">Naslov</th>
                <th className="p-2 text-left">Pozicija</th>
                <th className="p-2 text-left">Status</th>
                <th className="p-2 text-left">Kreiran</th>
                <th className="p-2 text-left">Ističe</th>
                <th className="p-2 text-left">Akcije</th>
              </tr>
            </thead>
            <tbody>
              {filteredAds.map((ad) => (
                <tr key={ad._id} className="border-b hover:bg-slate-100">
                  <td className="p-2">{ad.title}</td>
                  <td className="p-2">
                    {ad.imageUrl ? (
                      <img
                        src={ad.imageUrl}
                        alt={ad.title}
                        className="w-16 h-12 object-cover rounded"
                      />
                    ) : (
                      <span className="text-gray-400">Nema slike</span>
                    )}
                  </td>
                  <td className="p-2">{ad.position}</td>
                  <td className="p-2">{ad.status}</td>
                  <td className="p-2">
                    {moment(ad.createdAt).format("DD.MM.YYYY")}
                  </td>
                  <td className="p-2">
                    {moment(ad.expiresAt).format("DD.MM.YYYY")}
                  </td>
                  <td className="p-2">
                    {ad.status !== "archived" && (
                      <button
                        onClick={() => handleArchive(ad._id)}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                      >
                        Arhiviraj
                      </button>
                    )}
                    <button
                      onClick={() => handleRenew(ad._id)}
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
                    >
                      Produži
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
    </div>
  );
}
