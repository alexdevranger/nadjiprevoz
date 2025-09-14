import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useGlobalState } from "../helper/globalState";
import DatePicker, { registerLocale } from "react-datepicker";
import { format, isAfter, isToday, parseISO } from "date-fns";
import srLatin from "../helper/sr-latin";
import "react-datepicker/dist/react-datepicker.css";
import {
  FaFilter,
  FaSearch,
  FaCalendarAlt,
  FaTruck,
  FaMapMarkerAlt,
  FaWeightHanging,
  FaTimes,
  FaCrown,
  FaComment,
  FaTrash,
  FaSyncAlt,
  FaPhoneAlt,
} from "react-icons/fa";

registerLocale("sr-latin", srLatin);

export default function AllTours() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [user] = useGlobalState("user");

  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalTours, setTotalTours] = useState([]);

  // Filter states
  const [filterDate, setFilterDate] = useState(null);
  const [filterVehicleType, setFilterVehicleType] = useState("");
  const [filterCapacity, setFilterCapacity] = useState("");
  const [filterStartLocation, setFilterStartLocation] = useState("");

  const [unreadByTour, setUnreadByTour] = useState({});
  const [userConvs, setUserConvs] = useState(new Set());
  const [vehicles, setVehicles] = useState([]);

  async function openChat(tour) {
    const otherUserId = tour.createdBy._id;
    const tourId = tour._id;

    if (String(otherUserId) === String(user._id)) {
      alert("Ne možete poslati poruku sami sebi.");
      return;
    }
    try {
      const res = await axios.post(
        "/api/conversations",
        { tourId, otherUserId },
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

  useEffect(() => {
    if (token) {
      axios
        .get("/api/vehicles", { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => setVehicles(res.data))
        .catch((err) => console.error(err));
    }
  }, [token]);

  const fetchTours = async () => {
    setLoading(true);
    let dateStr = filterDate ? format(filterDate, "d. MMMM yyyy") : "";

    const params = new URLSearchParams();
    if (dateStr) params.append("date", dateStr);
    if (filterVehicleType) params.append("vehicleType", filterVehicleType);
    if (filterCapacity) params.append("minCapacity", filterCapacity);
    if (filterStartLocation)
      params.append("startLocation", filterStartLocation);

    try {
      const res = await axios.get("/api/tours?" + params.toString());
      const today = new Date();
      const futureTours = res.data.filter((tour) => {
        const tourDate = parseISO(tour.date);
        return isAfter(tourDate, today) || isToday(tourDate);
      });
      setTours(futureTours);
      if (
        !filterDate &&
        !filterVehicleType &&
        !filterCapacity &&
        !filterStartLocation
      ) {
        setTotalTours(futureTours);
      }
    } catch (err) {
      console.error("Greška pri učitavanju tura", err);
      setTours([]);
    } finally {
      setLoading(false);
    }
  };

  const handleResetFilters = () => {
    setFilterDate(null);
    setFilterVehicleType("");
    setFilterCapacity("");
    setFilterStartLocation("");
  };

  useEffect(() => {
    fetchTours();
  }, [filterDate, filterVehicleType, filterCapacity, filterStartLocation]);

  const handleDelete = async (id) => {
    if (window.confirm("Da li ste sigurni da želite da obrišete turu?")) {
      try {
        await axios.delete(`/api/tours/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Tura obrisana");
        fetchTours();
      } catch (err) {
        alert("Greška prilikom brisanja ture");
      }
    }
  };

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
          const tourId = conv.tourId?._id || null;
          if (!tourId) return;

          setIds.add(String(tourId));
          const unreadCount =
            conv.unread?.[user._id] || conv.unread?.[user.id] || 0;
          map[String(tourId)] = (map[String(tourId)] || 0) + unreadCount;
        });

        setUnreadByTour(map);
        setUserConvs(setIds);
      })
      .catch((err) => console.error("Greška pri dohvaćanju konverzacija", err));
  }, [token, user]);

  const uniqueVehicleTypes = [
    ...new Set(totalTours.map((t) => t.vehicle?.type).filter(Boolean)),
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
                Sve Dostupne Ture
              </h1>
              <p className="text-gray-600 mt-2">
                Pronađite savršenu turu za vaš transport
              </p>
            </div>
            <div className="flex items-center mt-4 md:mt-0">
              <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full mr-3">
                {tours.length} tura
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

            {/* Vrsta vozila filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <FaTruck className="text-green-500 mr-2" />
                Vrsta vozila
              </label>
              <select
                value={filterVehicleType}
                onChange={(e) => setFilterVehicleType(e.target.value)}
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
                value={filterCapacity}
                onChange={(e) => setFilterCapacity(e.target.value)}
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
                value={filterStartLocation}
                onChange={(e) => setFilterStartLocation(e.target.value)}
                placeholder="Unesi lokaciju"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
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
              <FaSearch className="text-4xl text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">
                {filterDate ||
                filterVehicleType ||
                filterCapacity ||
                filterStartLocation
                  ? "Nema tura za prikaz sa odabranim filterima"
                  : "Trenutno nema dostupnih tura."}
              </p>
            </div>
          ) : (
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tours.map((tour, index) => {
                const vehicle = tour.vehicle || {};
                const isOwner =
                  user && tour.createdBy && user.id === tour.createdBy._id;
                const isPremium = tour.isPremium;

                // helper za kapacitet
                const formatCapacity = (capacity) => {
                  if (!capacity) return "";
                  return capacity >= 1000
                    ? `${(capacity / 1000).toFixed(1)} t`
                    : `${capacity} kg`;
                };

                return (
                  <div
                    key={tour._id}
                    className={`relative border-l-4 ${getRandomBorderColor(
                      index
                    )} rounded-xl shadow-md p-5 flex flex-col justify-between transition-all duration-300 hover:shadow-lg hover:translate-y-[-2px] ${
                      isPremium ? "ring-2 ring-yellow-400" : ""
                    } ${isOwner ? "bg-blue-50" : "bg-white"}`}
                    style={{ minHeight: "260px" }}
                  >
                    {/* Premium badge */}
                    {isPremium && (
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
                      {vehicle.type && (
                        <div className="flex items-center">
                          <FaTruck className="text-green-500 mr-2" />
                          {vehicle.type} - {formatCapacity(vehicle.capacity)}
                        </div>
                      )}

                      {/* Kontakt */}
                      {tour.contactPerson && tour.contactPhone && (
                        <div className="flex items-center gap-2">
                          {isOwner ? (
                            <span>
                              <span className="font-medium">Kontakt:</span>{" "}
                              {tour.contactPerson} ({tour.contactPhone})
                            </span>
                          ) : (
                            <>
                              <FaPhoneAlt className="text-green-600" />
                              <span>
                                {tour.contactPerson} ({tour.contactPhone})
                              </span>
                              <a
                                href={`tel:${tour.contactPhone}`}
                                className="ml-auto bg-green-500 hover:bg-green-600 text-white text-xs px-3 py-1 rounded-lg flex items-center"
                              >
                                <FaPhoneAlt className="mr-1" />
                                Pozovi
                              </a>
                            </>
                          )}
                        </div>
                      )}

                      {/* Napomena */}
                      {tour.note && (
                        <div className="text-gray-600 italic">{tour.note}</div>
                      )}
                    </div>

                    {/* Dugmad */}
                    <div className="flex gap-2 pt-3 mt-4">
                      <button
                        onClick={() =>
                          isOwner
                            ? navigate("/chat", { state: { tourId: tour._id } })
                            : openChat(tour)
                        }
                        className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center ${
                          isOwner
                            ? userConvs.has(String(tour._id))
                              ? "bg-green-600 hover:bg-green-700 text-white"
                              : "bg-blue-600 hover:bg-blue-700 text-white"
                            : isPremium
                            ? "bg-yellow-600 hover:bg-yellow-700 text-white"
                            : "bg-blue-600 hover:bg-blue-700 text-white"
                        }`}
                      >
                        <FaComment className="mr-1" />
                        {isOwner
                          ? userConvs.has(String(tour._id))
                            ? "Idi na chat"
                            : "Nema poruka"
                          : "Pošalji poruku"}
                        {isOwner && unreadByTour[String(tour._id)] > 0 && (
                          <span className="ml-1 bg-red-500 text-white rounded-full px-2 py-0.5 text-xs">
                            {unreadByTour[String(tour._id)]}
                          </span>
                        )}
                      </button>

                      {isOwner && (
                        <button
                          onClick={() => handleDelete(tour._id)}
                          className="flex-1 bg-red-100 hover:bg-red-200 text-red-600 px-3 py-2 rounded-lg transition-colors flex items-center justify-center text-sm font-medium"
                        >
                          <FaTrash className="mr-1" />
                          Obriši
                        </button>
                      )}
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
