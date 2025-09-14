import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import moment from "moment";

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPayments = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/payments", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("res.data", res.data);
      setPayments(res.data);
    } catch (err) {
      console.error("Greška prilikom učitavanja uplata", err);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (id) => {
    if (!window.confirm("Da li želite da potvrdite ovu uplatu?")) return;
    try {
      const token = localStorage.getItem("token");
      const confirmation = await axios.put(
        `/api/payments/${id}/confirm`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log(confirmation.data);
      await fetchPayments(); // ponovo učitaj sve
    } catch (err) {
      console.error("Greška prilikom potvrde uplate", err);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  if (loading) return <p className="p-4">Učitavanje uplata...</p>;

  return (
    <div className="p-4">
      <Header title="Uplate" />

      <div className="overflow-x-auto mt-6">
        <table className="min-w-full border border-slate-300">
          <thead className="bg-slate-100">
            <tr>
              <th className="border p-2">Korisnik</th>
              <th className="border p-2">Tura</th>
              <th className="border p-2">Iznos</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Premium ističe</th>
              <th className="border p-2">Akcija</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p._id} className="hover:bg-slate-50">
                <td className="border p-2">
                  {p.user?.name} <br />
                  <span className="text-sm text-slate-500">
                    {p.user?.email}
                  </span>
                </td>
                <td className="border p-2">
                  {p.tour?.startLocation} → {p.tour?.endLocation} <br />
                  <span className="text-sm text-slate-500">
                    {moment(p.tour?.date).format("DD.MM.YYYY")}
                  </span>
                </td>
                <td className="border p-2">{p.amount} RSD</td>
                <td className="border p-2">
                  {p.status === "paid" ? (
                    <span className="text-green-600 font-medium">
                      Potvrđena
                    </span>
                  ) : (
                    <span className="text-orange-600 font-medium">
                      Na čekanju
                    </span>
                  )}
                </td>
                <td className="border p-2">
                  {p.tour?.premiumExpiresAt
                    ? moment(p.tour.premiumExpiresAt).format("DD.MM.YYYY")
                    : "-"}
                </td>
                <td className="border p-2 text-center">
                  {p.status === "pending" && (
                    <button
                      onClick={() => handleConfirm(p._id)}
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Potvrdi
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {payments.length === 0 && (
              <tr>
                <td colSpan="6" className="p-4 text-center text-slate-500">
                  Nema uplata.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
