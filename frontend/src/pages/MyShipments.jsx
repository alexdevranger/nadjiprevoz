// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { Link, useNavigate } from "react-router-dom";
// import { useGlobalState } from "../helper/globalState";
// import { format } from "date-fns";
// import DatePicker, { registerLocale } from "react-datepicker";
// import srLatin from "../helper/sr-latin";
// import {
//   FaFilter,
//   FaTrash,
//   FaPlus,
//   FaEdit,
//   FaCalendarAlt,
//   FaMapMarkerAlt,
//   FaWeightHanging,
//   FaBox,
//   FaSyncAlt,
//   FaPallet,
//   FaRulerCombined,
//   FaArrowLeft,
//   FaComment,
//   FaChevronLeft,
//   FaChevronRight,
//   FaCrown,
// } from "react-icons/fa";

// registerLocale("sr-latin", srLatin);

// export default function MyShipments() {
//   const [token] = useGlobalState("token");
//   const [user] = useGlobalState("user");
//   const [requests, setRequests] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [allRequests, setAllRequests] = useState([]);
//   const [page, setPage] = useState(1);
//   const [limit, setLimit] = useState(20);
//   const [total, setTotal] = useState(0);

//   const [filterDate, setFilterDate] = useState(null);
//   const [pickupLocation, setPickupLocation] = useState("");
//   const [minWeight, setMinWeight] = useState("");
//   const [goodsType, setGoodsType] = useState("");
//   const navigate = useNavigate();

//   // Funkcija za resetovanje stranice kada se promeni filter
//   const handleFilterChange = (setter) => (value) => {
//     setter(value);
//     setPage(1); // Resetuj stranicu na 1 kada se promeni filter
//   };

//   const fetchRequests = async () => {
//     setLoading(true);
//     try {
//       const params = new URLSearchParams();
//       if (filterDate) params.append("date", format(filterDate, "yyyy-MM-dd"));
//       if (pickupLocation) params.append("pickupLocation", pickupLocation);
//       if (minWeight) params.append("minWeight", minWeight);
//       if (goodsType) params.append("goodsType", goodsType);
//       params.append("page", page);
//       params.append("limit", limit);
//       const token = localStorage.getItem("token");

//       // Proveri da li token postoji
//       if (!token) {
//         console.error("Token nije pronađen");
//         // Redirect to login ili pokaži error
//         return;
//       }

//       const res = await axios.get(
//         `/api/shipments/myshipments?${params.toString()}`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       setRequests(res.data.shipments || []);
//       setTotal(res.data.total || 0);

//       if (
//         !filterDate &&
//         !pickupLocation &&
//         !minWeight &&
//         !goodsType &&
//         page === 1
//       ) {
//         setAllRequests(res.data.shipments || []);
//       }
//     } catch (err) {
//       console.error("Greška pri učitavanju zahteva:", err);
//       setRequests([]);
//       setTotal(0);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handlePayPremium = async (shipmentId) => {
//     try {
//       const token = localStorage.getItem("token");

//       // Proveri da li token postoji
//       if (!token) {
//         console.error("Token nije pronađen");
//         // Redirect to login ili pokaži error
//         return;
//       }
//       const res = await axios.post(
//         "/api/payments/initiateShipmentPremium",
//         { shipmentId },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       const data = res.data;
//       console.log(
//         `Uplatite ${data.amount} RSD na račun ${data.accountNumber}, poziv na broj: ${data.referenceNumber}`
//       );
//       alert(
//         `Uplatite ${data.amount} RSD na račun ${data.accountNumber}, poziv na broj: ${data.referenceNumber}`
//       );
//     } catch (err) {
//       console.log(err);
//       alert("Greška pri generisanju uplate");
//     }
//   };

//   useEffect(() => {
//     fetchRequests();
//   }, [filterDate, pickupLocation, minWeight, goodsType, page, limit]);

//   const handleDelete = async (id) => {
//     if (!window.confirm("Da li ste sigurni da želite da obrišete zahtev?"))
//       return;
//     try {
//       const token = localStorage.getItem("token");

//       // Proveri da li token postoji
//       if (!token) {
//         console.error("Token nije pronađen");
//         // Redirect to login ili pokaži error
//         return;
//       }
//       await axios.delete(`/api/shipments/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       fetchRequests();
//     } catch {
//       alert("Greška prilikom brisanja zahteva.");
//     }
//   };

//   const handleResetFilters = () => {
//     setFilterDate(null);
//     setPickupLocation("");
//     setMinWeight("");
//     setGoodsType("");
//     setPage(1);
//   };

//   const totalPages = Math.ceil(total / limit);

//   // Funkcija za generisanje nasumične boje za border
//   const getRandomBorderColor = (index) => {
//     const colors = [
//       "border-blue-500",
//       "border-green-500",
//       "border-purple-500",
//       "border-indigo-500",
//       "border-pink-500",
//       "border-red-500",
//     ];
//     return colors[index % colors.length];
//   };

//   // Helper funkcija za skraćivanje teksta
//   const truncateText = (text, maxLength = 60) => {
//     if (!text) return "";
//     return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Header */}
//         <div className="bg-white rounded-xl shadow-md p-6 mb-6">
//           <div className="flex flex-col md:flex-row md:items-center justify-between">
//             <div>
//               <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
//                 Moji Zahtevi za Prevoz
//                 <span className="ml-3 text-lg font-medium text-blue-400 border-l-2 border-gray-300 pl-3">
//                   {total} zahteva (strana {page})
//                 </span>
//               </h1>
//               <p className="text-gray-600 mt-2">
//                 Upravljajte svojim zahtevima za prevoz robe
//               </p>
//             </div>
//             <div className="flex items-center mt-4 md:mt-0">
//               {/* Dugme NAZAD */}
//               <button
//                 onClick={() => navigate(-1)}
//                 className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center transition-colors text-base mr-2"
//               >
//                 <FaArrowLeft className="mr-2" />
//                 Nazad
//               </button>
//               <Link to="/add-shipment">
//                 <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center transition-colors duration-300">
//                   <FaPlus className="mr-2" />
//                   Dodaj novi zahtev
//                 </button>
//               </Link>
//             </div>
//           </div>
//         </div>

//         {/* Filteri */}
//         <div className="bg-white rounded-xl shadow-md p-6 mb-6">
//           <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
//             <FaFilter className="text-blue-500 mr-2" />
//             Filteri
//           </h2>

//           <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//             {/* Datum filter */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
//                 <FaCalendarAlt className="text-blue-500 mr-2" />
//                 Datum
//               </label>
//               <DatePicker
//                 selected={filterDate}
//                 onChange={handleFilterChange(setFilterDate)}
//                 isClearable
//                 placeholderText="Svi datumi"
//                 className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 dateFormat="d. MMMM yyyy"
//                 locale="sr-latin"
//               />
//             </div>

//             {/* Težina filter */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
//                 <FaWeightHanging className="text-green-500 mr-2" />
//                 Težina (kg)
//               </label>
//               <input
//                 type="number"
//                 value={minWeight}
//                 onChange={(e) =>
//                   handleFilterChange(setMinWeight)(e.target.value)
//                 }
//                 placeholder="Min. težina"
//                 className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 min={0}
//               />
//             </div>

//             {/* Lokacija filter */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
//                 <FaMapMarkerAlt className="text-red-500 mr-2" />
//                 Početna lokacija
//               </label>
//               <input
//                 type="text"
//                 value={pickupLocation}
//                 onChange={(e) =>
//                   handleFilterChange(setPickupLocation)(e.target.value)
//                 }
//                 placeholder="Unesi lokaciju"
//                 className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>

//             {/* Vrsta robe filter */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
//                 <FaBox className="text-purple-500 mr-2" />
//                 Vrsta robe
//               </label>
//               <input
//                 type="text"
//                 value={goodsType}
//                 onChange={(e) =>
//                   handleFilterChange(setGoodsType)(e.target.value)
//                 }
//                 placeholder="Unesi vrstu robe"
//                 className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>
//           </div>

//           {/* Reset filtera i limit selector */}
//           <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-4">
//             <button
//               onClick={handleResetFilters}
//               className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center transition-colors"
//             >
//               <FaSyncAlt className="mr-2" />
//               Reset filtera
//             </button>

//             <div className="flex items-center gap-2">
//               <label className="text-sm text-gray-700">
//                 Prikaži po strani:
//               </label>
//               <select
//                 value={limit}
//                 onChange={(e) => {
//                   setLimit(Number(e.target.value));
//                   setPage(1);
//                 }}
//                 className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               >
//                 <option value={20}>20</option>
//                 <option value={40}>40</option>
//                 <option value={60}>60</option>
//               </select>
//             </div>
//           </div>
//         </div>

//         {/* Lista zahteva */}
//         <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
//           {loading ? (
//             <div className="p-8 text-center">
//               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
//               <p className="text-gray-600 mt-4">Učitavanje zahteva...</p>
//             </div>
//           ) : requests.length === 0 ? (
//             <div className="p-8 text-center">
//               <p className="text-gray-600 text-lg">
//                 {filterDate || pickupLocation || minWeight || goodsType
//                   ? "Nema zahteva za prikaz sa odabranim filterima"
//                   : "Trenutno nema dostupnih zahteva."}
//               </p>
//             </div>
//           ) : (
//             <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {requests.map((req, index) => {
//                 const isPremium = req.isPremium;

//                 return (
//                   <div
//                     key={req._id}
//                     className={`relative rounded-xl shadow-md p-5 flex flex-col justify-between transition-all duration-300 hover:shadow-lg hover:translate-y-[-2px] ${
//                       isPremium
//                         ? "border-l-4 border-yellow-500 bg-yellow-50 ring-2 ring-yellow-400"
//                         : `border-l-4 ${getRandomBorderColor(index)} bg-white`
//                     }`}
//                     style={{ minHeight: "300px" }}
//                   >
//                     {/* Premium badge */}
//                     {isPremium && (
//                       <div className="absolute top-3 right-3 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center">
//                         <FaCrown className="mr-1" />
//                         PREMIUM
//                       </div>
//                     )}

//                     {/* Sadržaj */}
//                     <div className="flex-1 space-y-2 leading-tight text-sm text-gray-700">
//                       {/* Datum */}
//                       <div className="flex items-center text-lg font-bold text-gray-900">
//                         <FaCalendarAlt className="text-blue-500 mr-2" />
//                         {req.date
//                           ? format(new Date(req.date), "d. MMMM yyyy", {
//                               locale: srLatin,
//                             })
//                           : "Nije naveden"}
//                       </div>
//                       {/* Destinacija sa udaljenošću i vremenom */}
//                       <div className="flex items-center font-medium">
//                         <FaMapMarkerAlt className="text-red-500 mr-2" />
//                         <span>
//                           {req.pickupLocation} →{" "}
//                           {req.dropoffLocation || "Bilo gde"}
//                           {req.distanceMeters && req.durationSec && (
//                             <span className="text-gray-600 text-sm ml-2">
//                               ({(req.distanceMeters / 1000).toFixed(1)} km,{" "}
//                               {Math.round(req.durationSec / 60)} min)
//                             </span>
//                           )}
//                         </span>
//                       </div>

//                       {/* Težina */}
//                       <div className="flex items-center">
//                         <FaWeightHanging className="text-green-500 mr-2" />
//                         {req.weightKg} kg
//                       </div>

//                       {/* Palete */}
//                       {req.pallets && (
//                         <div className="flex items-center">
//                           <FaPallet className="text-purple-500 mr-2" />
//                           {req.pallets} paleta
//                         </div>
//                       )}

//                       {/* Vrsta robe */}
//                       {req.goodsType && (
//                         <div className="flex items-center">
//                           <FaBox className="text-yellow-500 mr-2" />
//                           {truncateText(req.goodsType, 60)}
//                         </div>
//                       )}

//                       {/* Dimenzije */}
//                       {req.dimensions && (
//                         <div className="flex items-center">
//                           <FaRulerCombined className="text-indigo-500 mr-2" />
//                           {req.dimensions.length} × {req.dimensions.width} ×{" "}
//                           {req.dimensions.height} m
//                         </div>
//                       )}
//                       {/* Napomena */}
//                       {req.note && (
//                         <div className="flex items-center">
//                           <FaComment className="text-gray-500 mr-2" />
//                           {truncateText(req.note, 60)}
//                         </div>
//                       )}
//                     </div>

//                     {/* Dugmad */}
//                     <div className="flex gap-2 pt-3 mt-4">
//                       <Link
//                         to={`/my-shipments/edit/${req._id}`}
//                         className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition-colors flex items-center justify-center text-sm font-medium"
//                       >
//                         <FaEdit className="mr-1" />
//                         Izmeni
//                       </Link>
//                       <button
//                         onClick={() => handleDelete(req._id)}
//                         className="flex-1 bg-[#d7d7d7] hover:bg-[#c1c1c1] text-[#3d3d3d] px-3 py-2 rounded-lg transition-colors flex items-center justify-center text-sm font-medium"
//                       >
//                         <FaTrash className="mr-1" />
//                         Obriši
//                       </button>
//                       {console.log(req._id)}
//                       {!req.isPremium && (
//                         <button
//                           onClick={() => handlePayPremium(req._id)}
//                           className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded-lg transition-colors flex items-center justify-center text-sm font-medium"
//                           title="Plati premijum"
//                         >
//                           <FaCrown className="mr-1" />
//                           Premium
//                         </button>
//                       )}
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           )}
//         </div>

//         {/* Paginacija */}
//         {requests.length > 0 && totalPages > 1 && (
//           <div className="bg-white rounded-xl shadow-md p-6">
//             <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
//               <div className="text-sm text-gray-600">
//                 Prikazano {requests.length} od {total} zahteva • Strana {page}{" "}
//                 od {totalPages}
//               </div>

//               <div className="flex items-center gap-4">
//                 <div className="flex items-center gap-2">
//                   <button
//                     disabled={page === 1}
//                     onClick={() => setPage(page - 1)}
//                     className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//                   >
//                     <FaChevronLeft className="text-sm" />
//                     Prethodna
//                   </button>

//                   <div className="flex gap-1">
//                     {[...Array(Math.min(5, totalPages))].map((_, i) => {
//                       const pageNumber = i + 1;
//                       return (
//                         <button
//                           key={pageNumber}
//                           onClick={() => setPage(pageNumber)}
//                           className={`w-10 h-10 rounded-lg flex items-center justify-center ${
//                             page === pageNumber
//                               ? "bg-blue-500 text-white"
//                               : "bg-gray-100 hover:bg-gray-200"
//                           } transition-colors`}
//                         >
//                           {pageNumber}
//                         </button>
//                       );
//                     })}
//                   </div>

//                   <button
//                     disabled={page >= totalPages}
//                     onClick={() => setPage(page + 1)}
//                     className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//                   >
//                     Sledeća
//                     <FaChevronRight className="text-sm" />
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useGlobalState } from "../helper/globalState";
import { format } from "date-fns";
import DatePicker, { registerLocale } from "react-datepicker";
import srLatin from "../helper/sr-latin";
import {
  FaFilter,
  FaTrash,
  FaPlus,
  FaEdit,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaWeightHanging,
  FaBox,
  FaSyncAlt,
  FaPallet,
  FaRulerCombined,
  FaArrowLeft,
  FaComment,
  FaChevronLeft,
  FaChevronRight,
  FaCrown,
  FaClock,
  FaTimes,
  FaInfoCircle,
} from "react-icons/fa";
import { socket } from "../App";

registerLocale("sr-latin", srLatin);

export default function MyShipments() {
  const [token] = useGlobalState("token");
  const [user] = useGlobalState("user");
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [allRequests, setAllRequests] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [total, setTotal] = useState(0);
  const [rejectionModal, setRejectionModal] = useState({
    open: false,
    shipment: null,
    adminNotes: "",
  });

  const [filterDate, setFilterDate] = useState(null);
  const [pickupLocation, setPickupLocation] = useState("");
  const [minWeight, setMinWeight] = useState("");
  const [goodsType, setGoodsType] = useState("");
  const navigate = useNavigate();

  // WebSocket efekti za real-time ažuriranja
  useEffect(() => {
    if (!user?.id) return;

    // Join user payment room
    socket.emit("joinPaymentRoom", user.id);

    // Slušaj ažuriranja paymenta
    socket.on("myPaymentUpdated", (data) => {
      console.log("Primljeno ažuriranje paymenta za shipment:", data);

      if (data.type === "shipment" && data.shipmentId) {
        // Konvertuj ObjectId u string
        const shipmentIdString = data.shipmentId.toString();
        const userIdString = data.userId?.toString();

        console.log("Shipment ID iz eventa:", shipmentIdString);
        console.log("User ID iz eventa:", userIdString);
        console.log("Trenutni user ID:", user.id);

        // Proveri da li je ovo za trenutnog korisnika
        if (userIdString && userIdString !== user.id) {
          console.log("Event nije za trenutnog korisnika");
          return;
        }

        // Ažuriraj shipment sa novim statusom
        setRequests((prevRequests) =>
          prevRequests.map((shipment) =>
            shipment._id === shipmentIdString
              ? {
                  ...shipment,
                  premiumStatus:
                    data.status === "paid" ? "approved" : "rejected",
                  isPremium: data.status === "paid",
                  payment: {
                    ...shipment.payment,
                    status: data.status,
                    adminNotes: data.adminNotes,
                  },
                }
              : shipment
          )
        );

        // Ažuriraj i allRequests
        setAllRequests((prevRequests) =>
          prevRequests.map((shipment) =>
            shipment._id === shipmentIdString
              ? {
                  ...shipment,
                  premiumStatus:
                    data.status === "paid" ? "approved" : "rejected",
                  isPremium: data.status === "paid",
                  payment: {
                    ...shipment.payment,
                    status: data.status,
                    adminNotes: data.adminNotes,
                  },
                }
              : shipment
          )
        );

        // Prikaži notifikaciju
        if (data.status === "paid") {
          alert("🎉 Vaš premium zahtev je odobren! Zahtev je sada premium.");
        } else if (data.status === "rejected") {
          alert(
            "❌ Vaš premium zahtev je odbijen. Proverite razlog odbijanja."
          );
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

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterDate) params.append("date", format(filterDate, "yyyy-MM-dd"));
      if (pickupLocation) params.append("pickupLocation", pickupLocation);
      if (minWeight) params.append("minWeight", minWeight);
      if (goodsType) params.append("goodsType", goodsType);
      params.append("page", page);
      params.append("limit", limit);
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("Token nije pronađen");
        return;
      }

      const res = await axios.get(
        `/api/shipments/myshipments?${params.toString()}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Dodaj premiumStatus ako ne postoji
      const shipmentsWithStatus = (res.data.shipments || []).map(
        (shipment) => ({
          ...shipment,
          premiumStatus:
            shipment.premiumStatus ||
            (shipment.isPremium ? "approved" : "none"),
        })
      );

      setRequests(shipmentsWithStatus);
      setTotal(res.data.total || 0);

      if (
        !filterDate &&
        !pickupLocation &&
        !minWeight &&
        !goodsType &&
        page === 1
      ) {
        setAllRequests(shipmentsWithStatus);
      }
    } catch (err) {
      console.error("Greška pri učitavanju zahteva:", err);
      setRequests([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  const handlePayPremium = async (shipmentId) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("Token nije pronađen");
        return;
      }

      // Proveri da li već postoji pending payment
      const existingPayment = await axios.get(
        "/api/payments/my-pending-payments",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const hasPendingPayment = existingPayment.data.shipmentPayments?.some(
        (payment) =>
          payment.shipment?._id === shipmentId && payment.status === "pending"
      );

      if (hasPendingPayment) {
        alert("Zahtev je već poslat. Sačekajte odobrenje admina.");
        return;
      }

      const res = await axios.post(
        "/api/payments/initiateShipmentPremium",
        { shipmentId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = res.data;
      console.log(
        `Uplatite ${data.amount} RSD na račun ${data.accountNumber}, poziv na broj: ${data.referenceNumber}`
      );
      alert(
        `Uplatite ${data.amount} RSD na račun ${data.accountNumber}, poziv na broj: ${data.referenceNumber}`
      );

      // Ažuriraj status na pending
      setRequests((prev) =>
        prev.map((shipment) =>
          shipment._id === shipmentId
            ? { ...shipment, premiumStatus: "pending" }
            : shipment
        )
      );

      setAllRequests((prev) =>
        prev.map((shipment) =>
          shipment._id === shipmentId
            ? { ...shipment, premiumStatus: "pending" }
            : shipment
        )
      );
    } catch (err) {
      console.log(err);
      if (err.response?.status === 400) {
        alert("Zahtev je već poslat. Sačekajte odobrenje admina.");
      } else {
        alert("Greška pri generisanju uplate");
      }
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [filterDate, pickupLocation, minWeight, goodsType, page, limit]);

  const handleDelete = async (id) => {
    if (!window.confirm("Da li ste sigurni da želite da obrišete zahtev?"))
      return;
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("Token nije pronađen");
        return;
      }
      await axios.delete(`/api/shipments/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchRequests();
    } catch {
      alert("Greška prilikom brisanja zahteva.");
    }
  };

  const handleResetFilters = () => {
    setFilterDate(null);
    setPickupLocation("");
    setMinWeight("");
    setGoodsType("");
    setPage(1);
  };

  const openRejectionModal = (shipment) => {
    setRejectionModal({
      open: true,
      shipment: shipment,
      adminNotes: shipment.payment?.adminNotes || "",
    });
  };

  const closeRejectionModal = () => {
    setRejectionModal({
      open: false,
      shipment: null,
      adminNotes: "",
    });
  };

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

  // Helper funkcija za skraćivanje teksta
  const truncateText = (text, maxLength = 60) => {
    if (!text) return "";
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  // Funkcija za renderovanje status badge-a
  const renderPremiumStatus = (shipment) => {
    if (shipment.isPremium) {
      return (
        <div className="absolute top-3 right-3 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center">
          <FaCrown className="mr-1" />
          PREMIUM
        </div>
      );
    }

    switch (shipment.premiumStatus) {
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
  const renderPremiumButton = (shipment) => {
    // Ako je već premium, ne prikazuj dugme
    if (shipment.isPremium) {
      return null;
    }

    switch (shipment.premiumStatus) {
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
            onClick={() => handlePayPremium(shipment._id)}
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
            onClick={() => handlePayPremium(shipment._id)}
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
  const renderRejectionInfo = (shipment) => {
    if (shipment.premiumStatus !== "rejected") return null;

    return (
      <div className="absolute top-12 right-3">
        <button
          onClick={() => openRejectionModal(shipment)}
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
        {rejectionModal.open && rejectionModal.shipment && (
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

        {/* Header */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                Moji Zahtevi za Prevoz
                <span className="ml-3 text-lg font-medium text-blue-400 border-l-2 border-gray-300 pl-3">
                  {total} zahteva (strana {page})
                </span>
              </h1>
              <p className="text-gray-600 mt-2">
                Upravljajte svojim zahtevima za prevoz robe
              </p>
            </div>
            <div className="flex items-center mt-4 md:mt-0">
              <button
                onClick={() => navigate(-1)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center transition-colors text-base mr-2"
              >
                <FaArrowLeft className="mr-2" />
                Nazad
              </button>
              <Link to="/add-shipment">
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center transition-colors duration-300">
                  <FaPlus className="mr-2" />
                  Dodaj novi zahtev
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

            {/* Težina filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <FaWeightHanging className="text-green-500 mr-2" />
                Težina (kg)
              </label>
              <input
                type="number"
                value={minWeight}
                onChange={(e) =>
                  handleFilterChange(setMinWeight)(e.target.value)
                }
                placeholder="Min. težina"
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
                value={pickupLocation}
                onChange={(e) =>
                  handleFilterChange(setPickupLocation)(e.target.value)
                }
                placeholder="Unesi lokaciju"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Vrsta robe filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <FaBox className="text-purple-500 mr-2" />
                Vrsta robe
              </label>
              <input
                type="text"
                value={goodsType}
                onChange={(e) =>
                  handleFilterChange(setGoodsType)(e.target.value)
                }
                placeholder="Unesi vrstu robe"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

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

        {/* Lista zahteva */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className="text-gray-600 mt-4">Učitavanje zahteva...</p>
            </div>
          ) : requests.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-600 text-lg">
                {filterDate || pickupLocation || minWeight || goodsType
                  ? "Nema zahteva za prikaz sa odabranim filterima"
                  : "Trenutno nema dostupnih zahteva."}
              </p>
            </div>
          ) : (
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {requests.map((req, index) => {
                const isPremium = req.isPremium;

                return (
                  <div
                    key={req._id}
                    className={`relative rounded-xl shadow-md p-5 flex flex-col justify-between transition-all duration-300 hover:shadow-lg hover:translate-y-[-2px] ${
                      isPremium
                        ? "border-l-4 border-yellow-500 bg-yellow-50 ring-2 ring-yellow-400"
                        : req.premiumStatus === "rejected"
                        ? "border-l-4 border-red-500 bg-red-50"
                        : req.premiumStatus === "pending"
                        ? "border-l-4 border-blue-500 bg-blue-50"
                        : `border-l-4 ${getRandomBorderColor(index)} bg-white`
                    }`}
                    style={{ minHeight: "300px" }}
                  >
                    {/* Status badge */}
                    {renderPremiumStatus(req)}
                    {/* Odbijanje info */}
                    {renderRejectionInfo(req)}

                    {/* Sadržaj */}
                    <div className="flex-1 space-y-2 leading-tight text-sm text-gray-700">
                      {/* Datum */}
                      <div className="flex items-center text-lg font-bold text-gray-900">
                        <FaCalendarAlt className="text-blue-500 mr-2" />
                        {req.date
                          ? format(new Date(req.date), "d. MMMM yyyy", {
                              locale: srLatin,
                            })
                          : "Nije naveden"}
                      </div>
                      {/* Destinacija sa udaljenošću i vremenom */}
                      <div className="flex items-center font-medium">
                        <FaMapMarkerAlt className="text-red-500 mr-2" />
                        <span>
                          {req.pickupLocation} →{" "}
                          {req.dropoffLocation || "Bilo gde"}
                          {req.distanceMeters && req.durationSec && (
                            <span className="text-gray-600 text-sm ml-2">
                              ({(req.distanceMeters / 1000).toFixed(1)} km,{" "}
                              {Math.round(req.durationSec / 60)} min)
                            </span>
                          )}
                        </span>
                      </div>

                      {/* Težina */}
                      <div className="flex items-center">
                        <FaWeightHanging className="text-green-500 mr-2" />
                        {req.weightKg} kg
                      </div>

                      {/* Palete */}
                      {req.pallets && (
                        <div className="flex items-center">
                          <FaPallet className="text-purple-500 mr-2" />
                          {req.pallets} paleta
                        </div>
                      )}

                      {/* Vrsta robe */}
                      {req.goodsType && (
                        <div className="flex items-center">
                          <FaBox className="text-yellow-500 mr-2" />
                          {truncateText(req.goodsType, 60)}
                        </div>
                      )}

                      {/* Dimenzije */}
                      {req.dimensions && (
                        <div className="flex items-center">
                          <FaRulerCombined className="text-indigo-500 mr-2" />
                          {req.dimensions.length} × {req.dimensions.width} ×{" "}
                          {req.dimensions.height} m
                        </div>
                      )}
                      {/* Napomena */}
                      {req.note && (
                        <div className="flex items-center">
                          <FaComment className="text-gray-500 mr-2" />
                          {truncateText(req.note, 60)}
                        </div>
                      )}
                    </div>

                    {/* Dugmad */}
                    <div className="flex gap-2 pt-3 mt-4">
                      <Link
                        to={`/my-shipments/edit/${req._id}`}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition-colors flex items-center justify-center text-sm font-medium"
                      >
                        <FaEdit className="mr-1" />
                        Izmeni
                      </Link>
                      <button
                        onClick={() => handleDelete(req._id)}
                        className="flex-1 bg-[#d7d7d7] hover:bg-[#c1c1c1] text-[#3d3d3d] px-3 py-2 rounded-lg transition-colors flex items-center justify-center text-sm font-medium"
                      >
                        <FaTrash className="mr-1" />
                        Obriši
                      </button>
                      {renderPremiumButton(req)}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Paginacija */}
        {requests.length > 0 && totalPages > 1 && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-600">
                Prikazano {requests.length} od {total} zahteva • Strana {page}{" "}
                od {totalPages}
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
