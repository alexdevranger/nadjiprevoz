// // import { useEffect, useState } from "react";
// // import axios from "axios";
// // import Header from "../components/Header";

// // export default function SponsorAds() {
// //   const [ads, setAds] = useState([]);
// //   const [form, setForm] = useState({
// //     title: "",
// //     image: "",
// //     link: "",
// //     position: "homepage-sidebar",
// //     startDate: "",
// //     endDate: "",
// //   });
// //   const [editingId, setEditingId] = useState(null);

// //   const fetchAds = async () => {
// //     const token = localStorage.getItem("token");
// //     const res = await axios.get("/api/sponsor-ads", {
// //       headers: { Authorization: `Bearer ${token}` },
// //     });
// //     setAds(res.data);
// //   };

// //   useEffect(() => {
// //     fetchAds();
// //   }, []);

// //   const handleChange = (e) => {
// //     setForm({ ...form, [e.target.name]: e.target.value });
// //   };

// //   const handleSubmit = async () => {
// //     const token = localStorage.getItem("token");
// //     if (editingId) {
// //       await axios.put(`/api/sponsor-ads/${editingId}`, form, {
// //         headers: { Authorization: `Bearer ${token}` },
// //       });
// //     } else {
// //       await axios.post("/api/sponsor-ads", form, {
// //         headers: { Authorization: `Bearer ${token}` },
// //       });
// //     }
// //     setForm({
// //       title: "",
// //       image: "",
// //       link: "",
// //       position: "homepage-sidebar",
// //       startDate: "",
// //       endDate: "",
// //     });
// //     setEditingId(null);
// //     fetchAds();
// //   };

// //   const handleDelete = async (id) => {
// //     if (!window.confirm("Obrisati oglas?")) return;
// //     const token = localStorage.getItem("token");
// //     await axios.delete(`/api/sponsor-ads/${id}`, {
// //       headers: { Authorization: `Bearer ${token}` },
// //     });
// //     fetchAds();
// //   };

// //   const handleEdit = (ad) => {
// //     setForm({
// //       title: ad.title,
// //       image: ad.image,
// //       link: ad.link,
// //       position: ad.position,
// //       startDate: ad.startDate.split("T")[0],
// //       endDate: ad.endDate.split("T")[0],
// //     });
// //     setEditingId(ad._id);
// //   };

// //   return (
// //     <div className="min-h-screen bg-slate-100">
// //       <Header />
// //       <main className="p-6 max-w-4xl mx-auto space-y-6">
// //         <h2 className="text-2xl font-bold">Sponsor oglasi</h2>

// //         {/* Forma */}
// //         <div className="bg-white shadow rounded p-4 space-y-4">
// //           <input
// //             type="text"
// //             name="title"
// //             value={form.title}
// //             onChange={handleChange}
// //             placeholder="Naslov"
// //             className="w-full border rounded p-2"
// //           />
// //           <input
// //             type="text"
// //             name="image"
// //             value={form.image}
// //             onChange={handleChange}
// //             placeholder="URL slike"
// //             className="w-full border rounded p-2"
// //           />
// //           <input
// //             type="text"
// //             name="link"
// //             value={form.link}
// //             onChange={handleChange}
// //             placeholder="Link ka sajtu"
// //             className="w-full border rounded p-2"
// //           />
// //           <select
// //             name="position"
// //             value={form.position}
// //             onChange={handleChange}
// //             className="w-full border rounded p-2"
// //           >
// //             <option value="homepage-top">Homepage top</option>
// //             <option value="homepage-sidebar">Homepage sidebar</option>
// //             <option value="search-top">Pretraga top</option>
// //           </select>
// //           <div className="flex gap-4">
// //             <input
// //               type="date"
// //               name="startDate"
// //               value={form.startDate}
// //               onChange={handleChange}
// //               className="border rounded p-2 w-full"
// //             />
// //             <input
// //               type="date"
// //               name="endDate"
// //               value={form.endDate}
// //               onChange={handleChange}
// //               className="border rounded p-2 w-full"
// //             />
// //           </div>
// //           <button
// //             onClick={handleSubmit}
// //             className="px-6 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700"
// //           >
// //             {editingId ? "Sačuvaj izmene" : "Dodaj oglas"}
// //           </button>
// //         </div>

// //         {/* Lista oglasa */}
// //         <div className="bg-white shadow rounded p-4">
// //           <h3 className="text-lg font-semibold mb-2">Postojeći oglasi</h3>
// //           <table className="w-full border">
// //             <thead>
// //               <tr className="bg-slate-200">
// //                 <th className="p-2 border">Naslov</th>
// //                 <th className="p-2 border">Pozicija</th>
// //                 <th className="p-2 border">Period</th>
// //                 <th className="p-2 border">Akcije</th>
// //               </tr>
// //             </thead>
// //             <tbody>
// //               {ads.map((ad) => (
// //                 <tr key={ad._id}>
// //                   <td className="p-2 border">{ad.title}</td>
// //                   <td className="p-2 border">{ad.position}</td>
// //                   <td className="p-2 border">
// //                     {ad.startDate?.split("T")[0]} - {ad.endDate?.split("T")[0]}
// //                   </td>
// //                   <td className="p-2 border flex gap-2">
// //                     <button
// //                       onClick={() => handleEdit(ad)}
// //                       className="px-3 py-1 bg-yellow-500 text-white rounded"
// //                     >
// //                       Izmeni
// //                     </button>
// //                     <button
// //                       onClick={() => handleDelete(ad._id)}
// //                       className="px-3 py-1 bg-red-600 text-white rounded"
// //                     >
// //                       Obriši
// //                     </button>
// //                   </td>
// //                 </tr>
// //               ))}
// //               {ads.length === 0 && (
// //                 <tr>
// //                   <td colSpan="4" className="text-center p-4">
// //                     Nema oglasa
// //                   </td>
// //                 </tr>
// //               )}
// //             </tbody>
// //           </table>
// //         </div>
// //       </main>
// //     </div>
// //   );
// // }
// import { useEffect, useState } from "react";
// import axios from "axios";
// import Header from "../components/Header";
// import moment from "moment";

// export default function SponsorAds() {
//   const [sponsorAds, setSponsorAds] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [filters, setFilters] = useState({
//     status: "",
//     client: "",
//     placement: "",
//   });

//   // 🟢 Fetch podaci
//   const fetchSponsorAds = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const res = await axios.get("/api/sponsor-ads", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setSponsorAds(res.data);
//     } catch (err) {
//       console.error("Greška prilikom učitavanja sponzorisanih oglasa", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 🟢 Arhiva
//   const handleArchive = async (id) => {
//     if (!window.confirm("Da li ste sigurni da želite da arhivirate oglas?"))
//       return;
//     try {
//       const token = localStorage.getItem("token");
//       await axios.post(
//         `/api/sponsor-ads/admin/${id}/archive`,
//         {},
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       fetchSponsorAds();
//     } catch (err) {
//       console.error("Greška prilikom arhiviranja", err);
//     }
//   };

//   useEffect(() => {
//     fetchSponsorAds();
//   }, []);

//   // 🟢 Filter
//   const filteredAds = sponsorAds.filter((ad) => {
//     let match = true;
//     if (filters.status) {
//       if (filters.status === "active" && !ad.active) match = false;
//       if (filters.status === "inactive" && ad.active) match = false;
//     }
//     if (
//       filters.client &&
//       !ad.clientName.toLowerCase().includes(filters.client.toLowerCase())
//     )
//       match = false;
//     if (
//       filters.placement &&
//       !ad.placement.toLowerCase().includes(filters.placement.toLowerCase())
//     )
//       match = false;
//     return match;
//   });

//   return (
//     <div className="min-h-screen bg-slate-100">
//       <Header />
//       <main className="p-6">
//         <h2 className="text-2xl font-bold mb-4">Sponzorisani oglasi</h2>

//         {/* 🟢 Forma za dodavanje oglasa */}
//         <div className="bg-white shadow rounded p-4 mb-6">
//           <h3 className="text-lg font-semibold mb-2">Dodaj novi oglas</h3>
//           <form
//             onSubmit={(e) => {
//               e.preventDefault();
//               // TODO: implementiraj createSponsorAd()
//               alert("Ovde ide logika za dodavanje oglasa 🚀");
//             }}
//             className="grid grid-cols-3 gap-4"
//           >
//             <input
//               type="text"
//               placeholder="Naslov"
//               className="border rounded p-2"
//               required
//             />
//             <input
//               type="text"
//               placeholder="Klijent"
//               className="border rounded p-2"
//               required
//             />
//             <input
//               type="text"
//               placeholder="Pozicija (npr. Homepage, Sidebar...)"
//               className="border rounded p-2"
//               required
//             />
//             <button
//               type="submit"
//               className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition col-span-3"
//             >
//               Dodaj oglas
//             </button>
//           </form>
//         </div>

//         {/* 🟢 Filteri */}
//         <div className="bg-white shadow rounded p-4 mb-6 flex gap-4">
//           <div>
//             <label>Status</label>
//             <select
//               value={filters.status}
//               onChange={(e) =>
//                 setFilters({ ...filters, status: e.target.value })
//               }
//               className="border rounded p-2"
//             >
//               <option value="">Svi</option>
//               <option value="active">Aktivni</option>
//               <option value="inactive">Neaktivni</option>
//             </select>
//           </div>
//           <div>
//             <label>Klijent</label>
//             <input
//               type="text"
//               placeholder="Ime klijenta"
//               value={filters.client}
//               onChange={(e) =>
//                 setFilters({ ...filters, client: e.target.value })
//               }
//               className="border rounded p-2"
//             />
//           </div>
//           <div>
//             <label>Pozicija</label>
//             <input
//               type="text"
//               placeholder="npr. Homepage"
//               value={filters.placement}
//               onChange={(e) =>
//                 setFilters({ ...filters, placement: e.target.value })
//               }
//               className="border rounded p-2"
//             />
//           </div>
//         </div>

//         {/* 🟢 Lista oglasa */}
//         {loading ? (
//           <p>Učitavanje...</p>
//         ) : (
//           <table className="w-full bg-white rounded shadow overflow-hidden">
//             <thead className="bg-slate-200">
//               <tr>
//                 <th className="p-2 text-left">Naslov</th>
//                 <th className="p-2 text-left">Klijent</th>
//                 <th className="p-2 text-left">Lokacija</th>
//                 <th className="p-2 text-left">Trajanje</th>
//                 <th className="p-2 text-left">Status</th>
//                 <th className="p-2 text-left">Akcije</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredAds.map((ad) => (
//                 <tr key={ad._id} className="border-b hover:bg-slate-100">
//                   <td className="p-2">{ad.title}</td>
//                   <td className="p-2">{ad.clientName}</td>
//                   <td className="p-2">{ad.placement}</td>
//                   <td className="p-2">
//                     {moment(ad.startDate).format("DD.MM.YYYY")} –{" "}
//                     {moment(ad.endDate).format("DD.MM.YYYY")}
//                   </td>
//                   <td className="p-2">{ad.active ? "✅" : "—"}</td>
//                   <td className="p-2">
//                     <button
//                       onClick={() => handleArchive(ad._id)}
//                       className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
//                     >
//                       Arhiviraj
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </main>
//     </div>
//   );
// }
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
