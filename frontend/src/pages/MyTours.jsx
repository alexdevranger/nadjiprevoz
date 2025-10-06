import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useGlobalState } from "../helper/globalState";
import { useToast } from "../components/ToastContext";
import PaymentModal from "../components/PaymentModal";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import srLatin from "../helper/sr-latin";
import { format } from "date-fns";
import {
  FaFilter,
  FaTrash,
  FaPlus,
  FaEdit,
  FaCrown,
  FaCalendarAlt,
  FaTruck,
  FaMapMarkerAlt,
  FaSyncAlt,
  FaWeightHanging,
  FaPhoneAlt,
  FaComment,
  FaArrowLeft,
  FaChevronLeft,
  FaChevronRight,
  FaClock,
  FaTimes,
  FaInfoCircle,
} from "react-icons/fa";
import { socket } from "../App";

registerLocale("sr-latin", srLatin);

export default function MyTours() {
  const [token] = useGlobalState("token");
  const [user] = useGlobalState("user");
  const [tours, setTours] = useState([]);
  const [allMyTours, setAllMyTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [total, setTotal] = useState(0);
  const [rejectionModal, setRejectionModal] = useState({
    open: false,
    tour: null,
    adminNotes: "",
  });

  // Filter state
  const [filterDate, setFilterDate] = useState(null);
  const [vehicleType, setVehicleType] = useState("");
  const [startLocation, setStartLocation] = useState("");
  const [minCapacity, setMinCapacity] = useState("");
  const [paymentModal, setPaymentModal] = useState({
    open: false,
    data: null,
  });
  const { success, error, warning, info } = useToast();
  const navigate = useNavigate();

  // WebSocket efekti za real-time ažuriranja
  // WebSocket efekti za real-time ažuriranja
  useEffect(() => {
    console.log("MyTours komponenta mountovana, user:", user?.id);
    console.log("Socket connected:", socket.connected);
    console.log("Socket ID:", socket.id);

    if (!user?.id) return;

    // Join user payment room
    socket.emit("joinPaymentRoom", user.id);

    // Slušaj ažuriranja paymenta
    socket.on("myPaymentUpdated", (data) => {
      console.log("Primljeno ažuriranje paymenta:", data);

      if (data.type === "tour" && data.tourId) {
        // KONVERTOVANJE ObjectId U STRING ZA POREDJENJE
        const tourIdString = data.tourId.toString();
        const userIdString = data.userId?.toString();

        console.log("Tour ID iz eventa:", tourIdString);
        console.log("User ID iz eventa:", userIdString);
        console.log("Trenutni user ID:", user.id);

        // Proveri da li je ovo za trenutnog korisnika
        if (userIdString && userIdString !== user.id) {
          console.log("Event nije za trenutnog korisnika");
          return;
        }

        console.log(
          "Pre ažuriranja - trenutne ture:",
          tours.map((t) => ({ id: t._id, status: t.premiumStatus }))
        );
        console.log("Tražim turu sa ID:", tourIdString);
        console.log(
          "Pronađena tura za ažuriranje:",
          tours.find((t) => t._id === tourIdString)
        );

        // Ažuriraj turu sa novim statusom
        setTours((prevTours) =>
          prevTours.map((tour) =>
            tour._id === tourIdString
              ? {
                  ...tour,
                  premiumStatus:
                    data.status === "paid"
                      ? "approved"
                      : data.status === "none"
                      ? "none"
                      : data.status === "expired"
                      ? "expired"
                      : "rejected",
                  isPremium: data.status === "paid",
                  payment: {
                    ...tour.payment,
                    status: data.status,
                    adminNotes: data.adminNotes,
                  },
                }
              : tour
          )
        );

        // Ažuriraj i allMyTours
        setAllMyTours((prevTours) =>
          prevTours.map((tour) =>
            tour._id === tourIdString
              ? {
                  ...tour,
                  premiumStatus:
                    data.status === "paid"
                      ? "approved"
                      : data.status === "none"
                      ? "none"
                      : data.status === "expired"
                      ? "expired"
                      : "rejected",
                  isPremium: data.status === "paid",
                  payment: {
                    ...tour.payment,
                    status: data.status,
                    adminNotes: data.adminNotes,
                  },
                }
              : tour
          )
        );

        // 🔔 Notifikacije prema statusu
        if (data.status === "paid") {
          success("🎉 Vaš premium zahtev je odobren! Tura je sada premium.");
        } else if (data.status === "rejected") {
          warning(
            "❌ Vaš premium zahtev je odbijen. Proverite razlog odbijanja."
          );
        } else if (data.status === "none") {
          info("🔄 Vaša tura je resetovana na početno stanje.");
        } else if (data.status === "expired") {
          warning("⌛ Vaš premium status je istekao.");
        }
      }
    });

    // Cleanup
    return () => {
      socket.off("myPaymentUpdated");
    };
  }, [user?.id]);

  // Funkcija za resetovanje stranice kada se promeni filter
  const handleFilterChange = (setter) => (value) => {
    setter(value);
    setPage(1);
  };

  const fetchTours = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterDate) params.append("date", format(filterDate, "yyyy-MM-dd"));
      if (vehicleType) params.append("vehicleType", vehicleType);
      if (startLocation) params.append("startLocation", startLocation);
      if (minCapacity) params.append("minCapacity", minCapacity);
      params.append("page", page);
      params.append("limit", limit);

      const token = localStorage.getItem("token");

      // Proveri da li token postoji
      if (!token) {
        console.error("Token nije pronađen");
        // Redirect to login ili pokaži error
        return;
      }

      const res = await axios.get(`/api/tours/my-tours?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Moje ture:", res.data);

      setTours(Array.isArray(res.data.tours) ? res.data.tours : []);
      setTotal(res.data.total || 0);

      if (
        !filterDate &&
        !vehicleType &&
        !startLocation &&
        !minCapacity &&
        page === 1
      ) {
        setAllMyTours(res.data.tours || []);
      }
    } catch (err) {
      console.error("Greška pri učitavanju tura:", err);
      setTours([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");

    // Proveri da li token postoji
    if (!token) {
      console.error("Token nije pronađen");
      // Redirect to login ili pokaži error
      return;
    }
    if (window.confirm("Da li ste sigurni da želite da obrišete turu?")) {
      try {
        await axios.delete(`/api/tours/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        success("Tura obrisana");
        fetchTours();
      } catch (err) {
        console.log(err);
        error("Greška prilikom brisanja ture");
      }
    }
  };

  const handlePayPremium = async (tourId) => {
    try {
      const token = localStorage.getItem("token");

      // Proveri da li token postoji
      if (!token) {
        console.error("Token nije pronađen");
        // Redirect to login ili pokaži error
        return;
      }

      // Proveri da li već postoji pending payment
      const existingPayment = await axios.get(
        "/api/payments/my-pending-payments",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const hasPendingPayment = existingPayment.data.tourPayments?.some(
        (payment) =>
          payment.tour?._id === tourId && payment.status === "pending"
      );

      if (hasPendingPayment) {
        warning("Zahtev je već poslat. Sačekajte odobrenje admina.");
        return;
      }

      const res = await axios.post(
        "/api/payments/initiateTourPremium",
        { tourId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = res.data;
      console.log(
        `Uplatite ${data.amount} RSD na račun ${data.accountNumber}, poziv na broj: ${data.referenceNumber}`
      );
      // alert(
      //   `Uplatite ${data.amount} RSD na račun ${data.accountNumber}, poziv na broj: ${data.referenceNumber}`
      // );
      setPaymentModal({
        open: true,
        data: {
          amount: data.amount,
          accountNumber: data.accountNumber,
          referenceNumber: data.referenceNumber,
        },
      });
      // fetchTours();
      // Ažuriraj status na pending (umesto fetchTours() za brži UX)
      setTours((prev) =>
        prev.map((tour) =>
          tour._id === tourId ? { ...tour, premiumStatus: "pending" } : tour
        )
      );

      setAllMyTours((prev) =>
        prev.map((tour) =>
          tour._id === tourId ? { ...tour, premiumStatus: "pending" } : tour
        )
      );
    } catch (err) {
      console.log(err);
      if (err.response?.status === 400) {
        warning("Zahtev je već poslat. Sačekajte odobrenje admina.");
      } else {
        error("Greška pri generisanju uplate");
      }
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      success("Kopirano u clipboard!");
    } catch (err) {
      console.error("Greška pri kopiranju:", err);
      error("Greška pri kopiranju");
    }
  };

  const copyAllPaymentData = () => {
    const { data } = paymentModal;
    if (!data) return;

    const text = `Uplatite ${data.amount} RSD na račun ${data.accountNumber}, poziv na broj: ${data.referenceNumber}`;
    copyToClipboard(text);
  };

  const closePaymentModal = () => {
    setPaymentModal({ open: false, data: null });
  };

  const openRejectionModal = (tour) => {
    setRejectionModal({
      open: true,
      tour: tour,
      adminNotes: tour.payment?.adminNotes || "",
    });
  };

  const closeRejectionModal = () => {
    setRejectionModal({
      open: false,
      tour: null,
      adminNotes: "",
    });
  };

  useEffect(() => {
    fetchTours();
  }, [filterDate, vehicleType, startLocation, minCapacity, page, limit]);

  const handleResetFilters = () => {
    setFilterDate(null);
    setVehicleType("");
    setStartLocation("");
    setMinCapacity("");
    setPage(1);
  };

  const uniqueVehicleTypes = [
    ...new Set(allMyTours.map((t) => t.vehicle?.type).filter(Boolean)),
  ];

  const totalPages = Math.ceil(total / limit);

  // Funkcija za generisanje nasumične boje za border
  const getRandomBorderColor = (index) => {
    const colors = [
      "border-blue-500",
      "border-green-500",
      "border-purple-500",
      "border-indigo-500",
      "border-pink-500",
      "border-red-500",
    ];
    return colors[index % colors.length];
  };
  const truncateText = (text, maxLength = 60) => {
    if (!text) return "";
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  // Funkcija za renderovanje status badge-a
  const renderPremiumStatus = (tour) => {
    if (tour.isPremium) {
      return (
        <div className="absolute top-3 right-3 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center">
          <FaCrown className="mr-1" />
          PREMIUM
        </div>
      );
    }

    switch (tour.premiumStatus) {
      case "pending":
        return (
          <div className="absolute top-3 right-3 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center">
            <FaClock className="mr-1" />
            NA ČEKANJU
          </div>
        );
      case "rejected":
        return (
          <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center">
            <FaTimes className="mr-1" />
            ODBIJENO
          </div>
        );
      default:
        return null;
    }
  };

  // Funkcija za renderovanje premium dugmeta
  const renderPremiumButton = (tour) => {
    // Ako je već premium, ne prikazuj dugme
    if (tour.isPremium) {
      return null;
    }

    switch (tour.premiumStatus) {
      case "pending":
        return (
          <button
            disabled
            className="flex-1 bg-yellow-500 text-white px-3 py-2 rounded-lg flex items-center justify-center text-sm font-medium cursor-not-allowed opacity-70"
            title="Zahtev je već poslat. Sačekajte odobrenje admina."
          >
            <FaCrown className="mr-1" />
            Premium
          </button>
        );
      case "rejected":
        return (
          <button
            onClick={() => handlePayPremium(tour._id)}
            className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded-lg transition-colors flex items-center justify-center text-sm font-medium"
            title="Pošalji ponovo zahtev za premium"
          >
            <FaCrown className="mr-1" />
            Premium
          </button>
        );
      default:
        return (
          <button
            onClick={() => handlePayPremium(tour._id)}
            className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded-lg transition-colors flex items-center justify-center text-sm font-medium"
            title="Plati premijum"
          >
            <FaCrown className="mr-1" />
            Premium
          </button>
        );
    }
  };

  // Funkcija za renderovanje odbijanja info
  const renderRejectionInfo = (tour) => {
    if (tour.premiumStatus !== "rejected") return null;

    return (
      <div className="absolute top-12 right-3">
        <button
          onClick={() => openRejectionModal(tour)}
          className="text-xs text-red-600 hover:text-red-700 underline flex items-center justify-center gap-1 bg-white bg-opacity-90 px-2 py-1 rounded"
        >
          <FaInfoCircle className="text-xs" />
          Razlog odbijanja
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Modal za prikaz razloga odbijanja */}
        {rejectionModal.open && rejectionModal.tour && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-96 max-w-sm">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FaInfoCircle className="text-red-500" />
                Razlog odbijanja
              </h3>

              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-gray-700">
                  {rejectionModal.adminNotes ||
                    "Nije naveden razlog odbijanja."}
                </p>
              </div>

              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs text-blue-700 text-center">
                  Kontaktirajte support za dodatna objašnjenja
                </p>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={closeRejectionModal}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                >
                  Zatvori
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Payment Modal */}
        {paymentModal.open && paymentModal.data && (
          // <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          //   <div className="bg-white rounded-xl max-w-md w-full mx-auto">
          //     {/* Header */}
          //     <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-xl">
          //       <div className="flex items-center justify-between">
          //         <div className="flex items-center">
          //           <div className="bg-white bg-opacity-20 p-2 rounded-lg mr-3">
          //             <FaCrown className="text-xl" />
          //           </div>
          //           <div>
          //             <h3 className="text-xl font-bold">Premium Uplata</h3>
          //             <p className="text-blue-100 text-sm mt-1">
          //               Podaci za uplatu premium paketa
          //             </p>
          //           </div>
          //         </div>
          //         <button
          //           onClick={closePaymentModal}
          //           className="text-white hover:text-blue-200 transition-colors"
          //         >
          //           <FaTimes className="text-xl" />
          //         </button>
          //       </div>
          //     </div>

          //     {/* Content */}
          //     <div className="p-6">
          //       {/* IPS Banner */}
          //       <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4 mb-6">
          //         <div className="flex items-center justify-between">
          //           <div className="flex items-center">
          //             <div className="bg-green-600 text-white p-2 rounded-lg mr-3">
          //               <svg
          //                 className="w-6 h-6"
          //                 fill="none"
          //                 stroke="currentColor"
          //                 viewBox="0 0 24 24"
          //               >
          //                 <path
          //                   strokeLinecap="round"
          //                   strokeLinejoin="round"
          //                   strokeWidth={2}
          //                   d="M13 10V3L4 14h7v7l9-11h-7z"
          //                 />
          //               </svg>
          //             </div>
          //             <div>
          //               <h4 className="font-semibold text-green-800">
          //                 Instant Payments Serbia
          //               </h4>
          //               <p className="text-green-600 text-sm">
          //                 NBS IPS QR Code
          //               </p>
          //             </div>
          //           </div>
          //           <div className="text-right">
          //             <div className="text-xs text-gray-500">Supported by</div>
          //             <div className="font-semibold text-blue-700">
          //               National Bank of Serbia
          //             </div>
          //           </div>
          //         </div>
          //       </div>

          //       {/* Payment Details */}
          //       <div className="space-y-4">
          //         <div className="bg-gray-50 rounded-lg p-4">
          //           <div className="flex justify-between items-center mb-2">
          //             <span className="text-sm font-medium text-gray-600">
          //               Iznos:
          //             </span>
          //             <button
          //               onClick={() =>
          //                 copyToClipboard(paymentModal.data.amount.toString())
          //               }
          //               className="text-blue-600 hover:text-blue-800 transition-colors"
          //               title="Kopiraj iznos"
          //             >
          //               <svg
          //                 className="w-4 h-4"
          //                 fill="none"
          //                 stroke="currentColor"
          //                 viewBox="0 0 24 24"
          //               >
          //                 <path
          //                   strokeLinecap="round"
          //                   strokeLinejoin="round"
          //                   strokeWidth={2}
          //                   d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
          //                 />
          //               </svg>
          //             </button>
          //           </div>
          //           <p className="text-2xl font-bold text-gray-800">
          //             {paymentModal.data.amount} RSD
          //           </p>
          //         </div>

          //         <div className="bg-gray-50 rounded-lg p-4">
          //           <div className="flex justify-between items-center mb-2">
          //             <span className="text-sm font-medium text-gray-600">
          //               Broj računa:
          //             </span>
          //             <button
          //               onClick={() =>
          //                 copyToClipboard(paymentModal.data.accountNumber)
          //               }
          //               className="text-blue-600 hover:text-blue-800 transition-colors"
          //               title="Kopiraj broj računa"
          //             >
          //               <svg
          //                 className="w-4 h-4"
          //                 fill="none"
          //                 stroke="currentColor"
          //                 viewBox="0 0 24 24"
          //               >
          //                 <path
          //                   strokeLinecap="round"
          //                   strokeLinejoin="round"
          //                   strokeWidth={2}
          //                   d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
          //                 />
          //               </svg>
          //             </button>
          //           </div>
          //           <p className="text-lg font-mono text-gray-800">
          //             {paymentModal.data.accountNumber}
          //           </p>
          //         </div>

          //         <div className="bg-gray-50 rounded-lg p-4">
          //           <div className="flex justify-between items-center mb-2">
          //             <span className="text-sm font-medium text-gray-600">
          //               Poziv na broj:
          //             </span>
          //             <button
          //               onClick={() =>
          //                 copyToClipboard(paymentModal.data.referenceNumber)
          //               }
          //               className="text-blue-600 hover:text-blue-800 transition-colors"
          //               title="Kopiraj poziv na broj"
          //             >
          //               <svg
          //                 className="w-4 h-4"
          //                 fill="none"
          //                 stroke="currentColor"
          //                 viewBox="0 0 24 24"
          //               >
          //                 <path
          //                   strokeLinecap="round"
          //                   strokeLinejoin="round"
          //                   strokeWidth={2}
          //                   d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
          //                 />
          //               </svg>
          //             </button>
          //           </div>
          //           <p className="text-lg font-mono text-gray-800">
          //             {paymentModal.data.referenceNumber}
          //           </p>
          //         </div>
          //       </div>

          //       {/* QR Code Placeholder - možeš dodati pravi QR kasnije */}
          //       <div className="mt-6 p-4 bg-white border-2 border-dashed border-gray-300 rounded-lg text-center">
          //         <div className="text-gray-500 mb-2">
          //           <svg
          //             className="w-12 h-12 mx-auto"
          //             fill="none"
          //             stroke="currentColor"
          //             viewBox="0 0 24 24"
          //           >
          //             <path
          //               strokeLinecap="round"
          //               strokeLinejoin="round"
          //               strokeWidth={1}
          //               d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
          //             />
          //           </svg>
          //         </div>
          //         <p className="text-sm text-gray-600">IPS QR Code</p>
          //         <p className="text-xs text-gray-500 mt-1">
          //           Skenirajte za brzu uplatu
          //         </p>
          //       </div>

          //       {/* Action Buttons */}
          //       <div className="flex gap-3 mt-6">
          //         <button
          //           onClick={copyAllPaymentData}
          //           className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition-colors flex items-center justify-center font-medium"
          //         >
          //           <svg
          //             className="w-5 h-5 mr-2"
          //             fill="none"
          //             stroke="currentColor"
          //             viewBox="0 0 24 24"
          //           >
          //             <path
          //               strokeLinecap="round"
          //               strokeLinejoin="round"
          //               strokeWidth={2}
          //               d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
          //             />
          //           </svg>
          //           Kopiraj sve
          //         </button>
          //         <button
          //           onClick={closePaymentModal}
          //           className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-lg transition-colors font-medium"
          //         >
          //           Zatvori
          //         </button>
          //       </div>

          //       {/* Instructions */}
          //       <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          //         <p className="text-sm text-yellow-800 text-center">
          //           📋 Nakon uplate, premium status će biti aktiviran u roku od
          //           24h
          //         </p>
          //       </div>
          //     </div>
          //   </div>
          // </div>
          <PaymentModal
            open={paymentModal.open}
            data={paymentModal.data}
            onClose={closePaymentModal}
            copyToClipboard={copyToClipboard}
            copyAllPaymentData={copyAllPaymentData}
            user={user}
          />
        )}

        {/* Header */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                Moje Ture
                <span className="ml-3 text-lg font-medium text-blue-400 border-l-2 border-gray-300 pl-3">
                  {total} tura (strana {page})
                </span>
              </h1>
              <p className="text-gray-600 mt-2">
                Upravljajte svojim turama i njihovim detaljima
              </p>
            </div>
            <div className="flex items-center mt-4 md:mt-0">
              {/* Dugme NAZAD */}
              <button
                onClick={() => navigate(-1)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center transition-colors text-base mr-2"
              >
                <FaArrowLeft className="mr-2" />
                Nazad
              </button>
              <Link to="/add-tour">
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center transition-colors duration-300">
                  <FaPlus className="mr-2" />
                  Dodaj novu turu
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Filteri */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <FaFilter className="text-blue-500 mr-2" />
            Filteri
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Datum filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <FaCalendarAlt className="text-blue-500 mr-2" />
                Datum
              </label>
              <DatePicker
                selected={filterDate}
                onChange={handleFilterChange(setFilterDate)}
                isClearable
                placeholderText="Svi datumi"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                dateFormat="d. MMMM yyyy"
                locale="sr-latin"
              />
            </div>

            {/* Vrsta vozila filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <FaTruck className="text-green-500 mr-2" />
                Vrsta vozila
              </label>
              <select
                value={vehicleType}
                onChange={(e) =>
                  handleFilterChange(setVehicleType)(e.target.value)
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Sve vrste</option>
                {uniqueVehicleTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Nosivost filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <FaWeightHanging className="text-purple-500 mr-2" />
                Nosivost (kg)
              </label>
              <input
                type="number"
                value={minCapacity}
                onChange={(e) =>
                  handleFilterChange(setMinCapacity)(e.target.value)
                }
                placeholder="Min. nosivost"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                min={0}
              />
            </div>

            {/* Lokacija filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <FaMapMarkerAlt className="text-red-500 mr-2" />
                Početna lokacija
              </label>
              <input
                type="text"
                value={startLocation}
                onChange={(e) =>
                  handleFilterChange(setStartLocation)(e.target.value)
                }
                placeholder="Unesi lokaciju"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Reset filtera i limit selector */}
          <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-4">
            <button
              onClick={handleResetFilters}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center transition-colors"
            >
              <FaSyncAlt className="mr-2" />
              Reset filtera
            </button>

            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-700">
                Prikaži po strani:
              </label>
              <select
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setPage(1);
                }}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={20}>20</option>
                <option value={40}>40</option>
                <option value={60}>60</option>
              </select>
            </div>
          </div>
        </div>

        {/* Lista tura */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className="text-gray-600 mt-4">Učitavanje tura...</p>
            </div>
          ) : tours.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-600 text-lg">
                {filterDate || vehicleType || startLocation || minCapacity
                  ? "Nema tura za prikaz sa odabranim filterima"
                  : "Trenutno nema dostupnih tura."}
              </p>
            </div>
          ) : (
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tours.map((tour, index) => {
                const vehicle = tour.vehicle || {};
                const isPremium = tour.isPremium;

                const formatCapacity = (capacity) => {
                  if (!capacity) return "";
                  return capacity >= 1000
                    ? `${(capacity / 1000).toFixed(1)} t`
                    : `${capacity} kg`;
                };

                return (
                  <div
                    key={tour._id}
                    className={`relative rounded-xl shadow-md p-5 flex flex-col justify-between transition-all duration-300 hover:shadow-lg hover:translate-y-[-2px] ${
                      isPremium
                        ? "border-l-4 border-yellow-500 bg-yellow-50 ring-2 ring-yellow-400"
                        : tour.premiumStatus === "rejected"
                        ? "border-l-4 border-red-500 bg-red-50"
                        : tour.premiumStatus === "pending"
                        ? "border-l-4 border-blue-500 bg-blue-50"
                        : `border-l-4 ${getRandomBorderColor(index)} bg-white`
                    }`}
                    style={{ minHeight: "260px" }}
                  >
                    {/* Status badge */}
                    {renderPremiumStatus(tour)}
                    {/* Odbijanje info - ispod dugmadi */}
                    {renderRejectionInfo(tour)}

                    {/* Sadržaj */}
                    <div className="flex-1 space-y-2 leading-tight text-sm text-gray-700">
                      {/* Datum */}
                      <div className="flex items-center text-lg font-bold text-gray-900">
                        <FaCalendarAlt className="text-blue-500 mr-2" />
                        {format(new Date(tour.date), "d. MMMM yyyy", {
                          locale: srLatin,
                        })}
                      </div>

                      {/* Destinacija */}
                      <div className="flex items-center font-medium">
                        <FaMapMarkerAlt className="text-red-500 mr-2" />
                        {tour.startLocation} → {tour.endLocation || "Bilo gde"}
                      </div>

                      {/* Vozilo */}
                      {tour.vehicle?.type && (
                        <div className="flex items-center">
                          <FaTruck className="text-green-500 mr-2" />
                          {tour.vehicle.type} -{" "}
                          {formatCapacity(tour.vehicle.capacity)}
                        </div>
                      )}

                      {/* Kontakt */}
                      {tour.contactPerson && tour.contactPhone && (
                        <div className="flex items-center gap-2">
                          <span>
                            <span className="font-medium">Kontakt:</span>{" "}
                            {tour.contactPerson} ({tour.contactPhone})
                          </span>
                        </div>
                      )}

                      {/* Napomena */}
                      {tour.note && (
                        <div className="text-gray-600 italic">
                          {truncateText(tour.note, 60)}
                        </div>
                      )}
                    </div>

                    {/* Dugmad */}
                    <div className="flex gap-2 pt-3 mt-4">
                      <Link
                        to={`/my-tours/${tour._id}`}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition-colors flex items-center justify-center text-sm font-medium"
                      >
                        <FaEdit className="mr-1" />
                        Izmeni
                      </Link>

                      <button
                        onClick={() => handleDelete(tour._id)}
                        className="flex-1 bg-[#d7d7d7] hover:bg-[#c1c1c1] text-[#3d3d3d] px-3 py-2 rounded-lg transition-colors flex items-center justify-center text-sm font-medium"
                      >
                        <FaTrash className="mr-1" />
                        Obriši
                      </button>
                      {renderPremiumButton(tour)}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Paginacija */}
        {tours.length > 0 && totalPages > 1 && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-600">
                Prikazano {tours.length} od {total} tura • Strana {page} od{" "}
                {totalPages}
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <FaChevronLeft className="text-sm" />
                    Prethodna
                  </button>

                  <div className="flex gap-1">
                    {[...Array(Math.min(5, totalPages))].map((_, i) => {
                      const pageNumber = i + 1;
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => setPage(pageNumber)}
                          className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            page === pageNumber
                              ? "bg-blue-500 text-white"
                              : "bg-gray-100 hover:bg-gray-200"
                          } transition-colors`}
                        >
                          {pageNumber}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    disabled={page >= totalPages}
                    onClick={() => setPage(page + 1)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Sledeća
                    <FaChevronRight className="text-sm" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
