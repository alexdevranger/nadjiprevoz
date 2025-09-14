// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { Link } from "react-router-dom";
// import { useGlobalState } from "../helper/globalState";
// import DatePicker, { registerLocale } from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import srLatin from "../helper/sr-latin";
// import { format } from "date-fns";
// import {
//   FaFilter,
//   FaTrash,
//   FaPlus,
//   FaEye,
//   FaEdit,
//   FaCrown,
//   FaCalendarAlt,
//   FaTruck,
//   FaMapMarkerAlt,
// } from "react-icons/fa";

// registerLocale("sr-latin", srLatin);

// export default function MyTours() {
//   const [token] = useGlobalState("token");
//   const [tours, setTours] = useState([]);
//   const [allMyTours, setAllMyTours] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Filter state
//   const [filterDate, setFilterDate] = useState(null);
//   const [vehicleType, setVehicleType] = useState("");
//   const [startLocation, setStartLocation] = useState("");

//   const fetchTours = async () => {
//     setLoading(true);
//     try {
//       const params = new URLSearchParams();
//       if (filterDate) params.append("date", filterDate.toISOString());
//       if (vehicleType) params.append("vehicleType", vehicleType);
//       if (startLocation) params.append("startLocation", startLocation);

//       const res = await axios.get(`/api/tours/my-tours?${params.toString()}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       console.log("Moje ture:", res.data);

//       setTours(Array.isArray(res.data) ? res.data : []);
//       if (!filterDate && !vehicleType && !startLocation) {
//         setAllMyTours(res.data);
//       }
//     } catch (err) {
//       console.error("Greška pri učitavanju tura:", err);
//       setTours([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!token) {
//       alert("Morate biti ulogovani da biste obrisali turu.");
//       return;
//     }
//     if (window.confirm("Da li ste sigurni da želite da obrišete turu?")) {
//       try {
//         await axios.delete(`/api/tours/${id}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         alert("Tura obrisana");
//         fetchTours({
//           date: filterDate,
//           vehicleType,
//           startLocation,
//         });
//       } catch (err) {
//         console.log(err);
//         alert("Greška prilikom brisanja ture");
//       }
//     }
//   };

//   const handlePayPremium = async (tourId) => {
//     try {
//       const res = await axios.post(
//         "/api/payments/initiate",
//         { tourId },
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
//       console.error(err);
//       alert("Greška pri generisanju uplate");
//     }
//   };

//   useEffect(() => {
//     fetchTours({
//       date: filterDate,
//       vehicleType,
//       startLocation,
//     });
//   }, [filterDate, vehicleType, startLocation]);

//   const uniqueVehicleTypes = [
//     ...new Set(allMyTours.map((t) => t.vehicle?.type).filter(Boolean)),
//   ];

//   // Funkcija za generisanje nasumične boje za border
//   const getRandomBorderColor = (index) => {
//     const colors = [
//       "border-blue-500",
//       "border-green-500",
//       "border-purple-500",
//       "border-yellow-500",
//       "border-indigo-500",
//       "border-pink-500",
//       "border-red-500",
//     ];
//     return colors[index % colors.length];
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Header */}
//         <div className="bg-white rounded-xl shadow-md p-6 mb-6 transition-all duration-300 hover:shadow-lg">
//           <div className="flex flex-col md:flex-row md:items-center justify-between">
//             <div>
//               <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
//                 Moje Ture
//               </h1>
//               <p className="text-gray-600 mt-2">
//                 Upravljajte svojim turama i njihovim detaljima
//               </p>
//             </div>
//             <Link to="/add-tour">
//               <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center mt-4 md:mt-0 transition-colors duration-300">
//                 <FaPlus className="mr-2" />
//                 Dodaj novo turu
//               </button>
//             </Link>
//           </div>
//         </div>

//         {/* Filter i statistika */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
//           <div className="bg-white rounded-xl shadow-md p-6 md:col-span-3 transition-all duration-300 hover:shadow-lg">
//             <div className="flex flex-col md:flex-row md:items-center justify-between">
//               <h2 className="text-lg font-semibold text-gray-800 mb-4 md:mb-0">
//                 Lista tura ({tours.length})
//               </h2>

//               {/* Filter po tipu */}
//               <div className="flex items-center gap-4 flex-wrap">
//                 <div className="flex items-center">
//                   <FaFilter className="text-gray-500 mr-2" />
//                   <div className="relative">
//                     <DatePicker
//                       selected={filterDate}
//                       onChange={(date) => setFilterDate(date)}
//                       locale="sr-latin"
//                       dateFormat="d. MMMM yyyy"
//                       placeholderText="Odaberi datum"
//                       className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
//                     />
//                     {filterDate && (
//                       <button
//                         type="button"
//                         onClick={() => setFilterDate(null)}
//                         className="absolute right-2 top-2 text-gray-500 hover:text-red-500"
//                       >
//                         ✕
//                       </button>
//                     )}
//                   </div>
//                 </div>

//                 <div className="flex items-center">
//                   <FaTruck className="text-gray-500 mr-2" />
//                   <select
//                     value={vehicleType}
//                     onChange={(e) => setVehicleType(e.target.value)}
//                     className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
//                   >
//                     <option value="">Sva vozila</option>
//                     {uniqueVehicleTypes.map((type) => (
//                       <option key={type} value={type}>
//                         {type}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 <div className="flex items-center">
//                   <FaMapMarkerAlt className="text-gray-500 mr-2" />
//                   <div className="relative">
//                     <input
//                       value={startLocation}
//                       onChange={(e) => setStartLocation(e.target.value)}
//                       placeholder="Početna lokacija"
//                       className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
//                     />
//                     {startLocation && (
//                       <button
//                         type="button"
//                         onClick={() => setStartLocation("")}
//                         className="absolute right-2 top-2 text-gray-500 hover:text-red-500"
//                       >
//                         ✕
//                       </button>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Broj tura kartica */}
//           <div className="bg-white rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg">
//             <div className="flex items-center">
//               <div className="p-3 rounded-lg bg-blue-100 text-blue-600 mr-4">
//                 <FaCalendarAlt className="text-2xl" />
//               </div>
//               <div>
//                 <p className="text-sm text-gray-600">Ukupno tura</p>
//                 <p className="text-2xl font-bold">{tours.length}</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Sadržaj - lista tura */}
//         <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
//           {loading ? (
//             <div className="p-6 text-center">
//               <p className="text-gray-500">Učitavanje tura...</p>
//             </div>
//           ) : tours.length === 0 ? (
//             <div className="p-6 text-center">
//               <p className="text-gray-600">
//                 {filterDate || vehicleType || startLocation
//                   ? "Nema tura za prikaz sa odabranim filterima"
//                   : "Nema tura za prikaz."}
//               </p>
//             </div>
//           ) : (
//             <div className="p-6 grid grid-cols-1 gap-6">
//               {tours.map((t, index) => (
//                 <div
//                   key={t._id}
//                   className={`border-l-4 ${getRandomBorderColor(
//                     index
//                   )} bg-white rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg hover:translate-y-[-2px] relative`}
//                 >
//                   {/* Premijum dugme - istaknuto u donjem desnom uglu */}
//                   <button
//                     onClick={() => handlePayPremium(t._id)}
//                     className="absolute bottom-4 right-4 bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg flex items-center justify-center transition-colors duration-300 shadow-lg hover:shadow-xl font-bold text-lg"
//                     title="Plati premijum"
//                   >
//                     <FaCrown className="mr-2" />
//                     Premijum
//                   </button>

//                   <div className="flex flex-col md:flex-row md:items-start justify-between">
//                     <div className="mb-4 md:mb-0 flex-1">
//                       <h3 className="text-lg font-semibold text-gray-800 mb-4">
//                         {t.startLocation} → {t.endLocation}
//                       </h3>

//                       <div className="space-y-2 text-gray-700">
//                         <div className="flex items-center gap-2">
//                           <span className="font-medium">Datum:</span>
//                           <span className="bg-blue-100 text-blue-700 font-semibold px-3 py-1 rounded-full">
//                             {format(new Date(t.date), "d. MMMM yyyy", {
//                               locale: srLatin,
//                             })}
//                           </span>
//                         </div>

//                         {t.vehicle && (
//                           <>
//                             <div>
//                               <span className="font-medium">Vozilo:</span>{" "}
//                               {t.vehicle.type} ({t.vehicle.licensePlate})
//                             </div>
//                             <div>
//                               <span className="font-medium">Kapacitet:</span>{" "}
//                               {t.vehicle.capacity} kg
//                             </div>
//                           </>
//                         )}

//                         {t.note && (
//                           <div>
//                             <span className="font-medium">Napomena:</span>{" "}
//                             {t.note}
//                           </div>
//                         )}
//                       </div>
//                     </div>

//                     <div className="flex gap-2">
//                       <Link
//                         to={`/my-tours/${t._id}`}
//                         className="bg-blue-100 hover:bg-blue-200 text-blue-600 p-2 rounded-lg flex items-center justify-center transition-colors duration-300"
//                         title="Izmeni turu"
//                       >
//                         <FaEdit className="text-lg" />
//                       </Link>

//                       <button
//                         onClick={() => handleDelete(t._id)}
//                         className="bg-red-100 hover:bg-red-200 text-red-600 p-2 rounded-lg flex items-center justify-center transition-colors duration-300"
//                         title="Obriši turu"
//                       >
//                         <FaTrash className="text-lg" />
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useGlobalState } from "../helper/globalState";
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
} from "react-icons/fa";

registerLocale("sr-latin", srLatin);

export default function MyTours() {
  const [token] = useGlobalState("token");
  const [tours, setTours] = useState([]);
  const [allMyTours, setAllMyTours] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter state
  const [filterDate, setFilterDate] = useState(null);
  const [vehicleType, setVehicleType] = useState("");
  const [startLocation, setStartLocation] = useState("");

  const fetchTours = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterDate) params.append("date", filterDate.toISOString());
      if (vehicleType) params.append("vehicleType", vehicleType);
      if (startLocation) params.append("startLocation", startLocation);

      const res = await axios.get(`/api/tours/my-tours?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Moje ture:", res.data);

      setTours(Array.isArray(res.data) ? res.data : []);
      if (!filterDate && !vehicleType && !startLocation) {
        setAllMyTours(res.data);
      }
    } catch (err) {
      console.error("Greška pri učitavanju tura:", err);
      setTours([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!token) {
      alert("Morate biti ulogovani da biste obrisali turu.");
      return;
    }
    if (window.confirm("Da li ste sigurni da želite da obrišete turu?")) {
      try {
        await axios.delete(`/api/tours/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Tura obrisana");
        fetchTours();
      } catch (err) {
        console.log(err);
        alert("Greška prilikom brisanja ture");
      }
    }
  };

  const handlePayPremium = async (tourId) => {
    try {
      const res = await axios.post(
        "/api/payments/initiate",
        { tourId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = res.data;
      console.log(
        `Uplatite ${data.amount} RSD na račun ${data.accountNumber}, poziv na broj: ${data.referenceNumber}`
      );
      alert(
        `Uplatite ${data.amount} RSD na račun ${data.accountNumber}, poziv na broj: ${data.referenceNumber}`
      );
    } catch (err) {
      console.error(err);
      alert("Greška pri generisanju uplate");
    }
  };

  useEffect(() => {
    fetchTours();
  }, [filterDate, vehicleType, startLocation]);

  const handleResetFilters = () => {
    setFilterDate(null);
    setVehicleType("");
    setStartLocation("");
  };

  const uniqueVehicleTypes = [
    ...new Set(allMyTours.map((t) => t.vehicle?.type).filter(Boolean)),
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
                Moje Ture
              </h1>
              <p className="text-gray-600 mt-2">
                Upravljajte svojim turama i njihovim detaljima
              </p>
            </div>
            <div className="flex items-center mt-4 md:mt-0">
              <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full mr-3">
                {tours.length} tura
              </span>
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
                onChange={setFilterDate}
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
                onChange={(e) => setVehicleType(e.target.value)}
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

            {/* Lokacija filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <FaMapMarkerAlt className="text-red-500 mr-2" />
                Početna lokacija
              </label>
              <input
                type="text"
                value={startLocation}
                onChange={(e) => setStartLocation(e.target.value)}
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

        {/* Lista tura */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className="text-gray-600 mt-4">Učitavanje tura...</p>
            </div>
          ) : tours.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-600 text-lg">
                {filterDate || vehicleType || startLocation
                  ? "Nema tura za prikaz sa odabranim filterima"
                  : "Trenutno nema dostupnih tura."}
              </p>
            </div>
          ) : (
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tours.map((tour, index) => (
                <div
                  key={tour._id}
                  className={`relative border-l-4 ${getRandomBorderColor(
                    index
                  )} rounded-xl shadow-md p-5 flex flex-col justify-between transition-all duration-300 hover:shadow-lg hover:translate-y-[-2px] bg-white`}
                  style={{ minHeight: "260px" }}
                >
                  {/* Premium badge */}
                  {tour.isPremium && (
                    <div className="absolute top-3 right-3 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center">
                      <FaCrown className="mr-1" />
                      PREMIUM
                    </div>
                  )}

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
                        {tour.vehicle.type} - {tour.vehicle.capacity} kg
                      </div>
                    )}

                    {/* Kontakt */}
                    {tour.contactPerson && tour.contactPhone && (
                      <div className="flex items-center gap-2">
                        <span>
                          <span className="font-medium">Kontakt:</span>{" "}
                          {tour.contactPerson} ({tour.contactPhone})
                        </span>
                        <a
                          href={`tel:${tour.contactPhone}`}
                          className="ml-auto bg-green-500 hover:bg-green-600 text-white text-xs px-3 py-1 rounded-lg flex items-center"
                        >
                          <FaPhoneAlt className="mr-1" />
                          Pozovi
                        </a>
                      </div>
                    )}

                    {/* Napomena */}
                    {tour.note && (
                      <div className="text-gray-600 italic">{tour.note}</div>
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
                      className="flex-1 bg-red-100 hover:bg-red-200 text-red-600 px-3 py-2 rounded-lg transition-colors flex items-center justify-center text-sm font-medium"
                    >
                      <FaTrash className="mr-1" />
                      Obriši
                    </button>

                    {!tour.isPremium && (
                      <button
                        onClick={() => handlePayPremium(tour._id)}
                        className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded-lg transition-colors flex items-center justify-center text-sm font-medium"
                        title="Plati premijum"
                      >
                        <FaCrown className="mr-1" />
                        Premijum
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
