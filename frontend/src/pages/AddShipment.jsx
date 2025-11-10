import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DatePicker, { registerLocale } from "react-datepicker";
import { format } from "date-fns";
import srLatin from "../helper/sr-latin";
import "react-datepicker/dist/react-datepicker.css";
import { useGlobalState } from "../helper/globalState";
import { useToast } from "../components/ToastContext";
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
  FaArrowLeft,
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
    isPremium: false,
  });
  const [loading, setLoading] = useState(false);
  const { success, error, warning, info } = useToast();
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

      console.log("startCoordsEx", startCoordsEx);
      console.log("form.pickupLocation", form.pickupLocation);

      console.log("endCoordsEx", endCoordsEx);
      console.log("form.dropoffLocation", form.dropoffLocation);

      const routeRes = await axios.get(
        `http://localhost:4000/api/route?start=${startCoordsEx}&end=${endCoordsEx}`
      );

      const distanceData = await routeRes.data;
      console.log("distanceData", distanceData);
      setDistanceInfo({
        distance: (distanceData.distanceMeters / 1000).toFixed(1),
        duration: Math.round((distanceData.distanceMeters / 1000 / 75) * 60),
      });

      setStartCoords(startCoordsEx);
      setEndCoords(endCoordsEx);
    } catch (err) {
      console.error("Greška pri izračunavanju rute:", err);
      setDistanceInfo(null);
    }
  };

  // Pozovi izračunavanje rute kada se promene lokacije
  useEffect(() => {
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
        isPremium: form.isPremium,
        distanceMeters: distanceInfo ? distanceInfo.distance * 1000 : 0,
        durationSec: distanceInfo ? distanceInfo.duration * 60 : 0,
      };

      await axios.post("/api/shipments", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      success("Zahtev uspešno poslat!");

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
        isPremium: false,
      });
      setDistanceInfo(null);

      setTimeout(() => {
        navigate("/my-shipments");
      }, 1000);
    } catch (err) {
      console.error(err, err.response?.data?.error);
      error("Greška pri slanju zahteva");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-mainDarkBG py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-cardBGText rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-200 mb-6">
            Dodaj Novi Zahtev za Prevoz
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Datum transporta */}
            <div>
              <label className="dark:text-white text-sm font-medium text-gray-700 mb-2 flex items-center">
                <FaCalendarAlt className="text-blue-500 mr-2" />
                Datum transporta
              </label>
              <DatePicker
                selected={form.date}
                onChange={handleDateChange}
                locale="sr-latin"
                dateFormat="d. MMMM yyyy"
                className="dark:text-white dark:bg-mainDarkBG w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Lokacije */}
            <div className="space-y-4">
              <div>
                <label className="dark:text-white text-sm font-medium text-gray-700 mb-2 flex items-center">
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
                <label className="dark:text-white text-sm font-medium text-gray-700 mb-2 flex items-center">
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
            {/* {distanceInfo && (
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
            )} */}
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
                    {(() => {
                      const totalMinutes = distanceInfo.duration;
                      const hours = Math.floor(totalMinutes / 60);
                      const minutes = Math.round(totalMinutes % 60);
                      return (
                        <>
                          Vreme:{" "}
                          {hours > 0
                            ? `${hours}h ${minutes}min`
                            : `${minutes}min`}
                        </>
                      );
                    })()}
                  </div>
                </div>
              </div>
            )}

            {/* Težina i palete */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="dark:text-white text-sm font-medium text-gray-700 mb-2 flex items-center">
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
                  className="dark:text-white dark:bg-mainDarkBG w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="dark:text-white text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <FaPallet className="text-purple-500 mr-2" />
                  Broj paleta
                </label>
                <input
                  name="pallets"
                  value={form.pallets}
                  onChange={handleChange}
                  type="number"
                  placeholder="Broj paleta"
                  className="dark:text-white dark:bg-mainDarkBG w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Dimenzije */}
            <div>
              <label className="dark:text-white text-sm font-medium text-gray-700 mb-2 flex items-center">
                <FaRulerCombined className="text-indigo-500 mr-2" />
                Dimenzije (m)
              </label>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <input
                    name="length"
                    value={form.dimensions.length}
                    onChange={handleChange}
                    placeholder="Dužina"
                    className="dark:text-white dark:bg-mainDarkBG w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <input
                    name="width"
                    value={form.dimensions.width}
                    onChange={handleChange}
                    placeholder="Širina"
                    className="dark:text-white dark:bg-mainDarkBG w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <input
                    name="height"
                    value={form.dimensions.height}
                    onChange={handleChange}
                    placeholder="Visina"
                    className="dark:text-white dark:bg-mainDarkBG w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Vrsta robe i kontakt telefon */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="dark:text-white text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <FaBox className="text-yellow-500 mr-2" />
                  Vrsta robe
                </label>
                <input
                  name="goodsType"
                  value={form.goodsType}
                  onChange={handleChange}
                  placeholder="Vrsta robe"
                  className="dark:text-white dark:bg-mainDarkBG w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="dark:text-white text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <FaPhone className="text-green-500 mr-2" />
                  Kontakt telefon
                </label>
                <input
                  name="contactPhone"
                  value={form.contactPhone}
                  onChange={handleChange}
                  placeholder="Kontakt telefon"
                  className="dark:text-white dark:bg-mainDarkBG w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Napomena */}
            <div>
              <label className="dark:text-white text-sm font-medium text-gray-700 mb-2 flex items-center">
                <FaStickyNote className="text-blue-500 mr-2" />
                Napomena
              </label>
              <textarea
                name="note"
                value={form.note}
                onChange={handleChange}
                placeholder="Dodatne napomene o transportu"
                className="dark:text-white dark:bg-mainDarkBG w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
            </div>

            <div className="flex justify-between gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-3 rounded-lg flex items-center justify-center transition-colors duration-300 w-full"
              >
                <FaArrowLeft className="mr-2" />
                Odustani
              </button>

              <button
                type="submit"
                disabled={loading}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center justify-center disabled:opacity-50 transition-colors duration-300 w-full"
              >
                {loading ? (
                  <>Dodavanje...</>
                ) : (
                  <>
                    <FaPlus className="mr-2" />
                    Pošalji Zahtev
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
