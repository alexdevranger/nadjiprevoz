import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import srLatin from "../helper/sr-latin";
import LocationAutocomplete from "../components/LocationAutocomplete";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  FaCalendarAlt,
  FaUser,
  FaPhone,
  FaMapMarkerAlt,
  FaTruck,
  FaStickyNote,
  FaSave,
  FaArrowLeft,
  FaEdit,
  FaTimes,
} from "react-icons/fa";

registerLocale("sr-latin", srLatin);

export default function TourDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tour, setTour] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [form, setForm] = useState({
    contactPerson: "",
    contactPhone: "",
    startLocation: "",
    startLocationLat: null,
    startLocationLng: null,
    endLocation: "",
    endLocationLat: null,
    endLocationLng: null,
    note: "",
    vehicle: "",
    date: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tourRes = await axios.get(`/api/tours/${id}`);
        const tourData = tourRes.data;

        const vehiclesRes = await axios.get("/api/vehicles", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setTour(tourData);
        setVehicles(vehiclesRes.data);

        setForm({
          contactPerson: tourData.contactPerson || "",
          contactPhone: tourData.contactPhone || "",
          startLocation: tourData.startLocation || "",
          startLocationLat:
            tourData.startLocationLat ||
            (tourData.startPoint?.coordinates?.[1] ?? null),
          startLocationLng:
            tourData.startLocationLng ||
            (tourData.startPoint?.coordinates?.[0] ?? null),
          endLocation: tourData.endLocation || "",
          endLocationLat:
            tourData.endLocationLat ||
            (tourData.endPoint?.coordinates?.[1] ?? null),
          endLocationLng:
            tourData.endLocationLng ||
            (tourData.endPoint?.coordinates?.[0] ?? null),
          note: tourData.note || "",
          vehicle: tourData.vehicle?._id || "",
          date: tourData.date ? new Date(tourData.date) : null,
        });
      } catch (err) {
        console.error("Greška pri učitavanju podataka:", err);
        setError("Greška pri učitavanju podataka");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, token]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  const tourDate = new Date(tour.date);
  const now = new Date();
  const isPastDate = tourDate.setHours(0, 0, 0, 0) < now.setHours(0, 0, 0, 0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date) => {
    setForm((prev) => ({ ...prev, date }));
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const putData = {
        contactPerson: form.contactPerson,
        contactPhone: form.contactPhone,
        startLocation: form.startLocation,
        startLocationLat: form.startLocationLat,
        startLocationLng: form.startLocationLng,
        endLocation: form.endLocation,
        endLocationLat: form.endLocationLat,
        endLocationLng: form.endLocationLng,
        note: form.note,
        vehicle: form.vehicle,
        date: form.date ? format(form.date, "yyyy-MM-dd") : tour.date,
      };

      if (form.startLocationLat && form.startLocationLng) {
        putData.startPoint = {
          type: "Point",
          coordinates: [form.startLocationLng, form.startLocationLat],
        };
      }

      if (form.endLocationLat && form.endLocationLng) {
        putData.endPoint = {
          type: "Point",
          coordinates: [form.endLocationLng, form.endLocationLat],
        };
      }

      await axios.put(`/api/tours/${id}`, putData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Tura uspešno ažurirana!");
      setTimeout(() => navigate("/my-tours"), 800);
    } catch (err) {
      console.error("Greška pri ažuriranju ture:", err);
      alert(err.response?.data?.message || "Greška prilikom ažuriranja ture");
    } finally {
      setSaving(false);
    }
  };

  const canEditOtherFields =
    !isPastDate ||
    (isPastDate && form.date && new Date(form.date) > new Date());

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigate("/my-tours")}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center transition-colors"
            >
              <FaArrowLeft className="mr-2" />
              Nazad
            </button>

            <h1 className="text-2xl font-bold text-gray-800 flex items-center">
              <FaEdit className="mr-2 text-blue-500" />
              Detalji Ture
            </h1>
          </div>

          {/* Datum ture */}
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <FaCalendarAlt className="text-blue-500 mr-2" />
              Datum ture
            </label>
            <DatePicker
              selected={form.date}
              onChange={handleDateChange}
              locale="sr-latin"
              dateFormat="d. MMMM yyyy"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholderText="Izaberite datum"
            />
          </div>

          {isPastDate && (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-lg mb-6">
              {form.date && new Date(form.date) > new Date()
                ? "Sada možete da menjate i ostale podatke jer ste pomerili datum u budućnost."
                : "Ovo je tura za prošli datum. Možete da promenite datum ako želite da je ponovite."}
            </div>
          )}

          <div className="space-y-6">
            {/* Kontakt osoba */}
            <div className="bg-white border rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <FaUser className="text-blue-500 mr-2" />
                Kontakt osoba
              </label>
              <input
                type="text"
                name="contactPerson"
                value={form.contactPerson}
                onChange={handleChange}
                disabled={!canEditOtherFields}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="Ime i prezime kontakt osobe"
              />
            </div>

            {/* Kontakt telefon */}
            <div className="bg-white border rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <FaPhone className="text-green-500 mr-2" />
                Kontakt telefon
              </label>
              <input
                type="tel"
                name="contactPhone"
                value={form.contactPhone}
                onChange={handleChange}
                disabled={!canEditOtherFields}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="+381..."
              />
            </div>

            {/* Početna destinacija */}
            <div className="bg-white border rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <FaMapMarkerAlt className="text-red-500 mr-2" />
                Početna destinacija
              </label>
              <LocationAutocomplete
                value={form.startLocation}
                onSelect={(val) => {
                  setForm((prev) => ({
                    ...prev,
                    startLocation: val.address,
                    startLocationLat: val.lat,
                    startLocationLng: val.lng,
                  }));
                }}
                disabled={!canEditOtherFields}
              />
            </div>

            {/* Krajnja destinacija */}
            <div className="bg-white border rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <FaMapMarkerAlt className="text-purple-500 mr-2" />
                Krajnja destinacija
              </label>
              <LocationAutocomplete
                value={form.endLocation}
                onSelect={(val) => {
                  setForm((prev) => ({
                    ...prev,
                    endLocation: val.address,
                    endLocationLat: val.lat,
                    endLocationLng: val.lng,
                  }));
                }}
                disabled={!canEditOtherFields}
              />
            </div>

            {/* Vozilo */}
            <div className="bg-white border rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <FaTruck className="text-indigo-500 mr-2" />
                Vozilo
              </label>
              <select
                name="vehicle"
                value={form.vehicle}
                onChange={handleChange}
                disabled={!canEditOtherFields}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">Izaberi vozilo</option>
                {vehicles.map((v) => (
                  <option key={v._id} value={v._id}>
                    {v.type} - {v.licensePlate} ({v.capacity} kg)
                  </option>
                ))}
              </select>
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
                disabled={!canEditOtherFields}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                rows={4}
                placeholder="Dodatne napomene o turi..."
              />
            </div>

            {/* Dugme za čuvanje */}
            <button
              onClick={handleSubmit}
              disabled={saving}
              className={`w-full py-3 px-4 rounded-lg text-white font-semibold flex items-center justify-center transition-colors ${
                saving
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
                  Ažuriraj turu
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
