import React, { useEffect, useState } from "react";
import axios from "axios";
import DatePicker, { registerLocale } from "react-datepicker";
import { format, isAfter, isToday, parseISO } from "date-fns";
import srLatin from "../helper/sr-latin";
import { useToast } from "../components/ToastContext";
import { useGlobalState } from "../helper/globalState";
import { useNavigate } from "react-router-dom";
import {
  FaFilter,
  FaSearch,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaWeightHanging,
  FaBox,
  FaSyncAlt,
  FaPhoneAlt,
  FaComment,
  FaChevronLeft,
  FaChevronRight,
  FaCrown,
  FaCommentDots,
  FaTrash,
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

  // UI states
  const [hideMyShipments, setHideMyShipments] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);

  const [unreadByShipment, setUnreadByShipment] = useState({});
  const [userConvs, setUserConvs] = useState(new Set());
  const { success, error, warning, info } = useToast();

  // Funkcija za resetovanje stranice kada se promeni filter
  const handleFilterChange = (setter) => (value) => {
    setter(value);
    setPage(1); // Resetuj stranicu na 1 kada se promeni filter
  };
  const [expandedNotes, setExpandedNotes] = useState(false); // stanje za sve napomene
  const [expandedShipmentGoods, setExpandedShipmentGoods] = useState(false); // stanje za sve napomene
  // Random border colors (same style as tours file)
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

  const fetchShipments = async () => {
    setLoading(true);

    // format date parameter the same way you used elsewhere (backend accepts date)
    const dateStr = filterDate ? format(filterDate, "yyyy-MM-dd") : "";

    const params = new URLSearchParams();
    if (dateStr) params.append("date", dateStr);
    if (minWeight) params.append("minWeight", minWeight);
    if (pickupLocation) params.append("pickupLocation", pickupLocation);
    if (goodsType) params.append("goodsType", goodsType);

    params.append("page", page);
    params.append("limit", limit);

    try {
      const res = await axios.get("/api/shipments?" + params.toString());

      // Safe access: either backend returns { shipments: [...], total } or returns array
      const shipmentsArray = res.data?.shipments || res.data || [];
      // filter only future (or today) shipments
      const today = new Date();
      const futureShipments = shipmentsArray.filter((shipment) => {
        // handle different date shapes defensively
        let shipmentDate;
        try {
          shipmentDate = parseISO(shipment.date);
          if (isNaN(shipmentDate)) shipmentDate = new Date(shipment.date);
        } catch (e) {
          shipmentDate = new Date(shipment.date);
        }
        return isAfter(shipmentDate, today) || isToday(shipmentDate);
      });

      // premium first, then others; keep date order within groups
      futureShipments.sort((a, b) => {
        if (a.isPremium && !b.isPremium) return -1;
        if (!a.isPremium && b.isPremium) return 1;
        return new Date(a.date) - new Date(b.date);
      });

      setShipments(futureShipments);
      setTotalShipments(futureShipments);
    } catch (err) {
      console.error("Greška pri učitavanju zahteva", err);
      setShipments([]);
      setTotalShipments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShipments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterDate, minWeight, pickupLocation, goodsType, page, limit]);

  // load conversations for badges (same approach as you had)
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
          const shipmentId = conv.shipmentId?._id || conv.shipmentId || null;
          if (!shipmentId) return;
          setIds.add(String(shipmentId));
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

  const handleResetFilters = () => {
    setFilterDate(null);
    setMinWeight("");
    setPickupLocation("");
    setGoodsType("");
    setPage(1);
  };

  // Client-side pagination (we fetch all future shipments, then paginate locally)
  const uid = user?.id || user?._id || null;
  const filteredShipments = shipments.filter((s) => {
    if (!hideMyShipments) return true;
    if (!uid) return true;
    return !(s.createdBy && String(s.createdBy._id) === String(uid));
  });

  const handleDelete = async (id) => {
    if (!window.confirm("Da li ste sigurni da želite da obrišete zahtev?"))
      return;

    try {
      await axios.delete(`/api/shipments/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      success("Zahtev obrisan");
      setShipments((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      console.error("Greška pri brisanju:", err);
      error("Greška pri brisanju zahteva");
    }
  };

  const total = filteredShipments.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  // ensure page is within bounds
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
    if (page < 1) setPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalPages]);

  const indexOfLast = page * limit;
  const indexOfFirst = indexOfLast - limit;
  const currentShipments = filteredShipments.slice(indexOfFirst, indexOfLast);

  // Chat open for shipment (keeps your existing logic)
  async function openChat(shipment) {
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
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate("/chat", {
        state: { conversationId: res.data._id, shipmentId },
      });
    } catch (err) {
      console.error(err);
      error("Greška pri otvaranju konverzacije");
    }
  }

  // async function openChat(shipment) {
  //   const otherUserId = shipment.createdBy._id;
  //   const shipmentId = shipment._id;

  //   const isOwner =
  //     user &&
  //     shipment.createdBy &&
  //     (String(user.id) === String(shipment.createdBy._id) ||
  //       String(user._id) === String(shipment.createdBy._id));

  //   if (isOwner) {
  //     navigate("/chat", { state: { shipmentId: shipment._id } });
  //     return;
  //   }

  //   if (
  //     String(otherUserId) === String(user?.id) ||
  //     String(otherUserId) === String(user?._id)
  //   ) {
  //     warning("Ne možete poslati poruku sami sebi.");
  //     return;
  //   }

  //   try {
  //     const res = await axios.post(
  //       "/api/conversations/shipment",
  //       { shipmentId, otherUserId },
  //       { headers: { Authorization: `Bearer ${token}` } }
  //     );
  //     const conv = res.data;
  //     navigate("/chat", { state: { conversationId: conv._id } });
  //   } catch (err) {
  //     console.error(err);
  //     error("Greška pri otvaranju konverzacije");
  //   }
  // }
  const toggleNote = (id) => {
    setExpandedNotes((prev) => ({ ...prev, [id]: !prev[id] }));
  };
  const truncate = (text, maxLength) => {
    if (!text) return "";
    return text.length > maxLength ? text.slice(0, maxLength) + "…" : text;
  };
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-mainDarkBG py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white dark:bg-cardBGText rounded-xl shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
                Svi Transportni Zahtevi
              </h1>
              <p className="text-gray-600 mt-2 dark:text-darkText">
                Pronađite savršenu pošiljku za vaš transport
              </p>
            </div>
            <div className="flex items-center mt-4 md:mt-0">
              <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full mr-3 dark:text-white dark:bg-blueBg">
                {total} zahteva (strana {page})
              </span>
              <button
                onClick={handleResetFilters}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 dark:text-darkText dark:bg-mainDarkBG px-4 py-2 rounded-lg flex items-center transition-colors"
              >
                <FaSyncAlt className="mr-2" />
                Reset filtera
              </button>
            </div>
          </div>
        </div>

        {/* Filteri */}
        <div className="bg-white dark:bg-cardBGText rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center dark:text-white">
            <FaFilter className="text-blue-500 mr-2" /> Filteri
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="flex text-sm font-medium text-gray-700 mb-2 items-center dark:text-darkText">
                <FaCalendarAlt className="text-blue-500 mr-2" /> Datum
              </label>
              <DatePicker
                selected={filterDate}
                onChange={handleFilterChange(setFilterDate)}
                isClearable
                placeholderText="Svi datumi"
                className="dark:bg-mainDarkBG dark:text-white w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                dateFormat="d. MMMM yyyy"
                locale="sr-latin"
                minDate={new Date()}
              />
            </div>

            <div>
              <label className="flex text-sm font-medium text-gray-700 mb-2 items-center dark:text-darkText">
                <FaWeightHanging className="text-green-500 mr-2" /> Težina (kg)
              </label>
              <input
                type="number"
                value={minWeight}
                onChange={(e) =>
                  handleFilterChange(setMinWeight)(e.target.value)
                }
                placeholder="Min. težina"
                className="dark:bg-mainDarkBG dark:text-white w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                min={0}
              />
            </div>

            <div>
              <label className="flex text-sm font-medium text-gray-700 mb-2 items-center dark:text-darkText">
                <FaMapMarkerAlt className="text-purple-500 mr-2" /> Početna
                lokacija
              </label>
              <input
                type="text"
                value={pickupLocation}
                onChange={(e) =>
                  handleFilterChange(setPickupLocation)(e.target.value)
                }
                placeholder="Unesi lokaciju"
                className="dark:bg-mainDarkBG dark:text-white w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="flex dark:text-darkText text-sm font-medium text-gray-700 mb-2 items-center">
                <FaBox className="text-red-500 mr-2" /> Vrsta robe
              </label>
              <input
                type="text"
                value={goodsType}
                onChange={(e) =>
                  handleFilterChange(setGoodsType)(e.target.value)
                }
                placeholder="Unesi vrstu robe"
                className="dark:bg-mainDarkBG dark:text-white w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Controls above list: hide my + limit */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
          <div>
            <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700 dark:text-darkText">
              <input
                type="checkbox"
                checked={hideMyShipments}
                onChange={() => setHideMyShipments((p) => !p)}
              />
              Sakrij moje zahteve
            </label>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-700 mr-2 dark:text-darkText">
              Prikaži po strani:
            </label>
            <select
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setPage(1);
              }}
              className="dark:bg-cardBGText dark:text-darkText border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={20}>20</option>
              <option value={40}>40</option>
              <option value={60}>60</option>
            </select>
          </div>
        </div>

        {/* Lista pošiljki */}
        <div className="bg-white dark:bg-cardBGText rounded-xl shadow-md overflow-hidden mb-6">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className="text-gray-600 mt-4 dark:text-darkText">
                Učitavanje zahteva...
              </p>
            </div>
          ) : currentShipments.length === 0 ? (
            <div className="p-8 text-center">
              <FaSearch className="text-4xl text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">
                {filterDate || minWeight || pickupLocation || goodsType
                  ? "Nema zahteva za prikaz sa odabranim filterima"
                  : "Trenutno nema dostupnih zahteva."}
              </p>
            </div>
          ) : (
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentShipments.map((shipment, index) => {
                const vehicle = shipment; // not used, kept for parity
                const isOwner =
                  user &&
                  shipment.createdBy &&
                  (String(user.id) === String(shipment.createdBy._id) ||
                    String(user._id) === String(shipment.createdBy._id));
                const isPremium = shipment.isPremium;

                return (
                  <div
                    key={shipment._id}
                    className={`dark:bg-mainDarkBG relative rounded-xl shadow-md p-5 flex flex-col justify-between transition-all duration-300 hover:shadow-lg hover:translate-y-[-2px] ${
                      isPremium
                        ? "border-l-4 border-yellow-500 bg-yellow-50"
                        : `border-l-4 ${getRandomBorderColor(index)} bg-white`
                    } ${isOwner ? "bg-blue-50" : ""}`}
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
                      <div className="flex items-center text-lg font-bold text-gray-900 dark:text-white">
                        <FaCalendarAlt className="text-blue-500 mr-2" />
                        {format(new Date(shipment.date), "d. MMMM yyyy", {
                          locale: srLatin,
                        })}
                      </div>

                      <div className="flex items-center font-medium dark:text-darkText">
                        <FaMapMarkerAlt className="text-red-500 mr-2" />
                        {shipment.pickupLocation} →{" "}
                        {shipment.dropoffLocation || "Bilo gde"}
                      </div>

                      <div className="flex items-center dark:text-darkText">
                        <FaWeightHanging className="text-green-500 mr-2" />
                        {shipment.weightKg} kg • {shipment.pallets} paleta
                      </div>

                      {shipment.goodsType && (
                        <div className="text-gray-600 italic flex items-start dark:text-darkText">
                          <FaBox className="text-purple-500 mr-2 mt-1" />
                          <div>
                            {expandedShipmentGoods
                              ? shipment.goodsType
                              : truncate(shipment.goodsType, 60)}

                            {shipment.goodsType.length > 60 && (
                              <button
                                onClick={() =>
                                  setExpandedShipmentGoods(
                                    !expandedShipmentGoods
                                  )
                                }
                                className="ml-2 text-blue-600 hover:underline focus:outline-none text-sm"
                              >
                                {expandedShipmentGoods
                                  ? "Prikaži manje"
                                  : "Prikaži više"}
                              </button>
                            )}
                          </div>
                        </div>
                      )}

                      {shipment.dimensions?.length &&
                        shipment.dimensions?.width &&
                        shipment.dimensions?.height && (
                          <div className="text-gray-600 dark:text-darkText">
                            Dimenzije: {shipment.dimensions.length} ×{" "}
                            {shipment.dimensions.width} ×{" "}
                            {shipment.dimensions.height} m
                          </div>
                        )}
                      {shipment.note && (
                        <div className="text-gray-600 italic dark:text-darkText">
                          {expandedNotes
                            ? shipment.note
                            : truncate(shipment.note, 60)}

                          {shipment.note.length > 60 && (
                            <button
                              onClick={() => setExpandedNotes(!expandedNotes)}
                              className="ml-2 text-blue-600 hover:underline focus:outline-none"
                            >
                              {expandedNotes ? "Prikaži manje" : "Prikaži više"}
                            </button>
                          )}
                        </div>
                      )}

                      {shipment.contactPhone && (
                        <div className="flex items-center gap-2 mt-2 dark:text-darkText">
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
                    {/* <div className="flex gap-2 pt-3 mt-4">
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
                    </div> */}
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

                      {isOwner && (
                        <button
                          onClick={() => handleDelete(shipment._id)}
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

        {/* Paginacija */}
        {totalPages > 1 && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-600">
                Prikazano {currentShipments.length} od {total} zahteva • Strana{" "}
                {page} od {totalPages}
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <FaChevronLeft className="text-sm" /> Prethodna
                  </button>

                  <div className="flex gap-1">
                    {[...Array(Math.min(5, totalPages))].map((_, i) => {
                      const pageNumber = i + 1;
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => setPage(pageNumber)}
                          className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            page === pageNumber
                              ? "bg-blue-500 text-white"
                              : "bg-gray-100 hover:bg-gray-200"
                          } transition-colors`}
                        >
                          {pageNumber}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    disabled={page >= totalPages}
                    onClick={() => setPage(page + 1)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Sledeća <FaChevronRight className="text-sm" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
