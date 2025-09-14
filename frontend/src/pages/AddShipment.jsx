// import React, { useState, useRef } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import DatePicker, { registerLocale } from "react-datepicker";
// import { format } from "date-fns";
// import srLatin from "../helper/sr-latin";
// import "react-datepicker/dist/react-datepicker.css";
// import { useGlobalState } from "../helper/globalState";
// import LocationAutocomplete from "../components/LocationAutocomplete";

// registerLocale("sr-latin", srLatin);

// export default function AddShipment() {
//   const navigate = useNavigate();
//   const [token] = useGlobalState("token");
//   const [form, setForm] = useState({
//     pickupLocation: "",
//     dropoffLocation: "",
//     date: new Date(),
//     weightKg: "",
//     pallets: null,
//     dimensions: { length: "", width: "", height: "" },
//     goodsType: "",
//     note: "",
//     contactPhone: "",
//   });
//   const [loading, setLoading] = useState(false);
//   const [startCoords, setStartCoords] = useState("");
//   const [endCoords, setEndCoords] = useState("");
//   const mapRef = useRef(null);
//   const polyRef = useRef(null);

//   function handleChange(e) {
//     const { name, value } = e.target;
//     if (["length", "width", "height"].includes(name)) {
//       setForm((f) => ({
//         ...f,
//         dimensions: { ...f.dimensions, [name]: value },
//       }));
//     } else {
//       setForm((f) => ({ ...f, [name]: value }));
//     }
//   }

//   function handleDate(d) {
//     setForm((f) => ({ ...f, date: d }));
//   }

//   async function handleSubmit(e) {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       // formatiraj datum za API kao yyyy-MM-dd (lokalni datum)
//       const dateStr = format(form.date, "yyyy-MM-dd");

//       const routeRes = await axios.get(
//         `http://localhost:4000/api/route?start=${startCoords}&end=${endCoords}`
//       );
//       console.log("ruta", routeRes.data);
//       const distanceData = await routeRes.data;

//       // draw geometry on map
//       const coords = distanceData.geometry.coordinates.map((c) => [c[1], c[0]]);
//       //   if (polyRef.current) mapRef.current.removeLayer(polyRef.current);
//       //   polyRef.current = L.polyline(coords).addTo(mapRef.current);
//       //   mapRef.current.fitBounds(polyRef.current.getBounds());

//       const km = (distanceData.distanceMeters / 1000).toFixed(2);
//       const mins = Math.round(distanceData.durationSec / 60);
//       const { distanceMeters, durationSec } = distanceData;

//       console.log("km", km);
//       console.log("mins", mins);

//       const payload = {
//         pickupLocation: form.pickupLocation,
//         dropoffLocation: form.dropoffLocation,
//         date: dateStr,
//         weightKg: Number(form.weightKg),
//         pallets: Number(form.pallets),
//         dimensions: {
//           length: form.dimensions.length
//             ? Number(form.dimensions.length)
//             : undefined,
//           width: form.dimensions.width
//             ? Number(form.dimensions.width)
//             : undefined,
//           height: form.dimensions.height
//             ? Number(form.dimensions.height)
//             : undefined,
//         },
//         goodsType: form.goodsType,
//         note: form.note,
//         contactPhone: form.contactPhone,
//         distanceMeters,
//         durationSec,
//       };

//       console.log(payload);

//       await axios.post("/api/shipments", payload, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       alert("Zahtev poslat.");
//       setForm({
//         pickupLocation: "",
//         dropoffLocation: "",
//         date: new Date(),
//         weightKg: "",
//         pallets: 0,
//         dimensions: { length: "", width: "", height: "" },
//         goodsType: "",
//         note: "",
//         contactPhone: "",
//       });
//       setTimeout(() => {
//         navigate("/my-shipments");
//       }, 1000);
//     } catch (err) {
//       console.error(err);
//       alert(err.response?.data?.error || "Greška pri slanju zahteva");
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <div className="max-w-xl mx-auto p-4 bg-white rounded shadow">
//       <h1 className="text-2xl mb-4">Dodaj zahtev za prevoz</h1>
//       <form onSubmit={handleSubmit} className="space-y-3">
//         <div>
//           <label className="block mb-1">Datum transporta</label>
//           <DatePicker
//             selected={form.date}
//             onChange={handleDate}
//             locale="sr-latin"
//             dateFormat="d. MMMM yyyy"
//             className="border p-2 w-full focus-visible:outline-none focus-visible:ring-0"
//             required
//           />
//         </div>
//         <LocationAutocomplete
//           label="Početna destinacija"
//           value={form.pickupLocation}
//           onSelect={(val) => {
//             console.log("Start lokacija:", val); // Dodato za debagovanje
//             setStartCoords(`${val.lng},${val.lat}`);
//             setForm((prev) => ({
//               ...prev,
//               pickupLocation: val.address,
//             }));
//           }}
//         />
//         <LocationAutocomplete
//           label="Krajnja destinacija"
//           value={form.dropoffLocation}
//           onSelect={(val) => {
//             console.log("Krajnja destinacija:", val); // Dodato za debagovanje
//             setEndCoords(`${val.lng},${val.lat}`);
//             setForm((prev) => ({
//               ...prev,
//               dropoffLocation: val.address,
//             }));
//           }}
//         />

//         <input
//           name="weightKg"
//           value={form.weightKg}
//           onChange={handleChange}
//           type="number"
//           placeholder="Težina (t)"
//           required
//           className="border p-2 w-full focus-visible:outline-none focus-visible:ring-0"
//         />

//         <input
//           name="pallets"
//           value={form.pallets}
//           onChange={handleChange}
//           type="number"
//           placeholder="Broj paletnih mesta"
//           className="border p-2 w-full focus-visible:outline-none focus-visible:ring-0"
//         />

//         <div className="grid grid-cols-3 gap-2">
//           <input
//             name="length"
//             value={form.dimensions.length}
//             onChange={handleChange}
//             placeholder="Dužina (cm)"
//             className="border p-2 focus-visible:outline-none focus-visible:ring-0"
//           />
//           <input
//             name="width"
//             value={form.dimensions.width}
//             onChange={handleChange}
//             placeholder="Širina (cm)"
//             className="border p-2 focus-visible:outline-none focus-visible:ring-0"
//           />
//           <input
//             name="height"
//             value={form.dimensions.height}
//             onChange={handleChange}
//             placeholder="Visina (cm)"
//             className="border p-2 focus-visible:outline-none focus-visible:ring-0"
//           />
//         </div>

//         <input
//           name="goodsType"
//           value={form.goodsType}
//           onChange={handleChange}
//           placeholder="Vrsta robe (opciono)"
//           className="border p-2 w-full focus-visible:outline-none focus-visible:ring-0"
//         />
//         <input
//           name="contactPhone"
//           value={form.contactPhone}
//           onChange={handleChange}
//           placeholder="Kontakt telefon (opciono)"
//           className="border p-2 w-full focus-visible:outline-none focus-visible:ring-0"
//         />

//         <textarea
//           name="note"
//           value={form.note}
//           onChange={handleChange}
//           placeholder="Napomena"
//           className="border p-2 w-full focus-visible:outline-none focus-visible:ring-0"
//           rows={3}
//         />
//         {/* <pre className="mt-4 bg-gray-100 p-2 rounded">
//           {JSON.stringify(form, null, 2)}
//         </pre> */}

//         <button
//           className="bg-blue-600 text-white px-4 py-2 rounded"
//           disabled={loading}
//         >
//           {loading ? "Šaljem..." : "Pošalji zahtev"}
//         </button>
//       </form>
//     </div>
//   );
// }
import React, { useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DatePicker, { registerLocale } from "react-datepicker";
import { format } from "date-fns";
import srLatin from "../helper/sr-latin";
import "react-datepicker/dist/react-datepicker.css";
import { useGlobalState } from "../helper/globalState";
import LocationAutocomplete from "../components/LocationAutocomplete";
import {
  FaPlus,
  FaCalendarAlt,
  FaWeightHanging,
  FaPallet,
  FaRulerCombined,
  FaBox,
  FaPhone,
  FaStickyNote,
  FaMapMarkerAlt,
  FaRoad,
  FaClock,
} from "react-icons/fa";

registerLocale("sr-latin", srLatin);

export default function AddShipment() {
  const navigate = useNavigate();
  const [token] = useGlobalState("token");
  const [form, setForm] = useState({
    pickupLocation: "",
    dropoffLocation: "",
    date: new Date(),
    weightKg: "",
    pallets: "",
    dimensions: { length: "", width: "", height: "" },
    goodsType: "",
    note: "",
    contactPhone: "",
  });
  const [loading, setLoading] = useState(false);
  const [startCoords, setStartCoords] = useState("");
  const [endCoords, setEndCoords] = useState("");
  const [distanceInfo, setDistanceInfo] = useState(null);
  const mapRef = useRef(null);
  const polyRef = useRef(null);

  function handleChange(e) {
    const { name, value } = e.target;
    if (["length", "width", "height"].includes(name)) {
      setForm((f) => ({
        ...f,
        dimensions: { ...f.dimensions, [name]: value },
      }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  }

  function handleDateChange(date) {
    setForm((f) => ({ ...f, date: date }));
  }

  // Funkcija za izračunavanje rute kada se promene lokacije
  const calculateRoute = async () => {
    if (!form.pickupLocation || !form.dropoffLocation) return;

    try {
      const pickupGeo = await axios.get(
        `/api/geocode?query=${encodeURIComponent(form.pickupLocation)}`
      );
      const dropoffGeo = await axios.get(
        `/api/geocode?query=${encodeURIComponent(form.dropoffLocation)}`
      );

      const startCoordsEx = `${pickupGeo.data.lon},${pickupGeo.data.lat}`;
      const endCoordsEx = `${dropoffGeo.data.lon},${dropoffGeo.data.lat}`;

      const routeRes = await axios.get(
        `http://localhost:4000/api/route?start=${startCoordsEx}&end=${endCoordsEx}`
      );

      const distanceData = await routeRes.data;
      setDistanceInfo({
        distance: (distanceData.distanceMeters / 1000).toFixed(1),
        duration: Math.round(distanceData.durationSec / 60),
      });

      setStartCoords(startCoordsEx);
      setEndCoords(endCoordsEx);
    } catch (err) {
      console.error("Greška pri izračunavanju rute:", err);
      setDistanceInfo(null);
    }
  };

  // Pozovi izračunavanje rute kada se promene lokacije
  React.useEffect(() => {
    calculateRoute();
  }, [form.pickupLocation, form.dropoffLocation]);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      // formatiraj datum za API kao yyyy-MM-dd (lokalni datum)
      const dateStr = format(form.date, "yyyy-MM-dd");

      const payload = {
        pickupLocation: form.pickupLocation,
        dropoffLocation: form.dropoffLocation,
        date: dateStr,
        weightKg: Number(form.weightKg),
        pallets: Number(form.pallets) || 0,
        dimensions: {
          length: form.dimensions.length
            ? Number(form.dimensions.length)
            : undefined,
          width: form.dimensions.width
            ? Number(form.dimensions.width)
            : undefined,
          height: form.dimensions.height
            ? Number(form.dimensions.height)
            : undefined,
        },
        goodsType: form.goodsType,
        note: form.note,
        contactPhone: form.contactPhone,
        distanceMeters: distanceInfo ? distanceInfo.distance * 1000 : 0,
        durationSec: distanceInfo ? distanceInfo.duration * 60 : 0,
      };

      await axios.post("/api/shipments", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Zahtev uspešno poslat!");

      // Resetuj formu
      setForm({
        pickupLocation: "",
        dropoffLocation: "",
        date: new Date(),
        weightKg: "",
        pallets: "",
        dimensions: { length: "", width: "", height: "" },
        goodsType: "",
        note: "",
        contactPhone: "",
      });
      setDistanceInfo(null);

      setTimeout(() => {
        navigate("/my-shipments");
      }, 1000);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Greška pri slanju zahteva");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
            Dodaj Novi Zahtev za Prevoz
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Datum transporta */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <FaCalendarAlt className="text-blue-500 mr-2" />
                Datum transporta
              </label>
              <DatePicker
                selected={form.date}
                onChange={handleDateChange}
                locale="sr-latin"
                dateFormat="d. MMMM yyyy"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Lokacije */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <FaMapMarkerAlt className="text-red-500 mr-2" />
                  Početna destinacija
                </label>
                <LocationAutocomplete
                  value={form.pickupLocation}
                  onSelect={(val) => {
                    setForm((prev) => ({
                      ...prev,
                      pickupLocation: val.address,
                    }));
                  }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <FaMapMarkerAlt className="text-green-500 mr-2" />
                  Krajnja destinacija
                </label>
                <LocationAutocomplete
                  value={form.dropoffLocation}
                  onSelect={(val) => {
                    setForm((prev) => ({
                      ...prev,
                      dropoffLocation: val.address,
                    }));
                  }}
                />
              </div>
            </div>

            {/* Informacije o ruti */}
            {distanceInfo && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-blue-800 mb-2 flex items-center">
                  <FaRoad className="mr-2" />
                  Informacije o ruti
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center">
                    <FaRoad className="text-green-500 mr-2" />
                    Udaljenost: {distanceInfo.distance} km
                  </div>
                  <div className="flex items-center">
                    <FaClock className="text-purple-500 mr-2" />
                    Vreme: {distanceInfo.duration} min
                  </div>
                </div>
              </div>
            )}

            {/* Težina i palete */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <FaWeightHanging className="text-green-500 mr-2" />
                  Težina (kg)
                </label>
                <input
                  name="weightKg"
                  value={form.weightKg}
                  onChange={handleChange}
                  type="number"
                  placeholder="Težina u kg"
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <FaPallet className="text-purple-500 mr-2" />
                  Broj paleta
                </label>
                <input
                  name="pallets"
                  value={form.pallets}
                  onChange={handleChange}
                  type="number"
                  placeholder="Broj paleta"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Dimenzije */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <FaRulerCombined className="text-indigo-500 mr-2" />
                Dimenzije (cm)
              </label>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <input
                    name="length"
                    value={form.dimensions.length}
                    onChange={handleChange}
                    placeholder="Dužina"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <input
                    name="width"
                    value={form.dimensions.width}
                    onChange={handleChange}
                    placeholder="Širina"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <input
                    name="height"
                    value={form.dimensions.height}
                    onChange={handleChange}
                    placeholder="Visina"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Vrsta robe i kontakt telefon */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <FaBox className="text-yellow-500 mr-2" />
                  Vrsta robe
                </label>
                <input
                  name="goodsType"
                  value={form.goodsType}
                  onChange={handleChange}
                  placeholder="Vrsta robe"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <FaPhone className="text-green-500 mr-2" />
                  Kontakt telefon
                </label>
                <input
                  name="contactPhone"
                  value={form.contactPhone}
                  onChange={handleChange}
                  placeholder="Kontakt telefon"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Napomena */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <FaStickyNote className="text-blue-500 mr-2" />
                Napomena
              </label>
              <textarea
                name="note"
                value={form.note}
                onChange={handleChange}
                placeholder="Dodatne napomene o transportu"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
            </div>

            {/* Dugme za submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                "Slanje..."
              ) : (
                <>
                  <FaPlus className="mr-2" />
                  Pošalji Zahtev
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
