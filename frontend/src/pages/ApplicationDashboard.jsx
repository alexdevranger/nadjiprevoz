import { useEffect, useState } from "react";
import axios from "axios";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaBriefcase,
  FaCheckCircle,
  FaTimesCircle,
  FaList,
  FaStar,
  FaSpinner,
} from "react-icons/fa";

export default function ApplicationsDashboard() {
  const [applications, setApplications] = useState([]);
  const [filter, setFilter] = useState("sve");
  const [loading, setLoading] = useState(true);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/job-applications/moje-objave", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApplications(res.data);
    } catch (err) {
      console.error("Greška pri učitavanju prijava:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.patch(
        `/api/job-applications/${id}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setApplications((prev) => prev.map((a) => (a._id === id ? res.data : a)));
    } catch (err) {
      alert("Greška prilikom promene statusa");
    }
  };

  const filtered =
    filter === "sve"
      ? applications
      : applications.filter((a) => a.status === filter);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-6xl mx-auto bg-white shadow-md rounded-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center">
            <FaList className="text-blue-500 mr-2" /> Prijave kandidata
          </h1>

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
          >
            <option value="sve">Sve prijave</option>
            <option value="na čekanju">Na čekanju</option>
            <option value="u užem izboru">U užem izboru</option>
            <option value="prihvaćen">Prihvaćene</option>
            <option value="odbijen">Odbijene</option>
          </select>
        </div>

        {loading ? (
          <div className="flex justify-center py-10 text-gray-500">
            <FaSpinner className="animate-spin mr-2" /> Učitavanje prijava...
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-center text-gray-600">Nema prijava za prikaz.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.map((a) => (
              <div
                key={a._id}
                className="border-l-4 border-blue-500 rounded-xl shadow p-5 bg-white hover:shadow-lg transition"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">
                      {a.applicantId?.name || "Nepoznat kandidat"}
                    </h3>
                    <div className="flex items-center text-sm text-gray-600 mt-1">
                      <FaBriefcase className="text-blue-500 mr-1" />
                      {a.jobId?.title || "Nepoznat oglas"}
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      a.status === "na čekanju"
                        ? "bg-yellow-100 text-yellow-700"
                        : a.status === "u užem izboru"
                        ? "bg-blue-100 text-blue-700"
                        : a.status === "prihvaćen"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {a.status}
                  </span>
                </div>

                <div className="mt-4 text-sm text-gray-700 space-y-2">
                  {a.applicantId?.email && (
                    <div className="flex items-center">
                      <FaEnvelope className="text-purple-500 mr-2" />
                      {a.applicantId.email}
                    </div>
                  )}
                  {a.applicantId?.phone && (
                    <div className="flex items-center">
                      <FaPhone className="text-green-500 mr-2" />
                      {a.applicantId.phone}
                    </div>
                  )}
                </div>

                {a.message && (
                  <div className="mt-3 bg-gray-50 p-3 rounded-md border text-sm text-gray-700">
                    <strong>Poruka kandidata:</strong>
                    <p className="mt-1">{a.message}</p>
                  </div>
                )}

                <div className="flex justify-between mt-5 border-t pt-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleStatusChange(a._id, "u užem izboru")}
                      className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                    >
                      <FaStar className="mr-1" /> Uži izbor
                    </button>
                    <button
                      onClick={() => handleStatusChange(a._id, "prihvaćen")}
                      className="text-green-600 hover:text-green-800 text-sm flex items-center"
                    >
                      <FaCheckCircle className="mr-1" /> Prihvati
                    </button>
                    <button
                      onClick={() => handleStatusChange(a._id, "odbijen")}
                      className="text-red-600 hover:text-red-800 text-sm flex items-center"
                    >
                      <FaTimesCircle className="mr-1" /> Odbij
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
