// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useGlobalState } from "../helper/globalState";
// import { useNavigate } from "react-router-dom";

// import LocationAutocomplete from "../components/LocationAutocomplete";
// import DatePicker, { registerLocale } from "react-datepicker";
// import srLatin from "../helper/sr-latin";
// import "react-datepicker/dist/react-datepicker.css";

// registerLocale("sr-latin", srLatin);

// export default function AddTour() {
//   const navigate = useNavigate();
//   const [token] = useGlobalState("token");
//   const [vehicles, setVehicles] = useState([]);
//   const [formData, setFormData] = useState({
//     date: new Date(),
//     vehicle: "",
//     contactPerson: "",
//     contactPhone: "",
//     startLocation: "",
//     startLocationLat: null,
//     startLocationLng: null,
//     endLocation: "",
//     endLocationLat: null,
//     endLocationLng: null,
//     note: "",
//   });
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const fetchVehicles = async () => {
//       try {
//         const res = await axios.get("/api/vehicles", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setVehicles(Array.isArray(res.data) ? res.data : []);
//       } catch (err) {
//         console.error("Greška pri učitavanju vozila:", err);
//         setVehicles([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchVehicles();
//   }, [token]);

//   function handleChange(e) {
//     const { name, value, type, checked } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   }

//   // handleChange za datum iz datepicker-a
//   function handleDateChange(date) {
//     setFormData((prev) => ({
//       ...prev,
//       date: date,
//     }));
//   }

//   async function handleSubmit(e) {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const postData = {
//         ...formData,
//       };

//       // ako imamo koordinate, pošalji i GeoJSON
//       if (
//         formData.startLocationLat != null &&
//         formData.startLocationLng != null
//       ) {
//         postData.startPoint = {
//           type: "Point",
//           coordinates: [formData.startLocationLng, formData.startLocationLat],
//         };
//       }
//       if (formData.endLocationLat != null && formData.endLocationLng != null) {
//         postData.endPoint = {
//           type: "Point",
//           coordinates: [formData.endLocationLng, formData.endLocationLat],
//         };
//       }
//       console.log("📤 Sending tour data:", postData);

//       const res = await axios.post("/api/tours", postData, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (res.data) {
//         console.log(res.data);
//       }

//       alert("Tura uspešno dodata");
//       setFormData({
//         date: new Date(),
//         vehicle: "",
//         contactPerson: "",
//         contactPhone: "",
//         startLocation: "",
//         startLocationLat: null,
//         startLocationLng: null,
//         endLocation: "",
//         endLocationLat: null,
//         endLocationLng: null,
//         note: "",
//       });
//       setTimeout(() => navigate("/my-tours"), 800);
//     } catch (err) {
//       console.error(err);
//       alert(err.response?.data?.error || "Greška prilikom dodavanja ture");
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <div className="max-w-lg mx-auto p-4 bg-white rounded shadow">
//       <h1 className="text-2xl mb-4">Dodaj turu</h1>
//       <form onSubmit={handleSubmit} className="space-y-3">
//         <label>
//           Datum ture:
//           <DatePicker
//             selected={formData.date}
//             onChange={handleDateChange}
//             locale="sr-latin"
//             dateFormat="d. MMMM yyyy" // npr. 9. avgust 2025
//             placeholderText="Izaberite datum"
//             className="border p-2 w-full"
//             required
//           />
//         </label>
//         <label className="block">
//           Kontakt osoba:
//           <input
//             type="text"
//             name="contactPerson"
//             value={formData.contactPerson}
//             onChange={handleChange}
//             className="border p-2 w-full"
//             placeholder="Ime i prezime"
//             required
//           />
//         </label>

//         <label className="block">
//           Kontakt telefon:
//           <input
//             type="tel"
//             name="contactPhone"
//             value={formData.contactPhone}
//             onChange={handleChange}
//             className="border p-2 w-full"
//             placeholder="+381 6x xxx xxxx"
//             required
//           />
//         </label>

//         <label>
//           Izaberi vozilo:
//           <select
//             name="vehicle"
//             value={formData.vehicle}
//             onChange={handleChange}
//             required
//             className="border p-2 w-full"
//           >
//             <option value="">-- Izaberi vozilo --</option>
//             {vehicles.map((v) => (
//               <option key={v._id} value={v._id}>
//                 {v.type} - {v.licensePlate} ({v.capacity} kg)
//               </option>
//             ))}
//           </select>
//         </label>

//         <div className="p-4">
//           <LocationAutocomplete
//             label="Početna destinacija"
//             value={formData.startLocation}
//             onSelect={(val) => {
//               console.log("Start lokacija:", val); // Dodato za debagovanje
//               setFormData((prev) => ({
//                 ...prev,
//                 startLocation: val.address,
//                 startLocationLat: val.lat,
//                 startLocationLng: val.lng,
//               }));
//             }}
//           />

//           <LocationAutocomplete
//             label="Krajnja destinacija"
//             value={formData.endLocation}
//             onSelect={(val) => {
//               console.log("Krajnja lokacija:", val); // Dodato za debagovanje
//               setFormData((prev) => ({
//                 ...prev,
//                 endLocation: val.address,
//                 endLocationLat: val.lat,
//                 endLocationLng: val.lng,
//               }));
//             }}
//           />
//         </div>

//         <label>
//           Napomena:
//           <textarea
//             name="note"
//             value={formData.note}
//             onChange={handleChange}
//             className="border p-2 w-full"
//             placeholder="Unesite dodatne informacije"
//           />
//         </label>

//         {/* <pre className="mt-4 bg-gray-100 p-2 rounded">
//           {JSON.stringify(formData, null, 2)}
//         </pre> */}
//         <button
//           type="submit"
//           disabled={loading}
//           className="bg-blue-600 text-white py-2 px-4 rounded"
//         >
//           {loading ? "Dodavanje..." : "Dodaj turu"}
//         </button>
//       </form>
//     </div>
//   );
// }
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useGlobalState } from "../helper/globalState";
import { useNavigate } from "react-router-dom";
import {
  FaPlus,
  FaCalendarAlt,
  FaUser,
  FaPhone,
  FaTruck,
  FaMapMarkerAlt,
  FaStickyNote,
} from "react-icons/fa";

import LocationAutocomplete from "../components/LocationAutocomplete";
import DatePicker, { registerLocale } from "react-datepicker";
import srLatin from "../helper/sr-latin";
import "react-datepicker/dist/react-datepicker.css";

registerLocale("sr-latin", srLatin);

export default function AddTour() {
  const navigate = useNavigate();
  const [token] = useGlobalState("token");
  const [vehicles, setVehicles] = useState([]);
  const [formData, setFormData] = useState({
    date: new Date(),
    vehicle: "",
    contactPerson: "",
    contactPhone: "",
    startLocation: "",
    startLocationLat: null,
    startLocationLng: null,
    endLocation: "",
    endLocationLat: null,
    endLocationLng: null,
    note: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const res = await axios.get("/api/vehicles", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setVehicles(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Greška pri učitavanju vozila:", err);
        setVehicles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, [token]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleDateChange(date) {
    setFormData((prev) => ({
      ...prev,
      date: date,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const postData = {
        ...formData,
      };

      if (
        formData.startLocationLat != null &&
        formData.startLocationLng != null
      ) {
        postData.startPoint = {
          type: "Point",
          coordinates: [formData.startLocationLng, formData.startLocationLat],
        };
      }
      if (formData.endLocationLat != null && formData.endLocationLng != null) {
        postData.endPoint = {
          type: "Point",
          coordinates: [formData.endLocationLng, formData.endLocationLat],
        };
      }
      console.log("📤 Sending tour data:", postData);

      const res = await axios.post("/api/tours", postData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data) {
        console.log(res.data);
      }

      alert("Tura uspešno dodata");
      setFormData({
        date: new Date(),
        vehicle: "",
        contactPerson: "",
        contactPhone: "",
        startLocation: "",
        startLocationLat: null,
        startLocationLng: null,
        endLocation: "",
        endLocationLat: null,
        endLocationLng: null,
        note: "",
      });
      setTimeout(() => navigate("/my-tours"), 800);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Greška prilikom dodavanja ture");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
            Dodaj novu turu
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Datum ture */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center">
                  <FaCalendarAlt className="mr-2 text-blue-500" />
                  Datum ture
                </div>
              </label>
              <DatePicker
                selected={formData.date}
                onChange={handleDateChange}
                locale="sr-latin"
                dateFormat="d. MMMM yyyy"
                placeholderText="Izaberite datum"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
                required
              />
            </div>

            {/* Kontakt osoba i telefon u gridu */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center">
                    <FaUser className="mr-2 text-blue-500" />
                    Kontakt osoba
                  </div>
                </label>
                <input
                  type="text"
                  name="contactPerson"
                  value={formData.contactPerson}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
                  placeholder="Ime i prezime"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center">
                    <FaPhone className="mr-2 text-blue-500" />
                    Kontakt telefon
                  </div>
                </label>
                <input
                  type="tel"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
                  placeholder="+381 6x xxx xxxx"
                  required
                />
              </div>
            </div>

            {/* Vozilo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center">
                  <FaTruck className="mr-2 text-blue-500" />
                  Izaberi vozilo
                </div>
              </label>
              <select
                name="vehicle"
                value={formData.vehicle}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
              >
                <option value="">-- Izaberi vozilo --</option>
                {vehicles.map((v) => (
                  <option key={v._id} value={v._id}>
                    {v.type} - {v.licensePlate} ({v.capacity} kg)
                  </option>
                ))}
              </select>
            </div>

            {/* Lokacije */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center">
                    <FaMapMarkerAlt className="mr-2 text-red-500" />
                    Početna destinacija
                  </div>
                </label>
                <LocationAutocomplete
                  value={formData.startLocation}
                  onSelect={(val) => {
                    setFormData((prev) => ({
                      ...prev,
                      startLocation: val.address,
                      startLocationLat: val.lat,
                      startLocationLng: val.lng,
                    }));
                  }}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center">
                    <FaMapMarkerAlt className="mr-2 text-green-500" />
                    Krajnja destinacija
                  </div>
                </label>
                <LocationAutocomplete
                  value={formData.endLocation}
                  onSelect={(val) => {
                    setFormData((prev) => ({
                      ...prev,
                      endLocation: val.address,
                      endLocationLat: val.lat,
                      endLocationLng: val.lng,
                    }));
                  }}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
                />
              </div>
            </div>

            {/* Napomena */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center">
                  <FaStickyNote className="mr-2 text-blue-500" />
                  Napomena
                </div>
              </label>
              <textarea
                name="note"
                value={formData.note}
                onChange={handleChange}
                rows="3"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
                placeholder="Unesite dodatne informacije o turi"
              />
            </div>

            {/* Dugme za submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center justify-center transition-colors duration-300 disabled:opacity-50"
            >
              {loading ? (
                <>Dodavanje...</>
              ) : (
                <>
                  <FaPlus className="mr-2" />
                  Dodaj Turu
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
