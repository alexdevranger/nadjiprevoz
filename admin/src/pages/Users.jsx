import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import moment from "moment";
import { useNavigate } from "react-router-dom";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showBanned, setShowBanned] = useState(false);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    console.log("Fetching users...");
    try {
      const token = localStorage.getItem("token");

      // Proveri da li token postoji
      if (!token) {
        console.error("Token nije pronađen");
        // Redirect to login ili pokaži error
        return;
      }
      const res = await axios.get("/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Users fetched:", res.data);
      setUsers(res.data);
    } catch (err) {
      console.error("Greška prilikom učitavanja korisnika", err);
    } finally {
      setLoading(false);
    }
  };

  const handleBan = async (id) => {
    if (!window.confirm("Da li ste sigurni da želite da banujete korisnika?"))
      return;

    try {
      const token = localStorage.getItem("token");

      // Proveri da li token postoji
      if (!token) {
        console.error("Token nije pronađen");
        // Redirect to login ili pokaži error
        return;
      }
      const res = await axios.post(
        `/api/admin/ban/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log(res.data);
      fetchUsers();
    } catch (err) {
      console.error("Greška prilikom banovanja", err);
    }
  };
  const handleUnBan = async (id) => {
    if (!window.confirm("Da li ste sigurni da želite da unbanujete korisnika?"))
      return;

    try {
      const token = localStorage.getItem("token");

      // Proveri da li token postoji
      if (!token) {
        console.error("Token nije pronađen");
        // Redirect to login ili pokaži error
        return;
      }
      await axios.post(
        `/api/admin/unban/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchUsers();
    } catch (err) {
      console.error("Greška prilikom banovanja", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 👇 filtriranje korisnika
  const filteredUsers = users.filter((u) => {
    const term = search.toLowerCase();
    const match =
      u._id.toLowerCase().includes(term) ||
      u.email.toLowerCase().includes(term) ||
      (u.name && u.name.toLowerCase().includes(term)) ||
      (u.company && u.company.toLowerCase().includes(term));
    if (showBanned) {
      return u.banned && match;
    }
    return match;
  });

  return (
    <div className="min-h-screen bg-slate-100">
      <Header />
      <main className="p-6">
        <h2 className="text-2xl font-bold mb-4">Korisnici</h2>

        {/* 🔍 Filter */}
        <div className="flex items-center gap-4 mb-4">
          <input
            type="text"
            placeholder="Pretraga po ID, email, ime, firma..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg w-80 focus:ring-2 focus:ring-blue-500"
          />
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={showBanned}
              onChange={() => setShowBanned((v) => !v)}
            />
            Samo banovani
          </label>
        </div>

        {loading ? (
          <p>Učitavanje...</p>
        ) : (
          <table className="w-full bg-white rounded shadow overflow-hidden">
            <thead className="bg-slate-200">
              <tr>
                <th className="p-2 text-left">Ime</th>
                <th className="p-2 text-left">Id</th>
                <th className="p-2 text-left">Email</th>
                <th className="p-2 text-left">Uloga</th>
                <th className="p-2 text-left">Firma</th>
                <th className="p-2 text-left">Registrovan</th>
                <th className="p-2 text-left">Akcije</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-4 text-center text-gray-500">
                    Nema korisnika za prikaz
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr
                    key={u._id}
                    className="border-b hover:bg-slate-100 cursor-pointer"
                  >
                    <td
                      className="p-2"
                      onClick={() => navigate(`/users/${u._id}`)}
                    >
                      {u.name}
                    </td>
                    <td
                      className="p-2"
                      onClick={() => navigate(`/users/${u._id}`)}
                    >
                      {" "}
                      {u._id.slice(0, 4)}...{u._id.slice(-4)}
                    </td>
                    <td
                      className="p-2"
                      onClick={() => navigate(`/users/${u._id}`)}
                    >
                      {u.email}
                    </td>
                    <td className="p-2">{u.roles.join(", ")}</td>
                    <td className="p-2">{u.hasCompany ? u.company : "-"}</td>
                    <td className="p-2">
                      {moment(u.createdAt).format("DD.MM.YYYY")}
                    </td>
                    <td className="p-2">
                      {u.banned ? (
                        <>
                          <div className="relative inline-block">
                            <button
                              disabled
                              className="bg-gray-400 text-white px-3 py-1 rounded flex items-center relative"
                            >
                              Ban
                            </button>
                            <span className="absolute right-[-7px] top-[-10px]">
                              ✅
                            </span>
                          </div>
                          <div className="relative inline-block">
                            <button
                              onClick={() => handleUnBan(u._id)}
                              className="bg-green-600 text-white px-3 py-1 rounded hover:bg-red-700 transition ml-2"
                            >
                              UnBan
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="relative inline-block">
                            <button
                              onClick={() => handleBan(u._id)}
                              className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                            >
                              Ban
                            </button>
                          </div>
                          <div className="relative inline-block">
                            <button
                              onClick={() => handleUnBan(u._id)}
                              className="bg-green-600 text-white px-3 py-1 rounded hover:bg-red-700 transition ml-2"
                            >
                              UnBan
                            </button>
                          </div>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </main>
    </div>
  );
}
