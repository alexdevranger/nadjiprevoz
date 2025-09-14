// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { Link } from "react-router-dom";
// import { useGlobalState } from "../helper/globalState";
// import { format } from "date-fns";
// import DatePicker, { registerLocale } from "react-datepicker";
// import srLatin from "../helper/sr-latin";

// registerLocale("sr-latin", srLatin);

// export default function MyShipments() {
//   const [token] = useGlobalState("token");
//   const [user] = useGlobalState("user");
//   const [requests, setRequests] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const [filterDate, setFilterDate] = useState(null);
//   const [pickupLocation, setPickupLocation] = useState("");

//   useEffect(() => {
//     async function load() {
//       const params = new URLSearchParams();
//       if (filterDate) params.append("date", format(filterDate, "yyyy-MM-dd"));
//       if (pickupLocation) params.append("pickupLocation", pickupLocation);
//       const res = await axios.get(
//         `/api/shipments/myshipments?${params.toString()}`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       setRequests(res.data);
//     }
//     load();
//   }, [filterDate, pickupLocation]);

//   const handleDelete = async (id) => {
//     if (!window.confirm("Da li ste sigurni da želite da obrišete zahtev?"))
//       return;
//     try {
//       await axios.delete(`/api/shipments/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       fetchRequests();
//     } catch {
//       alert("Greška prilikom brisanja zahteva.");
//     }
//   };

//   return (
//     <div className="max-w-4xl mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-4">Moji zahtevi za prevoz</h1>
//       {/* FILTER */}
//       <aside className="p-4 bg-white rounded shadow flex gap-4">
//         {/* DATE PICKER */}
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

//         {/* PICKUP LOCATION */}
//         <div className="relative flex-1">
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
//       </aside>

//       {loading ? (
//         <p>Učitavanje...</p>
//       ) : requests.length === 0 ? (
//         <p className="text-gray-600 text-center text-3xl pt-24">
//           Nemate unetih zahteva.
//         </p>
//       ) : (
//         requests.map((req) => (
//           <div
//             key={req._id}
//             className="border p-3 my-3 rounded shadow flex justify-between items-center"
//           >
//             <div>
//               <p>
//                 <strong>{req.pickupLocation}</strong> → {req.dropoffLocation}
//                 {req.distanceMeters && req.durationSec && (
//                   <>
//                     {" "}
//                     ( {(req.distanceMeters / 1000).toFixed(1)} km,{" "}
//                     {Math.round(req.durationSec / 60)} min )
//                   </>
//                 )}
//               </p>
//               <p>
//                 Datum:{" "}
//                 {req.date
//                   ? format(new Date(req.date), "d. MMMM yyyy", {
//                       locale: srLatin,
//                     })
//                   : "Nije naveden"}
//               </p>
//               <p>Težina: {req.weightKg} kg</p>
//               <p>
//                 Gabarit:{" "}
//                 {req.dimensions
//                   ? `${req.dimensions.length} x ${req.dimensions.width} x ${req.dimensions.height} cm`
//                   : "Nije navedeno"}
//               </p>
//               <p>Vrsta robe: {req.goodsType || "Nije navedeno"}</p>
//               <p>Paletna mesta: {req.pallets || "Nije navedeno"}</p>
//             </div>
//             <div className="flex gap-2">
//               <Link
//                 to={`/my-shipments/edit/${req._id}`}
//                 className="bg-blue-600 text-white px-3 py-1 rounded"
//               >
//                 Izmeni
//               </Link>
//               {user && user.id === req.createdBy && (
//                 <button
//                   onClick={() => handleDelete(req._id)}
//                   className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
//                 >
//                   Obriši
//                 </button>
//               )}
//             </div>
//           </div>
//         ))
//       )}
//     </div>
//   );
// }
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
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
} from "react-icons/fa";

registerLocale("sr-latin", srLatin);

export default function MyShipments() {
  const [token] = useGlobalState("token");
  const [user] = useGlobalState("user");
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [allRequests, setAllRequests] = useState([]);

  const [filterDate, setFilterDate] = useState(null);
  const [pickupLocation, setPickupLocation] = useState("");

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterDate) params.append("date", format(filterDate, "yyyy-MM-dd"));
      if (pickupLocation) params.append("pickupLocation", pickupLocation);

      const res = await axios.get(
        `/api/shipments/myshipments?${params.toString()}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setRequests(res.data);

      if (!filterDate && !pickupLocation) {
        setAllRequests(res.data);
      }
    } catch (err) {
      console.error("Greška pri učitavanju zahteva:", err);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [filterDate, pickupLocation]);

  const handleDelete = async (id) => {
    if (!window.confirm("Da li ste sigurni da želite da obrišete zahtev?"))
      return;
    try {
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
  };

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
                Moji Zahtevi za Prevoz
              </h1>
              <p className="text-gray-600 mt-2">
                Upravljajte svojim zahtevima za prevoz robe
              </p>
            </div>
            <div className="flex items-center mt-4 md:mt-0">
              <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full mr-3">
                {requests.length} zahteva
              </span>
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                onChange={(e) => setPickupLocation(e.target.value)}
                placeholder="Unesi lokaciju"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Reset filtera */}
            <div className="flex items-end">
              <button
                onClick={handleResetFilters}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center transition-colors w-full h-[42px]"
              >
                <FaSyncAlt className="mr-2" />
                Reset filtera
              </button>
            </div>
          </div>
        </div>

        {/* Lista zahteva */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className="text-gray-600 mt-4">Učitavanje zahteva...</p>
            </div>
          ) : requests.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-600 text-lg">
                {filterDate || pickupLocation
                  ? "Nema zahteva za prikaz sa odabranim filterima"
                  : "Trenutno nema dostupnih zahteva."}
              </p>
            </div>
          ) : (
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {requests.map((req, index) => (
                <div
                  key={req._id}
                  className={`relative border-l-4 ${getRandomBorderColor(
                    index
                  )} rounded-xl shadow-md p-5 flex flex-col justify-between transition-all duration-300 hover:shadow-lg hover:translate-y-[-2px] bg-white`}
                  style={{ minHeight: "300px" }}
                >
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
                        {req.goodsType}
                      </div>
                    )}

                    {/* Dimenzije */}
                    {req.dimensions && (
                      <div className="flex items-center">
                        <FaRulerCombined className="text-indigo-500 mr-2" />
                        {req.dimensions.length} × {req.dimensions.width} ×{" "}
                        {req.dimensions.height} cm
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

                    {user &&
                      (user.id === req.createdBy ||
                        user._id === req.createdBy) && (
                        <button
                          onClick={() => handleDelete(req._id)}
                          className="flex-1 bg-red-100 hover:bg-red-200 text-red-600 px-3 py-2 rounded-lg transition-colors flex items-center justify-center text-sm font-medium"
                        >
                          <FaTrash className="mr-1" />
                          Obriši
                        </button>
                      )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
