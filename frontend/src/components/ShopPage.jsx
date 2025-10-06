import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useGlobalState } from "../helper/globalState";
import { useToast } from "../components/ToastContext";
import DatePicker, { registerLocale } from "react-datepicker";
import { format, parseISO, isAfter, isToday } from "date-fns";
import srLatin from "../helper/sr-latin";
import "react-datepicker/dist/react-datepicker.css";

registerLocale("sr-latin", srLatin);

import {
  FaPhone,
  FaEnvelope,
  FaTruck,
  FaStar,
  FaBox,
  FaWeightHanging,
  FaRulerCombined,
  FaIdCard,
  FaAward,
  FaCheckCircle,
  FaArrowLeft,
  FaGlobe,
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaEdit,
  FaFilter,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaCrown,
  FaTrash,
  FaComment,
} from "react-icons/fa";

const ShopPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [user] = useGlobalState("user");
  const [shop, setShop] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  const [tours, setTours] = useState([]);
  const [toursLoading, setToursLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [totalToursCount, setTotalToursCount] = useState(0);

  // Zahtevi - novi state
  const [shipments, setShipments] = useState([]);
  const [shipmentsLoading, setShipmentsLoading] = useState(true);
  const [totalShipmentsCount, setTotalShipmentsCount] = useState(0);

  // Filteri za zahteve
  const [filterShipmentDate, setFilterShipmentDate] = useState(null);
  const [filterMinWeight, setFilterMinWeight] = useState("");
  const [filterPickupLocation, setFilterPickupLocation] = useState("");
  const [filterGoodsType, setFilterGoodsType] = useState("");

  // Paginacija za zahteve
  const [shipmentsPage, setShipmentsPage] = useState(1);
  const [shipmentsLimit, setShipmentsLimit] = useState(20);

  // Filter states
  const [filterDate, setFilterDate] = useState(null);
  const [filterVehicleType, setFilterVehicleType] = useState("");
  const [filterCapacity, setFilterCapacity] = useState("");
  const [filterStartLocation, setFilterStartLocation] = useState("");
  const [userConvs, setUserConvs] = useState(new Set());
  const [unreadByTour, setUnreadByTour] = useState({});
  const [unreadByShipment, setUnreadByShipment] = useState({});
  const [expandedNotes, setExpandedNotes] = useState({}); // stanje za sve napomene
  const { success, error, warning, info } = useToast();

  async function openChat(tour) {
    const otherUserId = tour.createdBy._id;
    const tourId = tour._id;

    if (String(otherUserId) === String(user._id)) {
      warning("Ne možete poslati poruku sami sebi.");
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
      error("Greška pri otvaranju konverzacije");
    }
  }

  // useEffect(() => {
  //   if (!token || !user) return;
  //   axios
  //     .get("/api/conversations", {
  //       headers: { Authorization: `Bearer ${token}` },
  //     })
  //     .then((res) => {
  //       const map = {};
  //       const setIds = new Set();
  //       res.data.forEach((conv) => {
  //         const tourId = conv.tourId?._id || null;
  //         if (!tourId) return;
  //         setIds.add(String(tourId));
  //         const unreadCount =
  //           conv.unread?.[user._id] || conv.unread?.[user.id] || 0;
  //         map[String(tourId)] = (map[String(tourId)] || 0) + unreadCount;
  //       });
  //       setUnreadByTour(map);
  //       setUserConvs(setIds);
  //     })
  //     .catch((err) => console.error("Greška pri dohvaćanju konverzacija", err));
  // }, [token, user]);

  useEffect(() => {
    if (!token || !user) return;
    axios
      .get("/api/conversations", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const tourMap = {};
        const shipmentMap = {};
        const tourSetIds = new Set();
        const shipmentSetIds = new Set();

        res.data.forEach((conv) => {
          const tourId = conv.tourId?._id || null;
          const shipmentId = conv.shipmentId?._id || null;
          const unreadCount =
            conv.unread?.[user._id] || conv.unread?.[user.id] || 0;

          if (tourId) {
            tourSetIds.add(String(tourId));
            tourMap[String(tourId)] =
              (tourMap[String(tourId)] || 0) + unreadCount;
          }

          if (shipmentId) {
            shipmentSetIds.add(String(shipmentId));
            shipmentMap[String(shipmentId)] =
              (shipmentMap[String(shipmentId)] || 0) + unreadCount;
          }
        });

        setUnreadByTour(tourMap);
        setUnreadByShipment(shipmentMap);
        setUserConvs(new Set([...tourSetIds, ...shipmentSetIds]));
      })
      .catch((err) => console.error("Greška pri dohvaćanju konverzacija", err));
  }, [token, user]);
  // Sakrij navbar kada se komponenta mount-uje
  useEffect(() => {
    const navbar = document.querySelector(
      'nav, [class*="navbar"], [class*="header"]'
    );
    if (navbar) {
      navbar.style.display = "none";
    }

    return () => {
      if (navbar) {
        navbar.style.display = "";
      }
    };
  }, []);

  const fetchTours = async () => {
    if (!shop) return;

    setToursLoading(true);
    const params = new URLSearchParams();
    if (filterDate) params.append("date", format(filterDate, "yyyy-MM-dd"));
    if (filterVehicleType) params.append("vehicleType", filterVehicleType);
    if (filterCapacity) params.append("minCapacity", filterCapacity);
    if (filterStartLocation)
      params.append("startLocation", filterStartLocation);
    params.append("page", page);
    params.append("limit", limit);

    try {
      const res = await axios.get(
        `/api/tours/by-operator/${shop.userId._id}?${params.toString()}`
      );
      let toursArray = res.data.tours || [];

      // Premium ture prvo
      toursArray.sort((a, b) => {
        if (a.isPremium && !b.isPremium) return -1;
        if (!a.isPremium && b.isPremium) return 1;
        return new Date(a.date) - new Date(b.date);
      });

      setTours(toursArray);
      setTotalToursCount(res.data.total || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setToursLoading(false);
    }
  };
  useEffect(() => {
    fetchTours();
  }, [
    shop,
    filterDate,
    filterVehicleType,
    filterCapacity,
    filterStartLocation,
    page,
    limit,
  ]);

  const fetchShipments = async () => {
    if (!shop) return;

    setShipmentsLoading(true);
    const params = new URLSearchParams();
    if (filterShipmentDate)
      params.append("date", format(filterShipmentDate, "yyyy-MM-dd"));
    if (filterMinWeight) params.append("minWeight", filterMinWeight);
    if (filterPickupLocation)
      params.append("pickupLocation", filterPickupLocation);
    if (filterGoodsType) params.append("goodsType", filterGoodsType);
    params.append("page", shipmentsPage);
    params.append("limit", shipmentsLimit);
    params.append("byUser", shop.userId._id); // Ovo će fetchovati samo zahteve ovog korisnika

    try {
      const res = await axios.get(`/api/shipments?${params.toString()}`);
      let shipmentsArray = res.data?.shipments || res.data || [];

      // Filtriraj samo buduće zahteve
      const today = new Date();
      const futureShipments = shipmentsArray.filter((shipment) => {
        try {
          const shipmentDate = parseISO(shipment.date);
          return isAfter(shipmentDate, today) || isToday(shipmentDate);
        } catch (e) {
          return true;
        }
      });

      // Premium prvo
      futureShipments.sort((a, b) => {
        if (a.isPremium && !b.isPremium) return -1;
        if (!a.isPremium && b.isPremium) return 1;
        return new Date(a.date) - new Date(b.date);
      });

      setShipments(futureShipments);
      setTotalShipmentsCount(futureShipments.length);
    } catch (err) {
      console.error("Greška pri učitavanju zahteva", err);
      setShipments([]);
    } finally {
      setShipmentsLoading(false);
    }
  };

  useEffect(() => {
    fetchShipments();
  }, [
    shop,
    filterShipmentDate,
    filterMinWeight,
    filterPickupLocation,
    filterGoodsType,
    shipmentsPage,
    shipmentsLimit,
  ]);

  const handleDeleteShipment = async (id) => {
    if (window.confirm("Da li ste sigurni da želite da obrišete zahtev?")) {
      try {
        await axios.delete(`/api/shipments/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        success("Zahtev obrisan");
        fetchShipments();
      } catch (err) {
        console.log(err);
        error("Greška prilikom brisanja zahteva");
      }
    }
  };
  const toggleNote = (id) => {
    setExpandedNotes((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const truncate = (text, maxLength) => {
    if (!text) return "";
    return text.length > maxLength ? text.slice(0, maxLength) + "…" : text;
  };
  async function openShipmentChat(shipment) {
    const otherUserId = shipment.createdBy._id;
    const shipmentId = shipment._id;

    if (String(otherUserId) === String(user._id)) {
      warning("Ne možete poslati poruku sami sebi.");
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
      error("Greška pri otvaranju konverzacije");
    }
  }

  const borderColors = [
    "border-l-blue-500 text-blue-500",
    "border-l-green-500 text-green-500",
    "border-l-red-500 text-red-500",
    "border-l-yellow-500 text-yellow-500",
    "border-l-purple-500 text-purple-500",
    "border-l-pink-500 text-pink-500",
  ];

  const getRandomColor = (index) => borderColors[index % borderColors.length];

  const handleDelete = async (id) => {
    if (window.confirm("Da li ste sigurni da želite da obrišete turu?")) {
      try {
        await axios.delete(`/api/tours/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        success("Tura obrisana");
        fetchTours();
      } catch (err) {
        console.log(err);
        error("Greška prilikom brisanja ture");
      }
    }
  };

  useEffect(() => {
    const fetchShop = async () => {
      try {
        const res = await axios.get(`/api/shop/${slug}`);
        console.log(res.data);
        setShop(res.data.shop);
        setVehicles(res.data.shop.vehicles || []);

        // Provera da li je trenutni korisnik vlasnik radnje
        const userRes = await axios.get("/api/auth/me", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        console.log(userRes.data.user.id);
        console.log(res.data.shop.userId._id);

        if (userRes.data && userRes.data.user.id === res.data.shop.userId._id) {
          setIsOwner(true);
        }
      } catch (err) {
        console.error("Greška pri učitavanju shopa:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchShop();
  }, [slug]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleEdit = () => {
    navigate("/my-shop");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Učitavanje...
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Shop nije pronađen
      </div>
    );
  }

  function getRandomBorderColor(index) {
    const colors = [
      "border-blue-500",
      "border-green-500",
      "border-purple-500",
      "border-indigo-500",
      "border-pink-500",
      "border-red-500",
    ];
    return colors[index % colors.length];
  }

  const contact = shop.contact || {};
  const socialMedia = shop.socialMedia || {};
  const services = shop.services || [];
  const specialization = shop.specialization || "";

  const uniqueVehicleTypes = [
    ...new Set((vehicles || []).map((v) => v.type).filter(Boolean)),
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Strelica za nazad */}
      <button
        onClick={handleGoBack}
        className="fixed top-6 left-6 z-50 bg-black/20 hover:bg-black/30 text-white p-3 rounded-full backdrop-blur-sm transition-all duration-200 hover:scale-110"
        title="Nazad na prethodnu stranu"
      >
        <FaArrowLeft className="text-xl" />
      </button>

      {/* Edit dugme - prikazuje se samo vlasniku */}
      {isOwner && (
        <button
          onClick={handleEdit}
          className="fixed top-6 right-6 z-50 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center transition-colors shadow-lg"
          title="Izmeni podatke radnje"
        >
          <FaEdit className="mr-2" />
          Izmeni
        </button>
      )}

      {/* Kombinovani Header/Hero Section */}
      <div className="bg-gradient-to-br from-slate-800 via-blue-900 to-slate-900 text-white mb-8 pt-4">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            {/* Leva strana - Logo i osnovne informacije */}
            <div className="flex flex-col items-start gap-6">
              {shop.logo ? (
                <div className="flex items-center gap-6">
                  <div className="flex-shrink-0">
                    <img
                      src={shop.logo}
                      alt={shop.name}
                      className="h-24 w-24 object-contain rounded-lg bg-white/10 p-2"
                    />
                  </div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">
                      {shop.companyName || shop.name}
                    </h1>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 bg-green-500/20 px-3 py-1 rounded-full border border-green-400/30">
                        <FaCheckCircle className="text-green-400 text-sm" />
                        <span className="text-green-300 text-sm font-medium">
                          Verifikovano
                        </span>
                      </div>
                      {shop.isActive === false && (
                        <div className="flex items-center gap-1 bg-red-500/20 px-3 py-1 rounded-full border border-red-400/30">
                          <span className="text-red-300 text-sm font-medium">
                            Neaktivno
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-24 w-24 bg-blue-500 rounded-lg flex items-center justify-center text-white text-3xl font-bold">
                  {shop.companyName?.charAt(0) || shop.name?.charAt(0) || "S"}
                </div>
              )}

              <div className="flex-1">
                {specialization && (
                  <p className="text-yellow-400 text-lg font-medium mb-3 flex items-center">
                    <FaStar className="mr-2" />
                    {specialization}
                  </p>
                )}

                {shop.description && (
                  <p className="text-gray-300 leading-relaxed">
                    {shop.description}
                  </p>
                )}
                {/* Website */}
                {shop.contact.website && (
                  <a
                    href={shop.contact.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex border items-center gap-3 hover:bg-white/5 p-2 rounded-lg transition-colors mt-2"
                  >
                    <div className="w-8 h-8 bg-orange-500/20 rounded-full flex items-center justify-center">
                      <FaGlobe className="text-orange-400" />
                    </div>
                    <span className="font-medium">{shop.contact.website}</span>
                  </a>
                )}
              </div>
            </div>

            {/* Desna strana - Kontakt i statistika */}
            <div className="flex flex-col gap-4">
              {/* Kontakt informacije */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <FaAward className="text-yellow-400" />
                  Kontaktirajte nas
                </h3>
                <div className="space-y-2">
                  {/* Telefon 1 */}
                  {contact.phone && (
                    <a
                      href={`tel:${contact.phone}`}
                      className="flex items-center gap-3 hover:bg-white/5 p-2 rounded-lg transition-colors"
                    >
                      <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                        <FaPhone className="text-green-400" />
                      </div>
                      <span className="font-medium">{contact.phone}</span>
                    </a>
                  )}

                  {/* Telefon 2 */}
                  {contact.phone2 && (
                    <a
                      href={`tel:${contact.phone2}`}
                      className="flex items-center gap-3 hover:bg-white/5 p-2 rounded-lg transition-colors"
                    >
                      <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                        <FaPhone className="text-blue-400" />
                      </div>
                      <span className="font-medium">{contact.phone2}</span>
                    </a>
                  )}

                  {/* Email */}
                  {contact.email && (
                    <a
                      href={`mailto:${contact.email}`}
                      className="flex items-center gap-3 hover:bg-white/5 p-2 rounded-lg transition-colors"
                    >
                      <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center">
                        <FaEnvelope className="text-purple-400" />
                      </div>
                      <span className="font-medium">{contact.email}</span>
                    </a>
                  )}
                </div>

                {/* Social Media */}
                {(socialMedia.facebook ||
                  socialMedia.instagram ||
                  socialMedia.linkedin) && (
                  <div className="mt-4 pt-4 border-t border-white/20 flex">
                    <h4 className="font-semibold mb-2 text-sm mr-4">
                      Pratite nas:
                    </h4>
                    <div className="flex gap-3">
                      {socialMedia.facebook && (
                        <a
                          href={socialMedia.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white hover:text-blue-300 transition-colors"
                          title="Facebook"
                        >
                          <FaFacebook className="text-xl" />
                        </a>
                      )}
                      {socialMedia.instagram && (
                        <a
                          href={socialMedia.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white hover:text-pink-300 transition-colors"
                          title="Instagram"
                        >
                          <FaInstagram className="text-xl" />
                        </a>
                      )}
                      {socialMedia.linkedin && (
                        <a
                          href={socialMedia.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white hover:text-blue-200 transition-colors"
                          title="LinkedIn"
                        >
                          <FaLinkedin className="text-xl" />
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Statistika */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/10 rounded-lg p-3 text-center border border-white/10">
                  <div className="text-2xl font-bold text-blue-400">
                    {vehicles.length}
                  </div>
                  <div className="text-xs text-gray-300">Vozila</div>
                </div>
                <div className="bg-white/10 rounded-lg p-3 text-center border border-white/10">
                  <div className="text-2xl font-bold text-green-400">
                    {services.length}
                  </div>
                  <div className="text-xs text-gray-300">Usluge</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Kombinovani Header/Hero Section - Varijanta 2 */}

      {/* Ostali sadržaj */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        {/* Usluge */}
        {services.length > 0 && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <h3 className="text-xl font-semibold mb-4 flex items-center text-blue-500">
              <FaBox className="mr-2" />
              Usluge
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {services.map((service, index) => {
                const color = getRandomColor(index);
                return (
                  <div
                    key={index}
                    className={`bg-white rounded-lg shadow p-4 border-l-4 ${
                      color.split(" ")[0]
                    } hover:shadow-md transition-all`}
                  >
                    <h4 className={`font-semibold mb-2 ${color.split(" ")[1]}`}>
                      {service.name}
                    </h4>
                    {service.description && (
                      <p className="text-gray-600 text-sm">
                        {service.description}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Vozila */}
        {vehicles.length > 0 && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center text-green-500">
              <FaTruck className="mr-2" />
              Naša vozila ({vehicles.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vehicles.map((vehicle) => (
                <div
                  key={vehicle._id}
                  className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow bg-white"
                >
                  {vehicle.image1 ? (
                    <div className="h-40 w-full bg-gray-50 flex items-center justify-center overflow-hidden">
                      <img
                        src={vehicle.image1}
                        alt={vehicle.type}
                        className="h-full w-auto object-contain"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-40 bg-gray-100 flex items-center justify-center">
                      <FaTruck className="text-3xl text-gray-400" />
                    </div>
                  )}
                  <div className="p-4">
                    <h4 className="font-semibold text-lg mb-2 flex items-center gap-2">
                      <FaTruck className="text-green-500" />
                      {vehicle.type}
                    </h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p className="flex items-center gap-2">
                        <FaIdCard className="text-blue-500" />
                        <span className="font-medium">Registracija:</span>{" "}
                        {vehicle.licensePlate}
                      </p>
                      <p className="flex items-center gap-2">
                        <FaWeightHanging className="text-red-500" />
                        <span className="font-medium">Kapacitet:</span>{" "}
                        {vehicle.capacity} kg
                      </p>
                      {vehicle.dimensions &&
                        (vehicle.dimensions.length ||
                          vehicle.dimensions.width ||
                          vehicle.dimensions.height) && (
                          <p className="flex items-center gap-2">
                            <FaRulerCombined className="text-purple-500" />
                            <span className="font-medium">Dimenzije:</span>{" "}
                            {vehicle.dimensions.length}m ×{" "}
                            {vehicle.dimensions.width}m ×{" "}
                            {vehicle.dimensions.height}m
                          </p>
                        )}
                    </div>
                    {vehicle.description && (
                      <p className="text-gray-600 text-sm mt-3 pt-2 border-t border-gray-100">
                        {vehicle.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {vehicles.length === 0 && (
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <FaTruck className="text-4xl text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Trenutno nema dostupnih vozila.</p>
          </div>
        )}

        {/* Aktivne ture prevoznika */}
        <div className="w-full mx-auto pb-8">
          <div className="bg-white rounded-xl shadow-md p-6 mb-6 mt-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <FaFilter className="text-blue-500 mr-2" />
              Aktivne ture
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Datum */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
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

              {/* Vrsta vozila */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
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

              {/* Nosivost */}
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

              {/* Lokacija */}
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
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
            {toursLoading && (
              <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10">
                <span className="text-gray-700 font-medium">Učitavanje...</span>
              </div>
            )}

            {tours.length === 0 ? (
              <div className="p-8 text-center text-gray-600">
                Trenutno nema aktivnih tura.
              </div>
            ) : (
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tours.map((tour, index) => {
                  const vehicle = tour.vehicle || {};

                  console.log("Is owner:", isOwner);
                  const isPremium = tour.isPremium;

                  const formatCapacity = (capacity) => {
                    if (!capacity) return "";
                    return capacity >= 1000
                      ? `${(capacity / 1000).toFixed(1)} t`
                      : `${capacity} kg`;
                  };

                  return (
                    <div
                      key={tour._id}
                      className={`relative rounded-xl shadow-md p-5 flex flex-col justify-between transition-all duration-300 hover:shadow-lg hover:translate-y-[-2px] ${
                        isPremium
                          ? "border-l-4 border-yellow-500 bg-yellow-50 ring-2 ring-yellow-400"
                          : "bg-white border-l-4 " + getRandomBorderColor(index)
                      }`}
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

                        {/* Lokacija */}
                        <div className="flex items-center font-medium">
                          <FaMapMarkerAlt className="text-red-500 mr-2" />
                          {tour.startLocation} →{" "}
                          {tour.endLocation || "Bilo gde"}
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
                          <div className="text-gray-600 italic mt-2">
                            {expandedNotes[tour._id]
                              ? tour.note
                              : truncate(tour.note, 150)}{" "}
                            {tour.note.length > 150 && (
                              <button
                                onClick={() => toggleNote(tour._id)}
                                className="text-blue-600 hover:underline ml-1"
                              >
                                {expandedNotes[tour._id]
                                  ? "Prikaži manje"
                                  : "Prikaži više"}
                              </button>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Dugmad */}
                      <div className="flex gap-2 pt-3 mt-4">
                        <button
                          onClick={() =>
                            isOwner
                              ? navigate("/chat", {
                                  state: { tourId: tour._id },
                                })
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
                            className="flex-1 bg-[#d7d7d7] hover:bg-[#c1c1c1] text-[#3d3d3d] px-3 py-2 rounded-lg transition-colors flex items-center justify-center text-sm font-medium"
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
        {/* Aktivni zahtevi za prevoz */}
        <div className="w-full mx-auto pb-8">
          <div className="bg-white rounded-xl shadow-md p-6 mb-6 mt-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <FaFilter className="text-purple-500 mr-2" />
              Aktivni zahtevi za prevoz
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Datum zahteva */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <FaCalendarAlt className="text-purple-500 mr-2" />
                  Datum
                </label>
                <DatePicker
                  selected={filterShipmentDate}
                  onChange={setFilterShipmentDate}
                  isClearable
                  placeholderText="Svi datumi"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  dateFormat="d. MMMM yyyy"
                  locale="sr-latin"
                  minDate={new Date()}
                />
              </div>

              {/* Težina */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <FaWeightHanging className="text-green-500 mr-2" />
                  Težina (kg)
                </label>
                <input
                  type="number"
                  value={filterMinWeight}
                  onChange={(e) => setFilterMinWeight(e.target.value)}
                  placeholder="Min. težina"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  min={0}
                />
              </div>

              {/* Lokacija preuzimanja */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <FaMapMarkerAlt className="text-red-500 mr-2" />
                  Lokacija preuzimanja
                </label>
                <input
                  type="text"
                  value={filterPickupLocation}
                  onChange={(e) => setFilterPickupLocation(e.target.value)}
                  placeholder="Unesi lokaciju"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Vrsta robe */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <FaBox className="text-blue-500 mr-2" />
                  Vrsta robe
                </label>
                <input
                  type="text"
                  value={filterGoodsType}
                  onChange={(e) => setFilterGoodsType(e.target.value)}
                  placeholder="Unesi vrstu robe"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          </div>

          {/* Lista zahteva */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
            {shipmentsLoading && (
              <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10">
                <span className="text-gray-700 font-medium">
                  Učitavanje zahteva...
                </span>
              </div>
            )}

            {shipments.length === 0 ? (
              <div className="p-8 text-center text-gray-600">
                Trenutno nema aktivnih zahteva za prevoz.
              </div>
            ) : (
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {shipments.map((shipment, index) => {
                  const isPremium = shipment.isPremium;

                  return (
                    <div
                      key={shipment._id}
                      className={`relative rounded-xl shadow-md p-5 flex flex-col justify-between transition-all duration-300 hover:shadow-lg hover:translate-y-[-2px] ${
                        isPremium
                          ? "border-l-4 border-yellow-500 bg-yellow-50 ring-2 ring-yellow-400"
                          : "bg-white border-l-4 border-purple-500"
                      }`}
                      style={{ minHeight: "260px" }}
                    >
                      {/* Premium badge */}
                      {isPremium && (
                        <div className="absolute top-3 right-3 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center">
                          <FaCrown className="mr-1" />
                          PREMIUM
                        </div>
                      )}

                      {/* Sadržaj zahteva */}
                      <div className="flex-1 space-y-2 leading-tight text-sm text-gray-700">
                        {/* Datum */}
                        <div className="flex items-center text-lg font-bold text-gray-900">
                          <FaCalendarAlt className="text-purple-500 mr-2" />
                          {format(new Date(shipment.date), "d. MMMM yyyy", {
                            locale: srLatin,
                          })}
                        </div>

                        {/* Lokacija */}
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

                        {shipment.goodsType && (
                          <div className="flex items-center">
                            <FaBox className="text-blue-500 mr-2" />
                            <span>
                              {expandedNotes[`goods-${shipment._id}`]
                                ? shipment.goodsType
                                : truncate(shipment.goodsType, 20)}{" "}
                              {shipment.goodsType.length > 50 && (
                                <button
                                  onClick={() =>
                                    toggleNote(`goods-${shipment._id}`)
                                  }
                                  className="text-blue-600 hover:underline ml-1"
                                >
                                  {expandedNotes[`goods-${shipment._id}`]
                                    ? "Prikaži manje"
                                    : "Prikaži više"}
                                </button>
                              )}
                            </span>
                          </div>
                        )}

                        {/* Dimenzije */}
                        {shipment.dimensions?.length &&
                          shipment.dimensions?.width &&
                          shipment.dimensions?.height && (
                            <div className="text-gray-600">
                              Dimenzije: {shipment.dimensions.length} ×{" "}
                              {shipment.dimensions.width} ×{" "}
                              {shipment.dimensions.height} m
                            </div>
                          )}

                        {/* Kontakt */}
                        {shipment.contactPhone && (
                          <div className="flex items-center gap-2 mt-2">
                            <FaPhoneAlt className="text-green-600" />
                            <span>
                              {shipment.contactPerson} ({shipment.contactPhone})
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
                        {/* Napomena */}
                        {shipment.note && (
                          <div className="text-gray-600 italic text-sm mt-2">
                            {expandedNotes[shipment._id]
                              ? shipment.note
                              : truncate(shipment.note, 150)}{" "}
                            {shipment.note.length > 150 && (
                              <button
                                onClick={() => toggleNote(shipment._id)}
                                className="text-blue-600 hover:underline ml-1"
                              >
                                {expandedNotes[shipment._id]
                                  ? "Prikaži manje"
                                  : "Prikaži više"}
                              </button>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Dugmad */}
                      <div className="flex gap-2 pt-3 mt-4">
                        <button
                          onClick={() =>
                            isOwner
                              ? navigate("/chat", {
                                  state: { shipmentId: shipment._id },
                                })
                              : openShipmentChat(shipment)
                          }
                          className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center ${
                            isOwner
                              ? userConvs.has(String(shipment._id))
                                ? "bg-green-600 hover:bg-green-700 text-white"
                                : "bg-purple-600 hover:bg-purple-700 text-white"
                              : isPremium
                              ? "bg-yellow-600 hover:bg-yellow-700 text-white"
                              : "bg-purple-600 hover:bg-purple-700 text-white"
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

                        {isOwner && (
                          <button
                            onClick={() => handleDeleteShipment(shipment._id)}
                            className="flex-1 bg-[#d7d7d7] hover:bg-[#c1c1c1] text-[#3d3d3d] px-3 py-2 rounded-lg transition-colors flex items-center justify-center text-sm font-medium"
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
    </div>
  );
};

export default ShopPage;
