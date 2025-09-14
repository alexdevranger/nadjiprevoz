import React, { useEffect, useState } from "react";
import axios from "axios";
import DatePicker, { registerLocale } from "react-datepicker";
import { format, isAfter, isToday, parseISO } from "date-fns";
import srLatin from "../helper/sr-latin";
import { useGlobalState } from "../helper/globalState";
import { useNavigate } from "react-router-dom";
import {
  FaFilter,
  FaSearch,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaWeightHanging,
  FaBox,
  FaTimes,
  FaSyncAlt,
  FaPhoneAlt,
  FaComment,
} from "react-icons/fa";

registerLocale("sr-latin", srLatin);

export default function AllShipments() {
  const [token] = useGlobalState("token");
  const [user] = useGlobalState("user");
  const navigate = useNavigate();

  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalShipments, setTotalShipments] = useState([]);

  // Filter states
  const [filterDate, setFilterDate] = useState(null);
  const [minWeight, setMinWeight] = useState("");
  const [pickupLocation, setPickupLocation] = useState("");
  const [goodsType, setGoodsType] = useState("");

  const [unreadByShipment, setUnreadByShipment] = useState({});
  const [userConvs, setUserConvs] = useState(new Set());

  // Funkcija za otvaranje chata za shipment
  async function openChat(shipment) {
    const otherUserId = shipment.createdBy._id;
    const shipmentId = shipment._id;

    // Provera da li je trenutni korisnik vlasnik
    const isOwner =
      user &&
      shipment.createdBy &&
      (user.id === shipment.createdBy._id ||
        user._id === shipment.createdBy._id);

    if (isOwner) {
      // Ako je vlasnik, idi direktno na chat
      navigate("/chat", { state: { shipmentId: shipment._id } });
      return;
    }

    if (
      String(otherUserId) === String(user.id) ||
      String(otherUserId) === String(user._id)
    ) {
      alert("Ne možete poslati poruku sami sebi.");
      return;
    }

    try {
      const res = await axios.post(
        "/api/conversations/shipment",
        { shipmentId, otherUserId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const conv = res.data;
      navigate("/chat", { state: { conversationId: conv._id } });
    } catch (err) {
      console.error(err);
      alert("Greška pri otvaranju konverzacije");
    }
  }

  const fetchShipments = async () => {
    setLoading(true);
    let dateStr = filterDate ? format(filterDate, "d. MMMM yyyy") : "";

    const params = new URLSearchParams();
    if (dateStr) params.append("date", dateStr);
    if (minWeight) params.append("minWeight", minWeight);
    if (pickupLocation) params.append("pickupLocation", pickupLocation);
    if (goodsType) params.append("goodsType", goodsType);

    try {
      const res = await axios.get("/api/shipments?" + params.toString());
      const today = new Date();
      const futureShipments = res.data.filter((shipment) => {
        const shipmentDate = parseISO(shipment.date);
        return isAfter(shipmentDate, today) || isToday(shipmentDate);
      });
      setShipments(futureShipments);
      if (!filterDate && !minWeight && !pickupLocation && !goodsType) {
        setTotalShipments(futureShipments);
      }
    } catch (err) {
      console.error("Greška pri učitavanju pošiljki", err);
      setShipments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleResetFilters = () => {
    setFilterDate(null);
    setMinWeight("");
    setPickupLocation("");
    setGoodsType("");
  };

  useEffect(() => {
    fetchShipments();
  }, [filterDate, minWeight, pickupLocation, goodsType]);

  // Učitavanje konverzacija za prikaz badge-ova
  useEffect(() => {
    if (!token || !user) return;

    axios
      .get("/api/conversations", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const map = {};
        const setIds = new Set();

        res.data.forEach((conv) => {
          // Proveri da li konverzacija ima shipmentId
          const shipmentId = conv.shipmentId?._id || conv.shipmentId || null;
          if (!shipmentId) return;

          // Dodaj u set korisnikovih konverzacija
          setIds.add(String(shipmentId));

          // Broj nepročitanih za ovog korisnika - proveri oba oblika ID-ja
          const userId = user.id || user._id;
          const unreadCount = conv.unread?.[userId] || 0;

          map[String(shipmentId)] =
            (map[String(shipmentId)] || 0) + unreadCount;
        });

        setUnreadByShipment(map);
        setUserConvs(setIds);
      })
      .catch((err) => console.error("Greška pri dohvaćanju konverzacija", err));
  }, [token, user]);

  const uniqueGoodsTypes = [
    ...new Set(totalShipments.map((s) => s.goodsType).filter(Boolean)),
  ];

  // Funkcija za generisanje nasumične boje za border
  const getRandomBorderColor = (index) => {
    const colors = [
      "border-blue-500",
      "border-green-500",
      "border-purple-500",
      "border-yellow-500",
      "border-indigo-500",
      "border-pink-500",
      "border-red-500",
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                Svi Transportni Zahtevi
              </h1>
              <p className="text-gray-600 mt-2">
                Pronađite savršenu pošiljku za vaš transport
              </p>
            </div>
            <div className="flex items-center mt-4 md:mt-0">
              <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full mr-3">
                {shipments.length} pošiljki
              </span>
              <button
                onClick={handleResetFilters}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center transition-colors"
              >
                <FaSyncAlt className="mr-2" />
                Reset filtera
              </button>
            </div>
          </div>
        </div>

        {/* Filteri - Horizontalno za velike ekrane */}
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
                onChange={setFilterDate}
                isClearable
                placeholderText="Svi datumi"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                dateFormat="d. MMMM yyyy"
                locale="sr-latin"
                minDate={new Date()}
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
                onChange={(e) => setMinWeight(e.target.value)}
                placeholder="Min. težina"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                min={0}
              />
            </div>

            {/* Lokacija filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <FaMapMarkerAlt className="text-purple-500 mr-2" />
                Početna lokacija
              </label>
              <input
                type="text"
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
                placeholder="Unesi lokaciju"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Vrsta robe filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <FaBox className="text-red-500 mr-2" />
                Vrsta robe
              </label>
              <select
                value={goodsType}
                onChange={(e) => setGoodsType(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Sve vrste</option>
                {uniqueGoodsTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Lista pošiljki */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className="text-gray-600 mt-4">Učitavanje pošiljki...</p>
            </div>
          ) : shipments.length === 0 ? (
            <div className="p-8 text-center">
              <FaSearch className="text-4xl text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">
                {filterDate || minWeight || pickupLocation || goodsType
                  ? "Nema pošiljki za prikaz sa odabranim filterima"
                  : "Trenutno nema dostupnih pošiljki."}
              </p>
            </div>
          ) : (
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {shipments.map((shipment, index) => {
                const isOwner =
                  user &&
                  shipment.createdBy &&
                  (user.id === shipment.createdBy._id ||
                    user._id === shipment.createdBy._id);

                return (
                  <div
                    key={shipment._id}
                    className={`relative border-l-4 ${getRandomBorderColor(
                      index
                    )} rounded-xl shadow-md p-5 flex flex-col justify-between transition-all duration-300 hover:shadow-lg hover:translate-y-[-2px] ${
                      isOwner ? "bg-blue-50" : "bg-white"
                    }`}
                    style={{ minHeight: "260px" }}
                  >
                    {/* Sadržaj */}
                    <div className="flex-1 space-y-2 leading-tight text-sm text-gray-700">
                      {/* Datum */}
                      <div className="flex items-center text-lg font-bold text-gray-900">
                        <FaCalendarAlt className="text-blue-500 mr-2" />
                        {format(new Date(shipment.date), "d. MMMM yyyy", {
                          locale: srLatin,
                        })}
                      </div>

                      {/* Destinacija */}
                      <div className="flex items-center font-medium">
                        <FaMapMarkerAlt className="text-red-500 mr-2" />
                        {shipment.pickupLocation} →{" "}
                        {shipment.dropoffLocation || "Bilo gde"}
                      </div>

                      {/* Težina i palete */}
                      <div className="flex items-center">
                        <FaWeightHanging className="text-green-500 mr-2" />
                        {shipment.weightKg} kg • {shipment.pallets} paleta
                      </div>

                      {/* Vrsta robe */}
                      {shipment.goodsType && (
                        <div className="flex items-center">
                          <FaBox className="text-purple-500 mr-2" />
                          {shipment.goodsType}
                        </div>
                      )}

                      {/* Dimenzije */}
                      {shipment.dimensions?.length &&
                        shipment.dimensions?.width &&
                        shipment.dimensions?.height && (
                          <div className="text-gray-600">
                            Dimenzije: {shipment.dimensions.length} ×{" "}
                            {shipment.dimensions.width} ×{" "}
                            {shipment.dimensions.height} cm
                          </div>
                        )}

                      {/* Vlasnik */}
                      {/* <div className="text-gray-600">
                        Vlasnik:{" "}
                        {shipment.createdBy?.name ||
                          shipment.createdBy?.company}
                      </div> */}

                      {/* Kontakt */}
                      {shipment.contactPhone && (
                        <div className="flex items-center gap-2 mt-2">
                          <FaPhoneAlt className="text-green-600" />
                          <span>
                            {shipment.createdBy?.name ||
                              shipment.createdBy?.company}{" "}
                            ({shipment.contactPhone})
                          </span>
                          {!isOwner && (
                            <a
                              href={`tel:${shipment.contactPhone}`}
                              className="ml-auto bg-green-500 hover:bg-green-600 text-white text-xs px-3 py-1 rounded-lg flex items-center"
                            >
                              <FaPhoneAlt className="mr-1" />
                              Pozovi
                            </a>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Dugmad */}
                    <div className="flex gap-2 pt-3 mt-4">
                      <button
                        onClick={() => openChat(shipment)}
                        className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center ${
                          isOwner
                            ? userConvs.has(String(shipment._id))
                              ? "bg-green-600 hover:bg-green-700 text-white"
                              : "bg-blue-600 hover:bg-blue-700 text-white"
                            : "bg-blue-600 hover:bg-blue-700 text-white"
                        }`}
                      >
                        <FaComment className="mr-1" />
                        {isOwner
                          ? userConvs.has(String(shipment._id))
                            ? "Idi na chat"
                            : "Nema poruka"
                          : "Pošalji poruku"}
                        {isOwner &&
                          unreadByShipment[String(shipment._id)] > 0 && (
                            <span className="ml-1 bg-red-500 text-white rounded-full px-2 py-0.5 text-xs">
                              {unreadByShipment[String(shipment._id)]}
                            </span>
                          )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import DatePicker, { registerLocale } from "react-datepicker";
// import { format } from "date-fns";
// import srLatin from "../helper/sr-latin";
// import { useGlobalState } from "../helper/globalState";
// import { useNavigate } from "react-router-dom";
// registerLocale("sr-latin", srLatin);

// export default function AllShipments() {
//   const [token] = useGlobalState("token");
//   const [user] = useGlobalState("user");
//   const navigate = useNavigate();
//   const [filterDate, setFilterDate] = useState(null);
//   const [minWeight, setMinWeight] = useState("");
//   const [pickupLocation, setPickupLocation] = useState("");
//   const [goodsType, setGoodsType] = useState("");
//   const [shipments, setShipments] = useState([]);
//   const [unreadByShipment, setUnreadByShipment] = useState({});
//   const [userConvs, setUserConvs] = useState(new Set());

//   // Funkcija za otvaranje chata za shipment
//   async function openChat(shipment) {
//     const otherUserId = shipment.createdBy._id;
//     const shipmentId = shipment._id;

//     // Provera da li je trenutni korisnik vlasnik
//     const isOwner =
//       user &&
//       shipment.createdBy &&
//       (user.id === shipment.createdBy._id ||
//         user._id === shipment.createdBy._id);

//     if (isOwner) {
//       // Ako je vlasnik, idi direktno na chat
//       navigate("/chat", { state: { shipmentId: shipment._id } });
//       return;
//     }

//     if (
//       String(otherUserId) === String(user.id) ||
//       String(otherUserId) === String(user._id)
//     ) {
//       alert("Ne možete poslati poruku sami sebi.");
//       return;
//     }

//     try {
//       const res = await axios.post(
//         "/api/conversations/shipment",
//         { shipmentId, otherUserId },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       const conv = res.data;
//       navigate("/chat", { state: { conversationId: conv._id } });
//     } catch (err) {
//       console.error(err);
//       alert("Greška pri otvaranju konverzacije");
//     }
//   }

//   useEffect(() => {
//     async function load() {
//       const params = new URLSearchParams();
//       if (filterDate) params.append("date", format(filterDate, "yyyy-MM-dd"));
//       if (minWeight) params.append("minWeight", minWeight);
//       if (pickupLocation) params.append("pickupLocation", pickupLocation);
//       if (goodsType) params.append("goodsType", goodsType);

//       try {
//         const res = await axios.get("/api/shipments?" + params.toString());
//         console.log("Shipments data:", res.data);
//         setShipments(res.data);
//       } catch (err) {
//         console.error("Greška pri učitavanju zahteva:", err);
//       }
//     }
//     load();
//   }, [filterDate, minWeight, pickupLocation, goodsType]);

//   // Učitavanje konverzacija za prikaz badge-ova
//   useEffect(() => {
//     if (!token || !user) return;

//     console.log("Učitavam konverzacije za user:", user);

//     axios
//       .get("/api/conversations", {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       .then((res) => {
//         console.log("Konverzacije:", res.data);

//         const map = {};
//         const setIds = new Set();

//         res.data.forEach((conv) => {
//           // Proveri da li konverzacija ima shipmentId
//           const shipmentId = conv.shipmentId?._id || conv.shipmentId || null;
//           console.log("Konverzacija sa shipmentId:", shipmentId);

//           if (!shipmentId) return;

//           // Dodaj u set korisnikovih konverzacija
//           setIds.add(String(shipmentId));

//           // Broj nepročitanih za ovog korisnika - proveri oba oblika ID-ja
//           const userId = user.id || user._id;
//           const unreadCount = conv.unread?.[userId] || 0;

//           console.log(`Shipment: ${shipmentId}, Nepročitane: ${unreadCount}`);

//           map[String(shipmentId)] =
//             (map[String(shipmentId)] || 0) + unreadCount;
//         });

//         console.log("Mapa nepročitanih:", map);
//         console.log("Set konverzacija:", setIds);

//         setUnreadByShipment(map);
//         setUserConvs(setIds);
//       })
//       .catch((err) => console.error("Greška pri dohvaćanju konverzacija", err));
//   }, [token, user]);

//   return (
//     <div className="max-w-6xl mx-auto p-4 flex gap-6">
//       <aside className="w-72 p-4 bg-white rounded shadow space-y-3">
//         <div className="relative">
//           <DatePicker
//             selected={filterDate}
//             onChange={setFilterDate}
//             locale="sr-latin"
//             dateFormat="d. MMMM yyyy"
//             placeholderText="Odaberi datum"
//             className="w-full p-2 border rounded focus-visible:outline-none focus-visible:ring-0"
//           />
//           {filterDate && (
//             <button
//               type="button"
//               onClick={() => setFilterDate(null)}
//               className="absolute right-2 top-2 text-gray-500 hover:text-red-500"
//             >
//               ✕
//             </button>
//           )}
//         </div>
//         <div className="relative">
//           <input
//             value={minWeight}
//             onChange={(e) => setMinWeight(e.target.value)}
//             placeholder="Min težina (kg)"
//             className="w-full p-2 border rounded focus-visible:outline-none focus-visible:ring-0"
//           />
//           {minWeight && (
//             <button
//               type="button"
//               onClick={() => setMinWeight("")}
//               className="absolute right-2 top-2 text-gray-500 hover:text-red-500"
//             >
//               ✕
//             </button>
//           )}
//         </div>
//         <div className="relative">
//           <input
//             value={pickupLocation}
//             onChange={(e) => setPickupLocation(e.target.value)}
//             placeholder="Početna destinacija"
//             className="w-full p-2 border rounded focus-visible:outline-none focus-visible:ring-0"
//           />
//           {pickupLocation && (
//             <button
//               type="button"
//               onClick={() => setPickupLocation("")}
//               className="absolute right-2 top-2 text-gray-500 hover:text-red-500"
//             >
//               ✕
//             </button>
//           )}
//         </div>
//         <div className="relative">
//           <input
//             value={goodsType}
//             onChange={(e) => setGoodsType(e.target.value)}
//             placeholder="Vrsta robe"
//             className="w-full p-2 border rounded focus-visible:outline-none focus-visible:ring-0"
//           />
//           {goodsType && (
//             <button
//               type="button"
//               onClick={() => setGoodsType("")}
//               className="absolute right-2 top-2 text-gray-500 hover:text-red-500"
//             >
//               ✕
//             </button>
//           )}
//         </div>
//       </aside>

//       <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
//         {shipments.map((s) => {
//           const isOwner =
//             user &&
//             s.createdBy &&
//             ((user.id && user.id === s.createdBy._id) ||
//               (user._id && user._id === s.createdBy._id));

//           const hasConversation = userConvs.has(String(s._id));
//           const unreadCount = unreadByShipment[String(s._id)] || 0;

//           return (
//             <div
//               key={s._id}
//               className={`rounded-xl shadow-md p-5 flex flex-col justify-between transition-all duration-300 hover:shadow-lg hover:translate-y-[-2px] ${
//                 isOwner ? "bg-yellow-50" : "bg-white"
//               }`}
//               style={{ minHeight: "260px" }}
//             >
//               {/* Header */}
//               <div className="flex items-center gap-2 mb-2 text-gray-700">
//                 <span className="text-lg font-semibold">
//                   {format(new Date(s.date), "d. MMMM yyyy", {
//                     locale: srLatin,
//                   })}
//                 </span>
//               </div>

//               {/* Podaci */}
//               <div className="flex-1 space-y-1 text-sm">
//                 <p>
//                   <strong>{s.pickupLocation}</strong> →{" "}
//                   {s.dropoffLocation || "Bilo gde"}
//                 </p>
//                 <p>
//                   Težina: {s.weightKg} kg • Palete: {s.pallets}
//                 </p>
//                 <p>Vrsta robe: {s.goodsType || "-"}</p>
//                 {s.dimensions?.length &&
//                   s.dimensions?.width &&
//                   s.dimensions?.height && (
//                     <p>
//                       Gabarit: {s.dimensions.length} x {s.dimensions.width} x{" "}
//                       {s.dimensions.height} cm
//                     </p>
//                   )}
//                 <p>Vlasnik: {s.createdBy?.name || s.createdBy?.company}</p>

//                 {/* Kontakt */}
//                 {isOwner ? (
//                   <p>
//                     <span className="font-medium">Kontakt:</span>{" "}
//                     {s.contactPhone}
//                   </p>
//                 ) : (
//                   <div className="flex items-center gap-2">
//                     <p>{s.contactPhone}</p>
//                     <a
//                       href={`tel:${s.contactPhone}`}
//                       className="ml-auto bg-green-500 hover:bg-green-600 text-white text-xs px-3 py-1 rounded-lg flex items-center"
//                     >
//                       📞 Pozovi
//                     </a>
//                   </div>
//                 )}
//               </div>

//               {/* Dugmad */}
//               <div className="flex gap-2 pt-3 mt-4">
//                 <button
//                   onClick={() => openChat(s)}
//                   className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium shadow ${
//                     isOwner
//                       ? hasConversation
//                         ? "bg-green-600 text-white"
//                         : "bg-gray-400 text-white"
//                       : "bg-blue-600 text-white"
//                   }`}
//                 >
//                   {isOwner
//                     ? hasConversation
//                       ? "Idi na chat"
//                       : "Nema poruka"
//                     : "Pošalji poruku"}
//                   {isOwner && unreadCount > 0 && (
//                     <span className="ml-2 bg-red-500 text-white rounded-full px-2 py-0.5 text-xs">
//                       {unreadCount}
//                     </span>
//                   )}
//                 </button>
//               </div>
//             </div>
//           );
//         })}
//       </section>
//     </div>
//   );
// }
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import DatePicker, { registerLocale } from "react-datepicker";
// import { format } from "date-fns";
// import srLatin from "../helper/sr-latin";
// import { useGlobalState } from "../helper/globalState";
// import { useNavigate } from "react-router-dom";
// registerLocale("sr-latin", srLatin);

// export default function AllShipments() {
//   const [token] = useGlobalState("token");
//   const [user] = useGlobalState("user");
//   const navigate = useNavigate();
//   const [filterDate, setFilterDate] = useState(null);
//   const [minWeight, setMinWeight] = useState("");
//   const [pickupLocation, setPickupLocation] = useState("");
//   const [goodsType, setGoodsType] = useState("");
//   const [shipments, setShipments] = useState([]);
//   const [unreadByShipment, setUnreadByShipment] = useState({});
//   const [userConvs, setUserConvs] = useState(new Set());

//   // Funkcija za otvaranje chata za shipment
//   async function openChat(shipment) {
//     console.log(shipment);
//     const otherUserId = shipment.createdBy._id;
//     const shipmentId = shipment._id;

//     if (String(otherUserId) === String(user._id)) {
//       alert("Ne možete poslati poruku sami sebi.");
//       return;
//     }

//     try {
//       const res = await axios.post(
//         "/api/conversations",
//         { shipmentId, otherUserId },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       const conv = res.data;
//       navigate("/chat", { state: { conversationId: conv._id } });
//     } catch (err) {
//       console.error(err);
//       alert("Greška pri otvaranju konverzacije");
//     }
//   }

//   useEffect(() => {
//     async function load() {
//       const params = new URLSearchParams();
//       if (filterDate) params.append("date", format(filterDate, "yyyy-MM-dd"));
//       if (minWeight) params.append("minWeight", minWeight);
//       if (pickupLocation) params.append("pickupLocation", pickupLocation);
//       if (goodsType) params.append("goodsType", goodsType);

//       try {
//         const res = await axios.get("/api/shipments?" + params.toString());
//         console.log(res.data);
//         setShipments(res.data);
//       } catch (err) {
//         console.error("Greška pri učitavanju zahteva:", err);
//       }
//     }
//     load();
//   }, [filterDate, minWeight, pickupLocation, goodsType]);

//   // Učitavanje konverzacija za prikaz badge-ova
//   useEffect(() => {
//     if (!token || !user) return;

//     axios
//       .get("/api/conversations", {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       .then((res) => {
//         const map = {};
//         const setIds = new Set();

//         res.data.forEach((conv) => {
//           // shipmentId za identifikaciju
//           const shipmentId = conv.shipmentId?._id || null;

//           if (!shipmentId) return;

//           // dodaj u set korisnikovih konverzacija
//           setIds.add(String(shipmentId));

//           // broj nepročitanih za ovog korisnika
//           const unreadCount =
//             conv.unread?.[user._id] || conv.unread?.[user.id] || 0;
//           map[String(shipmentId)] =
//             (map[String(shipmentId)] || 0) + unreadCount;
//         });

//         setUnreadByShipment(map);
//         setUserConvs(setIds);
//       })
//       .catch((err) => console.error("Greška pri dohvaćanju konverzacija", err));
//   }, [token, user]);

//   return (
//     <div className="max-w-6xl mx-auto p-4 flex gap-6">
//       <aside className="w-72 p-4 bg-white rounded shadow space-y-3">
//         <div className="relative">
//           <DatePicker
//             selected={filterDate}
//             onChange={setFilterDate}
//             locale="sr-latin"
//             dateFormat="d. MMMM yyyy"
//             placeholderText="Odaberi datum"
//             className="w-full p-2 border rounded"
//           />
//           {filterDate && (
//             <button
//               type="button"
//               onClick={() => setFilterDate(null)}
//               className="absolute right-2 top-2 text-gray-500 hover:text-red-500"
//             >
//               ✕
//             </button>
//           )}
//         </div>
//         <div className="relative">
//           <input
//             value={minWeight}
//             onChange={(e) => setMinWeight(e.target.value)}
//             placeholder="Min težina (kg)"
//             className="w-full p-2 border rounded"
//           />
//           {minWeight && (
//             <button
//               type="button"
//               onClick={() => setMinWeight("")}
//               className="absolute right-2 top-2 text-gray-500 hover:text-red-500"
//             >
//               ✕
//             </button>
//           )}
//         </div>
//         <div className="relative">
//           <input
//             value={pickupLocation}
//             onChange={(e) => setPickupLocation(e.target.value)}
//             placeholder="Početna destinacija"
//             className="w-full p-2 border rounded"
//           />
//           {pickupLocation && (
//             <button
//               type="button"
//               onClick={() => setPickupLocation("")}
//               className="absolute right-2 top-2 text-gray-500 hover:text-red-500"
//             >
//               ✕
//             </button>
//           )}
//         </div>
//         <div className="relative">
//           <input
//             value={goodsType}
//             onChange={(e) => setGoodsType(e.target.value)}
//             placeholder="Vrsta robe"
//             className="w-full p-2 border rounded"
//           />
//           {goodsType && (
//             <button
//               type="button"
//               onClick={() => setGoodsType("")}
//               className="absolute right-2 top-2 text-gray-500 hover:text-red-500"
//             >
//               ✕
//             </button>
//           )}
//         </div>
//       </aside>

//       <section className="flex-1 space-y-4">
//         {shipments.map((s) => {
//           const isOwner = user && s.createdBy && user.id === s.createdBy._id;

//           return (
//             <div
//               key={s._id}
//               className="p-4 bg-white rounded shadow flex justify-between items-start"
//             >
//               <div className="flex-1">
//                 <p className="text-sm text-gray-500">
//                   {format(new Date(s.date), "d. MMMM yyyy", {
//                     locale: srLatin,
//                   })}
//                 </p>
//                 <p>
//                   <strong>{s.pickupLocation}</strong> →{" "}
//                   {s.dropoffLocation || "Bilo gde"}
//                   {s.distanceMeters && s.durationSec && (
//                     <>
//                       {" "}
//                       ( {(s.distanceMeters / 1000).toFixed(1)} km,{" "}
//                       {Math.round(s.durationSec / 60)} min )
//                     </>
//                   )}
//                 </p>
//                 <p>
//                   Težina: {s.weightKg} kg • Palete: {s.pallets}
//                 </p>
//                 <p>Vrsta: {s.goodsType || "-"}</p>
//                 {s.dimensions &&
//                   s.dimensions.length &&
//                   s.dimensions.width &&
//                   s.dimensions.height && (
//                     <p>
//                       Gabarit:{" "}
//                       {s.dimensions
//                         ? `${s.dimensions.length} x ${s.dimensions.width} x ${s.dimensions.height} cm`
//                         : "Nije navedeno"}
//                     </p>
//                   )}
//                 <p>
//                   Kontakt osoba: {s.createdBy?.name || s.createdBy?.company}
//                 </p>
//                 <p>Kontakt telefon: {s.contactPhone}</p>
//               </div>

//               <div className="relative inline-block">
//                 <button
//                   onClick={() =>
//                     isOwner
//                       ? navigate("/chat", { state: { shipmentId: s._id } })
//                       : openChat(s)
//                   }
//                   className={`px-3 py-1 rounded mr-2 relative ${
//                     isOwner
//                       ? userConvs.has(String(s._id))
//                         ? "bg-green-600 text-white" // ima konverzaciju za ovaj zahtev
//                         : "bg-blue-600 text-white" // nema konverzaciju
//                       : "bg-blue-600 text-white"
//                   }`}
//                 >
//                   {isOwner
//                     ? userConvs.has(String(s._id))
//                       ? "Idi na chat"
//                       : "Nema poruka"
//                     : "Pošalji poruku"}

//                   {/* Badge unutar dugmeta */}
//                   {isOwner && unreadByShipment[String(s._id)] > 0 && (
//                     <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full px-2 py-0.5 text-xs">
//                       {unreadByShipment[String(s._id)]}
//                     </span>
//                   )}
//                 </button>
//               </div>
//             </div>
//           );
//         })}
//       </section>
//     </div>
//   );
// }
// // Requests.jsx (skraćeno)
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import DatePicker, { registerLocale } from "react-datepicker";
// import { format } from "date-fns";
// import srLatin from "../helper/sr-latin";
// import { useGlobalState } from "../helper/globalState";
// registerLocale("sr-latin", srLatin);

// export default function AllShipments() {
//   const [token] = useGlobalState("token");
//   const [filterDate, setFilterDate] = useState(null);
//   const [minWeight, setMinWeight] = useState("");
//   const [pickupLocation, setPickupLocation] = useState("");
//   const [goodsType, setGoodsType] = useState("");
//   const [shipments, setShipments] = useState([]);

//   useEffect(() => {
//     async function load() {
//       const params = new URLSearchParams();
//       if (filterDate) params.append("date", format(filterDate, "yyyy-MM-dd"));
//       if (minWeight) params.append("minWeight", minWeight);
//       if (pickupLocation) params.append("pickupLocation", pickupLocation);
//       if (goodsType) params.append("goodsType", goodsType);
//       const res = await axios.get("/api/shipments?" + params.toString());
//       console.log(res.data);
//       setShipments(res.data);
//     }
//     load();
//   }, [filterDate, minWeight, pickupLocation, goodsType]);

//   return (
//     <div className="max-w-6xl mx-auto p-4 flex gap-6">
//       <aside className="w-72 p-4 bg-white rounded shadow space-y-3">
//         <div className="relative">
//           <DatePicker
//             selected={filterDate}
//             onChange={setFilterDate}
//             locale="sr-latin"
//             dateFormat="d. MMMM yyyy"
//             placeholderText="Odaberi datum"
//             className="w-full p-2 border rounded"
//           />
//           {filterDate && (
//             <button
//               type="button"
//               onClick={() => setFilterDate(null)}
//               className="absolute right-2 top-2 text-gray-500 hover:text-red-500"
//             >
//               ✕
//             </button>
//           )}
//         </div>
//         <div className="relative">
//           <input
//             value={minWeight}
//             onChange={(e) => setMinWeight(e.target.value)}
//             placeholder="Min težina (kg)"
//           />
//           {minWeight && (
//             <button
//               type="button"
//               onClick={() => setMinWeight("")}
//               className="absolute right-2 top-2 text-gray-500 hover:text-red-500"
//             >
//               ✕
//             </button>
//           )}
//         </div>
//         <div className="relative">
//           <input
//             value={pickupLocation}
//             onChange={(e) => setPickupLocation(e.target.value)}
//             placeholder="Početna destinacija"
//           />
//           {pickupLocation && (
//             <button
//               type="button"
//               onClick={() => setPickupLocation("")}
//               className="absolute right-2 top-2 text-gray-500 hover:text-red-500"
//             >
//               ✕
//             </button>
//           )}
//         </div>
//         <div className="relative">
//           <input
//             value={goodsType}
//             onChange={(e) => setGoodsType(e.target.value)}
//             placeholder="Vrsta robe"
//           />
//           {goodsType && (
//             <button
//               type="button"
//               onClick={() => setGoodsType("")}
//               className="absolute right-2 top-2 text-gray-500 hover:text-red-500"
//             >
//               ✕
//             </button>
//           )}
//         </div>
//       </aside>

//       <section className="flex-1 space-y-4">
//         {shipments.map((s) => (
//           <div key={s._id} className="p-4 bg-white rounded shadow">
//             <p className="text-sm text-gray-500">
//               {format(new Date(s.date), "d. MMMM yyyy", { locale: srLatin })}
//             </p>
//             <p>
//               <strong>{s.pickupLocation}</strong> →{" "}
//               {s.dropoffLocation || "Bilo gde"}
//               {s.distanceMeters && s.durationSec && (
//                 <>
//                   {" "}
//                   ( {(s.distanceMeters / 1000).toFixed(1)} km,{" "}
//                   {Math.round(s.durationSec / 60)} min )
//                 </>
//               )}
//             </p>
//             <p>
//               Težina: {s.weightKg} kg • Palete: {s.pallets}
//             </p>
//             <p>Vrsta: {s.goodsType || "-"}</p>
//             {s.dimensions &&
//               s.dimensions.length &&
//               s.dimensions.width &&
//               s.dimensions.height && (
//                 <p>
//                   Gabarit:{" "}
//                   {s.dimensions
//                     ? `${s.dimensions.length} x ${s.dimensions.width} x ${s.dimensions.height} cm`
//                     : "Nije navedeno"}
//                 </p>
//               )}
//             <p>Kontakt osoba: {s.createdBy?.name || s.createdBy?.company}</p>
//             <p>Kontakt telefon: {s.contactPhone}</p>
//           </div>
//         ))}
//       </section>
//     </div>
//   );
// }
