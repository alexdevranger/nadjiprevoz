import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import { useToast } from "../components/ToastContext";
import moment from "moment";
import { socket } from "../App";

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [shipmentPayments, setShipmentPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("tours"); // 'tours' ili 'shipments'
  const [rejectModal, setRejectModal] = useState({
    open: false,
    paymentId: null,
    paymentType: null, // 'tour' ili 'shipment'
    adminNotes: "",
  });
  const { success, error, warning, info } = useToast();

  // WebSocket efekti za real-time ažuriranja
  useEffect(() => {
    // Slušaj nova payment zahteva
    socket.on("newPaymentRequest", (data) => {
      console.log("Nov payment zahtev:", data);

      if (data.type === "tour") {
        setPayments((prev) => [data.payment, ...prev]);
      } else if (data.type === "shipment") {
        setShipmentPayments((prev) => [data.payment, ...prev]);
      }

      // Prikaži notifikaciju
      success(
        `📨 Novi payment zahtev za ${data.type === "tour" ? "turu" : "zahtev"}`
      );
    });

    // Slušaj ažuriranja paymenta
    socket.on("paymentUpdated", (data) => {
      console.log("Payment ažuriran:", data);

      if (data.type === "tour") {
        setPayments((prev) =>
          prev.map((payment) =>
            payment._id === data.paymentId
              ? { ...payment, status: data.status, adminNotes: data.adminNotes }
              : payment
          )
        );
      } else if (data.type === "shipment") {
        setShipmentPayments((prev) =>
          prev.map((payment) =>
            payment._id === data.paymentId
              ? { ...payment, status: data.status, adminNotes: data.adminNotes }
              : payment
          )
        );
      }
    });

    // Join admin payments room
    socket.emit("joinAdminPayments");

    // Cleanup
    return () => {
      socket.off("newPaymentRequest");
      socket.off("paymentUpdated");
    };
  }, []);

  const fetchPayments = async () => {
    try {
      const token = localStorage.getItem("token");

      // Proveri da li token postoji
      if (!token) {
        console.error("Token nije pronađen");
        // Redirect to login ili pokaži error
        return;
      }
      const res = await axios.get("/api/payments", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPayments(res.data.tourPayments);
      setShipmentPayments(res.data.shipmentPayments);
    } catch (err) {
      console.error("Greška prilikom učitavanja uplata", err);
    } finally {
      setLoading(false);
    }
  };

  // Dodajte i polling kao fallback
  useEffect(() => {
    fetchPayments();

    // Polling svakih 30 sekundi kao fallback
    const interval = setInterval(fetchPayments, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleConfirm = async (id) => {
    if (!window.confirm("Da li želite da potvrdite ovu uplatu?")) return;
    try {
      const token = localStorage.getItem("token");
      const confirmation = await axios.put(
        `/api/payments/${id}/confirmTourPayment`,
        { status: "paid" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchPayments();
    } catch (err) {
      console.error("Greška prilikom potvrde uplate", err);
    }
  };

  const handleConfirmShipmentPayment = async (id) => {
    if (!window.confirm("Da li želite da potvrdite ovu uplatu?")) return;
    try {
      const token = localStorage.getItem("token");
      const confirmation = await axios.put(
        `/api/payments/${id}/confirmShipmentPayment`,
        { status: "paid" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchPayments();
    } catch (err) {
      console.error("Greška prilikom potvrde uplate", err);
    }
  };

  const handleResetTourPremium = async (id) => {
    if (
      !window.confirm(
        "Da li ste sigurni da želite da vratite status na 'none'?"
      )
    )
      return;

    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `/api/payments/${id}/resetTourPremium`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      success(res.data.message);
      await fetchPayments(); // osveži tabelu
    } catch (err) {
      console.error("Greška prilikom resetovanja statusa:", err);
      error(
        err.response?.data?.message || "Došlo je do greške pri resetovanju."
      );
    }
  };

  const openRejectModal = (paymentId, paymentType = "tour") => {
    setRejectModal({
      open: true,
      paymentId,
      paymentType,
      adminNotes: "",
    });
  };

  const closeRejectModal = () => {
    setRejectModal({
      open: false,
      paymentId: null,
      paymentType: null,
      adminNotes: "",
    });
  };

  const handleReject = async () => {
    if (!rejectModal.paymentId) return;

    if (!rejectModal.adminNotes.trim()) {
      info("Molimo unesite razlog odbijanja.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const endpoint =
        rejectModal.paymentType === "shipment"
          ? `/api/payments/${rejectModal.paymentId}/confirmShipmentPayment`
          : `/api/payments/${rejectModal.paymentId}/confirmTourPayment`;

      const rejection = await axios.put(
        endpoint,
        {
          status: "rejected",
          adminNotes: rejectModal.adminNotes,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await fetchPayments();
      closeRejectModal();
      error("Uplata je odbijena.");
    } catch (err) {
      console.error("Greška prilikom odbijanja uplate", err);
      error("Došlo je do greške prilikom odbijanja uplate.");
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  if (loading) return <p className="p-4">Učitavanje uplata...</p>;

  return (
    <div className="p-4">
      <Header title="Uplate" />

      {/* Modal za odbijanje */}
      {rejectModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Odbij uplatu</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Razlog odbijanja:
              </label>
              <textarea
                value={rejectModal.adminNotes}
                onChange={(e) =>
                  setRejectModal((prev) => ({
                    ...prev,
                    adminNotes: e.target.value,
                  }))
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="4"
                placeholder="Unesite razlog zašto odbijate ovu uplatu..."
              />
            </div>
            <div className="flex gap-2 justify-end">
              <button
                onClick={closeRejectModal}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Otkaži
              </button>
              <button
                onClick={handleReject}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Odbij
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tabovi za navigaciju */}
      <div className="my-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("tours")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "tours"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Uplate za ture
            <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2 rounded-full text-xs">
              {payments.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab("shipments")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "shipments"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Uplate za zahteve
            <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2 rounded-full text-xs">
              {shipmentPayments.length}
            </span>
          </button>
        </nav>
      </div>

      {/* Tabela za uplate za ture */}
      {activeTab === "tours" && (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Korisnik
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tura
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Iznos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Premium ističe
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Admin Notes
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Akcija
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {payments.map((p) => (
                <tr key={p._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-[#ffb6c1]">
                      ID: {p.user?._id}
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      {p.user?.name}
                    </div>
                    <div className="text-sm text-gray-500">{p.user?.email}</div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-[#6495ed] block font-semibold">
                      ID: {p.tour?._id}
                    </div>
                    <div className="text-sm text-gray-900">
                      {p.tour?.startLocation} → {p.tour?.endLocation}
                    </div>
                    <div className="text-sm text-gray-500">
                      {moment(p.tour?.date).format("DD.MM.YYYY")}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {p.amount} RSD
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {p.status === "none" ? (
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-600">
                        —
                      </span>
                    ) : (
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          p.status === "paid"
                            ? "bg-green-100 text-green-800"
                            : p.status === "rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {p.status === "paid"
                          ? "Potvrđena"
                          : p.status === "rejected"
                          ? "Odbijena"
                          : "Na čekanju"}
                      </span>
                    )}
                    {/* <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        p.status === "paid"
                          ? "bg-green-100 text-green-800"
                          : p.status === "rejected"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {p.status === "paid"
                        ? "Potvrđena"
                        : p.status === "rejected"
                        ? "Odbijena"
                        : "Na čekanju"}
                    </span> */}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {p.tour?.premiumExpiresAt
                      ? moment(p.tour.premiumExpiresAt).format("DD.MM.YYYY")
                      : "-"}
                  </td>
                  {console.log("Admin notes:", p.adminNotes)}
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {p.adminNotes || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {p.status === "none" ? (
                      <span className="text-gray-400">Nema akcija</span>
                    ) : (
                      <div className="flex gap-2 flex-wrap">
                        {/* Dugmad za pending */}
                        {p.status === "pending" && (
                          <>
                            <button
                              onClick={() => handleConfirm(p._id)}
                              className="text-green-600 hover:text-green-900 bg-green-50 hover:bg-green-100 px-3 py-1 rounded text-sm font-medium transition-colors"
                            >
                              Potvrdi
                            </button>
                            <button
                              onClick={() => openRejectModal(p._id, "tour")}
                              className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1 rounded text-sm font-medium transition-colors"
                            >
                              Odbij
                            </button>
                          </>
                        )}

                        {/* Dugme Reset za sve osim none */}
                        {p.status !== "none" && (
                          <button
                            onClick={() => handleResetTourPremium(p._id)}
                            className="text-yellow-600 hover:text-yellow-900 bg-yellow-50 hover:bg-yellow-100 px-3 py-1 rounded text-sm font-medium transition-colors"
                          >
                            Reset
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {payments.length === 0 && (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    Nema uplata za ture.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Tabela za uplate za zahteve */}
      {activeTab === "shipments" && (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Korisnik
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Zahtev
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Iznos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Premium ističe
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Admin Notes
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Akcija
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {shipmentPayments.map((s) => (
                <tr key={s._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-[#c686ff]">
                      ID: {s.user?._id}
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      {s.user?.name}
                    </div>
                    <div className="text-sm text-gray-500">{s.user?.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-[#ff1493] block font-semibold">
                      ID: {s.shipment?._id}
                    </div>
                    <div className="text-sm text-gray-900">
                      {s.shipment?.pickupLocation} →{" "}
                      {s.shipment?.dropoffLocation}
                    </div>
                    <div className="text-sm text-gray-500">
                      {moment(s.shipment?.date).format("DD.MM.YYYY")}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {s.amount} RSD
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        s.status === "paid"
                          ? "bg-green-100 text-green-800"
                          : s.status === "rejected"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {s.status === "paid"
                        ? "Potvrđena"
                        : s.status === "rejected"
                        ? "Odbijena"
                        : "Na čekanju"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {s.shipment?.premiumExpiresAt
                      ? moment(s.shipment.premiumExpiresAt).format("DD.MM.YYYY")
                      : "-"}
                  </td>
                  {console.log("Admin notes:", s.adminNotes)}
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {s.adminNotes || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {s.status === "pending" && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleConfirmShipmentPayment(s._id)}
                          className="text-green-600 hover:text-green-900 bg-green-50 hover:bg-green-100 px-3 py-1 rounded text-sm font-medium transition-colors"
                        >
                          Potvrdi
                        </button>
                        <button
                          onClick={() => openRejectModal(s._id, "shipment")}
                          className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1 rounded text-sm font-medium transition-colors"
                        >
                          Odbij
                        </button>
                      </div>
                    )}
                    {s.status !== "pending" && (
                      <span className="text-gray-400">Nema akcija</span>
                    )}
                  </td>
                </tr>
              ))}
              {shipmentPayments.length === 0 && (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    Nema uplata za zahteve.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
