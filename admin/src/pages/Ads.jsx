import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import moment from "moment";

export default function Ads() {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: "",
    user: "",
    premium: "",
  });

  const fetchAds = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/tours/premium", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(res.data);
      setAds(res.data);
    } catch (err) {
      console.error("Greška prilikom učitavanja oglasa", err);
    } finally {
      setLoading(false);
    }
  };

  const handleArchive = async (id) => {
    if (!window.confirm("Da li ste sigurni da želite da arhivirate oglas?"))
      return;
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `/api/ads/admin/${id}/archive`,
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
        `/api/ads/admin/${id}/renew`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchAds();
    } catch (err) {
      console.error("Greška prilikom produženja", err);
    }
  };

  const handlePromote = async (id) => {
    if (!window.confirm("Postaviti oglas kao premium?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `/api/ads/admin/${id}/promote`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Update samo promovisani oglas u state
      setAds((prev) =>
        prev.map((ad) =>
          ad._id === id
            ? {
                ...ad,
                isPremium: true,
                premiumExpiresAt: res.data.ad.premiumExpiresAt,
              }
            : ad
        )
      );
    } catch (err) {
      console.error("Greška prilikom promovisanja", err);
    }
  };

  useEffect(() => {
    fetchAds();
  }, []);

  // FILTER
  const filteredAds = ads.filter((ad) => {
    let match = true;
    if (filters.status && ad.status !== filters.status) match = false;
    if (
      filters.user &&
      !`${ad.user?.name} ${ad.user?.email}`
        .toLowerCase()
        .includes(filters.user.toLowerCase())
    )
      match = false;
    if (filters.premium) {
      if (filters.premium === "yes" && !ad.isPremium) match = false;
      if (filters.premium === "no" && ad.isPremium) match = false;
    }
    return match;
  });

  return (
    <div className="min-h-screen bg-slate-100">
      <Header />
      <main className="p-6">
        <h2 className="text-2xl font-bold mb-4">Oglasi</h2>

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
            <label>Korisnik</label>
            <input
              type="text"
              placeholder="Ime ili email"
              value={filters.user}
              onChange={(e) => setFilters({ ...filters, user: e.target.value })}
              className="border rounded p-2"
            />
          </div>
          <div>
            <label>Premium</label>
            <select
              value={filters.premium}
              onChange={(e) =>
                setFilters({ ...filters, premium: e.target.value })
              }
              className="border rounded p-2"
            >
              <option value="">Svi</option>
              <option value="yes">Samo premium</option>
              <option value="no">Bez premium</option>
            </select>
          </div>
        </div>

        {/* Tabela oglasa */}
        {loading ? (
          <p>Učitavanje...</p>
        ) : (
          <table className="w-full bg-white rounded shadow overflow-hidden">
            <thead className="bg-slate-200">
              <tr>
                <th className="p-2 text-left">Korisnik</th>
                <th className="p-2 text-left">Id</th>
                <th className="p-2 text-left">Status</th>
                <th className="p-2 text-left">Kreiran</th>
                <th className="p-2 text-left">Ističe</th>
                <th className="p-2 text-left">Premium</th>
                <th className="p-2 text-left">Akcije</th>
              </tr>
            </thead>
            <tbody>
              {filteredAds.map((ad) => (
                <tr key={ad._id} className="border-b hover:bg-slate-100">
                  <td className="p-2">{ad.createdBy?.email}</td>
                  <td className="p-2">
                    {ad.createdBy?._id.slice(0, 4)}...
                    {ad.createdBy?._id.slice(-4)}
                  </td>
                  <td className="p-2">{ad.status}</td>
                  <td className="p-2">
                    {moment(ad.createdAt).format("DD.MM.YYYY")}
                  </td>
                  <td className="p-2">
                    {moment(ad.premiumExpiresAt).format("DD.MM.YYYY")}
                  </td>
                  <td className="p-2">{ad.isPremium ? "✅" : "—"}</td>
                  <td className="p-2 flex gap-2">
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
                    {!ad.isPremium && (
                      <button
                        onClick={() => handlePromote(ad._id)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition"
                      >
                        Premium
                      </button>
                    )}
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
