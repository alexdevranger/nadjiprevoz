import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useGlobalState } from "../helper/globalState";
import LocationAutocomplete from "../components/LocationAutocomplete";
import DatePicker, { registerLocale } from "react-datepicker";
import { useToast } from "../components/ToastContext";
import { format } from "date-fns";
import srLatin from "../helper/sr-latin";
import "react-datepicker/dist/react-datepicker.css";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaWeightHanging,
  FaPallet,
  FaRulerCombined,
  FaBox,
  FaPhone,
  FaStickyNote,
  FaSave,
  FaArrowLeft,
  FaEdit,
  FaRoad,
  FaClock,
} from "react-icons/fa";

registerLocale("sr-latin", srLatin);

export default function EditShipment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [token] = useGlobalState("token");

  const [form, setForm] = useState({
    pickupLocation: "",
    dropoffLocation: "",
    date: null,
    weightKg: "",
    pallets: "",
    dimensions: { length: "", width: "", height: "" },
    goodsType: "",
    note: "",
    contactPhone: "",
    distanceMeters: "",
    durationSec: "",
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [saving, setSaving] = useState(false);
  const { success, error, warning, info } = useToast();

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const res = await axios.get(`/api/shipments/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = res.data;

        setForm({
          pickupLocation: data.pickupLocation || "",
          dropoffLocation: data.dropoffLocation || "",
          date: data.date ? new Date(data.date) : null,
          weightKg: data.weightKg || "",
          pallets: data.pallets || "",
          dimensions: data.dimensions || { length: "", width: "", height: "" },
          goodsType: data.goodsType || "",
          note: data.note || "",
          contactPhone: data.contactPhone || "",
          distanceMeters: data.distanceMeters || "",
          durationSec: data.durationSec || "",
        });
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchRequest();
  }, [id, token]);

  // Pozovi izračunavanje rute kada se promene lokacije
  useEffect(() => {
    const calculateRoute = async () => {
      if (!form.pickupLocation || !form.dropoffLocation) return;

      try {
        setUpdating(true);
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
        const distanceMeters = distanceData.distanceMeters;
        const durationSec = distanceData.durationSec;

        setForm((prev) => ({
          ...prev,
          distanceMeters,
          durationSec,
        }));
      } catch (err) {
        console.error("Greška pri izračunavanju rute:", err);
      } finally {
        setUpdating(false);
      }
    };

    calculateRoute();
  }, [form.pickupLocation, form.dropoffLocation]);

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
    setForm((prev) => ({
      ...prev,
      date: date,
    }));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const dateStr = format(form.date, "yyyy-MM-dd");

      const payload = {
        pickupLocation: form.pickupLocation,
        dropoffLocation: form.dropoffLocation,
        date: dateStr,
        weightKg: Number(form.weightKg),
        pallets: Number(form.pallets),
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
        distanceMeters: form.distanceMeters,
        durationSec: form.durationSec,
      };

      await axios.put(`/api/shipments/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      success("Zahtev uspešno ažuriran!");
      navigate("/my-shipments");
    } catch (err) {
      console.error(err);
      error("Greška pri izmeni zahteva.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigate("/my-shipments")}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center transition-colors"
            >
              <FaArrowLeft className="mr-2" />
              Nazad
            </button>

            <h1 className="text-2xl font-bold text-gray-800 flex items-center">
              <FaEdit className="mr-2 text-blue-500" />
              Izmena Zahteva
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Datum */}
            <div className="bg-white border rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <FaCalendarAlt className="text-blue-500 mr-2" />
                Datum
              </label>
              <DatePicker
                selected={form.date}
                onChange={handleDateChange}
                locale="sr-latin"
                dateFormat="d. MMMM yyyy"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholderText="Izaberite datum"
                required
              />
            </div>

            {/* Početna destinacija */}
            <div className="bg-white border rounded-lg p-4">
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

            {/* Krajnja destinacija */}
            <div className="bg-white border rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <FaMapMarkerAlt className="text-purple-500 mr-2" />
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

            {/* Udaljenost i vreme */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 border rounded-lg p-4">
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <FaRoad className="text-green-500 mr-2" />
                  Udaljenost (km)
                </label>
                <input
                  type="text"
                  value={
                    form.distanceMeters
                      ? (form.distanceMeters / 1000).toFixed(1)
                      : ""
                  }
                  readOnly
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-100"
                />
              </div>

              <div className="bg-gray-50 border rounded-lg p-4">
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <FaClock className="text-indigo-500 mr-2" />
                  Vreme prevoza (minuti)
                </label>
                <input
                  type="text"
                  value={
                    form.durationSec ? Math.round(form.durationSec / 60) : ""
                  }
                  readOnly
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-100"
                />
              </div>
            </div>

            {updating && (
              <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded-lg">
                Izračunavam novu rutu...
              </div>
            )}

            {/* Težina i palete */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white border rounded-lg p-4">
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <FaWeightHanging className="text-green-500 mr-2" />
                  Težina (kg)
                </label>
                <input
                  type="number"
                  name="weightKg"
                  value={form.weightKg}
                  onChange={handleChange}
                  placeholder="Težina (kg)"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="bg-white border rounded-lg p-4">
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <FaPallet className="text-purple-500 mr-2" />
                  Broj paleta
                </label>
                <input
                  type="text"
                  name="pallets"
                  value={form.pallets}
                  onChange={handleChange}
                  placeholder="Broj paleta"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Dimenzije */}
            <div className="bg-white border rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <FaRulerCombined className="text-indigo-500 mr-2" />
                Dimenzije (cm)
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Dužina
                  </label>
                  <input
                    name="length"
                    value={form.dimensions.length}
                    onChange={handleChange}
                    placeholder="Dužina (cm)"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Širina
                  </label>
                  <input
                    name="width"
                    value={form.dimensions.width}
                    onChange={handleChange}
                    placeholder="Širina (cm)"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Visina
                  </label>
                  <input
                    name="height"
                    value={form.dimensions.height}
                    onChange={handleChange}
                    placeholder="Visina (cm)"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Vrsta robe i kontakt telefon */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white border rounded-lg p-4">
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <FaBox className="text-yellow-500 mr-2" />
                  Vrsta robe
                </label>
                <input
                  type="text"
                  name="goodsType"
                  value={form.goodsType}
                  onChange={handleChange}
                  placeholder="Vrsta robe"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="bg-white border rounded-lg p-4">
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <FaPhone className="text-green-500 mr-2" />
                  Kontakt telefon
                </label>
                <input
                  type="text"
                  name="contactPhone"
                  value={form.contactPhone}
                  onChange={handleChange}
                  placeholder="Kontakt telefon"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Napomena */}
            <div className="bg-white border rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <FaStickyNote className="text-yellow-500 mr-2" />
                Napomena
              </label>
              <textarea
                name="note"
                value={form.note}
                onChange={handleChange}
                placeholder="Napomena"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
              ></textarea>
            </div>

            {/* Dugme za čuvanje */}
            <button
              type="submit"
              disabled={saving || updating}
              className={`w-full py-3 px-4 rounded-lg text-white font-semibold flex items-center justify-center transition-colors ${
                saving || updating
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Čuvanje...
                </>
              ) : (
                <>
                  <FaSave className="mr-2" />
                  Sačuvaj izmene
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
