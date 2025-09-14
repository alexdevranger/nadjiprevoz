import React, { useState, useEffect } from "react";
import axios from "axios";
import { useGlobalState } from "../helper/globalState";
import { Link } from "react-router-dom";
import {
  FaPlus,
  FaTrash,
  FaEdit,
  FaSave,
  FaTimes,
  FaUpload,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaTruck,
  FaStore,
  FaInfoCircle,
  FaTimesCircle,
  FaBuilding,
  FaTag,
  FaIdCard,
  FaWeightHanging,
  FaRulerCombined,
  FaCheckCircle,
} from "react-icons/fa";

const ShopDashboard = () => {
  const [token] = useGlobalState("token");
  const [shop, setShop] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [newService, setNewService] = useState({ name: "", description: "" });
  const [editData, setEditData] = useState({});
  const [uploading, setUploading] = useState(false);
  const [slugAvailable, setSlugAvailable] = useState(null);
  const [helpText, setHelpText] = useState(null);

  useEffect(() => {
    fetchShopData();
  }, []);

  const fetchShopData = async () => {
    try {
      // Uzmi shop podatke
      const shopRes = await axios.get("/api/shop", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Uzmi vozila korisnika
      const vehiclesRes = await axios.get("/api/vehicles", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setShop(shopRes.data);
      setEditData(shopRes.data);
      setVehicles(vehiclesRes.data);
    } catch (err) {
      console.error("Greška pri učitavanju podataka:", err);
    } finally {
      setLoading(false);
    }
  };

  // Provera dostupnosti sluga
  const checkSlugAvailability = async (name) => {
    if (!name.trim()) {
      setSlugAvailable(null);
      return;
    }
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();

    try {
      const res = await axios.get(`/api/shop/check-slug/${slug}`);
      setSlugAvailable(res.data.available);
    } catch (err) {
      console.error("Greška pri proveri sluga:", err);
      setSlugAvailable(false);
    }
  };

  const handleSave = async () => {
    try {
      const res = await axios.put(`/api/shop/${shop._id}`, editData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShop(res.data);
      setEditing(false);
      alert("Podaci uspešno sačuvani!");
    } catch (err) {
      console.error("Greška pri čuvanju podataka:", err);
      alert("Greška pri čuvanju podataka");
    }
  };

  const handleAddService = async () => {
    if (!newService.name.trim()) {
      alert("Unesite naziv usluge!");
      return;
    }

    try {
      const res = await axios.post(
        `/api/shop/${shop._id}/services`,
        newService,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setShop(res.data);
      setEditData(res.data);
      setNewService({ name: "", description: "" });
    } catch (err) {
      console.error("Greška pri dodavanju usluge:", err);
      alert("Greška pri dodavanju usluge");
    }
  };

  const handleDeleteService = async (serviceId) => {
    if (
      !window.confirm("Da li ste sigurni da želite da obrišete ovu uslugu?")
    ) {
      return;
    }

    try {
      const res = await axios.delete(
        `/api/shop/${shop._id}/services/${serviceId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setShop(res.data);
      setEditData(res.data);
    } catch (err) {
      console.error("Greška pri brisanju usluge:", err);
      alert("Greška pri brisanju usluge");
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await axios.post(
        "/api/images/upload-shop-logo",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        const newLogoUrl = response.data.imageUrl;

        // Automatski ažuriraj bazu
        const updateResponse = await axios.put(
          `/api/shop/${shop._id}`,
          { ...editData, logo: newLogoUrl },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // Ažuriraj stanje
        setShop(updateResponse.data);
        setEditData(updateResponse.data);
        alert("Logo uspešno uploadovan i sačuvan!");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Greška pri uploadu logoa");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteShopLogo = async () => {
    if (!window.confirm("Da li ste sigurni da želite da obrišete logo?")) {
      return;
    }

    try {
      const response = await axios.delete("/api/images/delete-shop-logo", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        // Ažuriraj bazu
        const updateResponse = await axios.put(
          `/api/shop/${shop._id}`,
          { ...editData, logo: "" },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // Ažuriraj stanje
        setShop(updateResponse.data);
        setEditData(updateResponse.data);
        alert("Logo uspešno obrisan!");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Greška pri brisanju logoa");
    }
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

  const renderHelp = (field) => {
    const texts = {
      name: "Naziv shopa mora biti jedinstven jer se koristi kao link (slug).",
      companyName: "Zvaničan naziv firme prema registraciji.",
      specialization: "Unesite glavnu delatnost ili tip usluga.",
      description: "Ovde možete detaljno opisati svoj shop i usluge.",
    };
    return (
      <FaInfoCircle
        className="inline ml-2 text-blue-400 cursor-pointer"
        title={texts[field]}
        onClick={() =>
          setHelpText(helpText === texts[field] ? null : texts[field])
        }
      />
    );
  };

  const avatarColors = [
    "bg-blue-100 text-blue-600",
    "bg-green-100 text-green-600",
    "bg-yellow-100 text-yellow-600",
    "bg-pink-100 text-pink-600",
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
              <FaStore className="text-blue-500" />
              Upravljanje Shopom: {shop.name}
            </h1>
            {editing ? (
              <div className="flex gap-2">
                <button
                  onClick={() => setEditing(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg flex items-center"
                >
                  <FaTimes className="mr-2" />
                  Otkaži
                </button>
                <button
                  onClick={handleSave}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center"
                >
                  <FaSave className="mr-2" />
                  Sačuvaj
                </button>
              </div>
            ) : (
              <button
                onClick={() => setEditing(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
              >
                <FaEdit className="mr-2" />
                Izmeni
              </button>
            )}
          </div>

          {/* Osnovni podaci */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Naziv Shopa */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <FaStore className="mr-2 text-blue-500" />
                Naziv Shopa * {renderHelp("name")}
              </label>
              {editing ? (
                <>
                  <input
                    type="text"
                    value={editData.name || ""}
                    onChange={(e) => {
                      setEditData({ ...editData, name: e.target.value });
                      checkSlugAvailability(e.target.value);
                    }}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    required
                  />
                  {slugAvailable !== null && (
                    <p
                      className={`mt-1 text-sm flex items-center gap-1 ${
                        slugAvailable
                          ? "text-green-600"
                          : "text-red-600 font-medium"
                      }`}
                    >
                      {slugAvailable ? (
                        <>
                          <FaCheckCircle /> Naziv dostupan
                        </>
                      ) : (
                        <>
                          <FaTimesCircle /> Naziv zauzet
                        </>
                      )}
                    </p>
                  )}
                </>
              ) : (
                <p className="text-gray-800 font-medium">{shop.name}</p>
              )}
            </div>

            {/* Naziv kompanije */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <FaBuilding className="mr-2 text-indigo-500" />
                Naziv Kompanije * {renderHelp("companyName")}
              </label>
              {editing ? (
                <input
                  type="text"
                  value={editData.companyName || ""}
                  onChange={(e) =>
                    setEditData({ ...editData, companyName: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  required
                />
              ) : (
                <p className="text-gray-800 font-medium">{shop.companyName}</p>
              )}
            </div>

            {/* Specijalnost */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <FaTag className="mr-2 text-pink-500" />
                Specijalnost {renderHelp("specialization")}
              </label>
              {editing ? (
                <input
                  type="text"
                  value={editData.specialization || ""}
                  onChange={(e) =>
                    setEditData({ ...editData, specialization: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="npr. Međunarodni transport, Selidbe, itd."
                />
              ) : (
                <p className="text-gray-600">
                  {shop.specialization || "Nije postavljena"}
                </p>
              )}
            </div>

            {/* Logo */}
            <div className="flex flex-col items-start">
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <FaUpload className="mr-2 text-orange-500" />
                Logo
              </label>
              {editing ? (
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                    className="mb-2"
                  />
                  {uploading && (
                    <p className="text-sm text-blue-600">Uploaduje se...</p>
                  )}
                  {(editData.logo || shop.logo) && (
                    <div className="mt-2">
                      <div className="h-16 flex items-center relative">
                        <img
                          src={editData.logo || shop.logo}
                          alt="Logo"
                          className="h-full w-auto max-w-full object-contain border rounded"
                        />
                        <button
                          type="button"
                          onClick={handleDeleteShopLogo}
                          className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          title="Obriši logo"
                        >
                          <FaTimes size={12} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : shop.logo ? (
                <div className="h-16 flex items-center">
                  <img
                    src={shop.logo}
                    alt="Logo"
                    className="h-full w-auto max-w-full object-contain"
                  />
                </div>
              ) : (
                <p className="text-gray-600">Nema logoa</p>
              )}
            </div>
          </div>

          {/* Opis */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <FaInfoCircle className="mr-2 text-teal-500" />
              Opis Shopa {renderHelp("description")}
            </label>
            {editing ? (
              <textarea
                value={editData.description || ""}
                onChange={(e) =>
                  setEditData({ ...editData, description: e.target.value })
                }
                rows="3"
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                placeholder="Opisite vašu kompaniju i usluge..."
              />
            ) : (
              <p className="text-gray-600">
                {shop.description || "Nije postavljen opis"}
              </p>
            )}
          </div>

          {/* Kontakt */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <FaPhone className="inline mr-2 text-green-500" />
                Telefon
              </label>
              {editing ? (
                <input
                  type="text"
                  value={editData.contact?.phone || ""}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      contact: { ...editData.contact, phone: e.target.value },
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              ) : (
                <p className="text-gray-600">
                  {shop.contact?.phone || "Nije postavljen"}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <FaEnvelope className="inline mr-2 text-purple-500" />
                Email
              </label>
              {editing ? (
                <input
                  type="email"
                  value={editData.contact?.email || ""}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      contact: { ...editData.contact, email: e.target.value },
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              ) : (
                <p className="text-gray-600">
                  {shop.contact?.email || "Nije postavljen"}
                </p>
              )}
            </div>
          </div>

          {helpText && (
            <div className="bg-blue-50 text-blue-800 p-3 rounded-lg mb-4 text-sm border border-blue-200">
              {helpText}
            </div>
          )}
        </div>

        {/* Sekcija za Usluge */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <FaPlus className="mr-2 text-blue-500" />
              Usluge
            </h2>
            <div className="text-sm text-gray-500">
              {editing ? "Režim izmena" : "Pregled usluga"}
            </div>
          </div>

          {/* Forma za dodavanje nove usluge */}
          {editing && (
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h3 className="text-lg font-medium mb-3">Dodaj novu uslugu</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Naziv usluge *
                  </label>
                  <input
                    type="text"
                    value={newService.name}
                    onChange={(e) =>
                      setNewService({ ...newService, name: e.target.value })
                    }
                    placeholder="npr. Selidbe, Transport robe, Međunarodni transport"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Opis usluge
                </label>
                <textarea
                  value={newService.description}
                  onChange={(e) =>
                    setNewService({
                      ...newService,
                      description: e.target.value,
                    })
                  }
                  placeholder="Detaljan opis usluge..."
                  rows="2"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleAddService}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
                >
                  <FaPlus className="mr-2" />
                  Dodaj uslugu
                </button>

                <button
                  onClick={() => setNewService({ name: "", description: "" })}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg"
                >
                  Poništi
                </button>
              </div>
            </div>
          )}

          {/* Lista usluga (DashboardCard stil: border-l-4 u random boji) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {shop.services && shop.services.length > 0 ? (
              (() => {
                // boje za border (stil, UI-only)
                const colors = [
                  "border-blue-500",
                  "border-green-500",
                  "border-yellow-500",
                  "border-purple-500",
                  "border-indigo-500",
                  "border-pink-500",
                  "border-red-500",
                ];

                return shop.services.map((service, index) => {
                  const color = colors[index % colors.length];
                  // izvući prvo slovo za mali avatar (vizuelni detalj, ne šalje se backendu)
                  const initial = (service.name || "U").charAt(0).toUpperCase();

                  return (
                    <div
                      key={service._id || index}
                      className={`bg-white rounded-xl shadow-md p-4 h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-l-4 ${color}`}
                    >
                      <div className="flex items-start gap-3">
                        {/* avatar inicijal u krugu */}
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${color.replace(
                            "border-",
                            "bg-"
                          )} bg-opacity-20 text-sm font-semibold`}
                          aria-hidden
                        >
                          {initial}
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-blue-600 text-base">
                              {service.name}
                            </h4>

                            {/* obriši (samo u edit modu) */}
                            {editing && (
                              <button
                                onClick={() => handleDeleteService(service._id)}
                                className="text-red-500 hover:text-red-700 p-2 rounded-md"
                                title="Obriši uslugu"
                              >
                                <FaTrash />
                              </button>
                            )}
                          </div>

                          {service.description ? (
                            <p className="text-gray-600 text-sm mt-1 leading-snug">
                              {service.description}
                            </p>
                          ) : (
                            <p className="text-gray-400 text-sm italic mt-1">
                              Nema opisa
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                });
              })()
            ) : (
              <div className="col-span-2 text-center py-8 text-gray-500">
                {editing ? "Dodajte prvu uslugu" : "Trenutno nema usluga"}
              </div>
            )}
          </div>
        </div>

        {/* Sekcija za Vozila */}
        {/* Vozila */}
        {!editing && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <FaTruck className="text-green-500" />
                Vaša Vozila
              </h2>
              <Link
                to="/my-vehicles"
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center"
              >
                <FaEdit className="mr-2" />
                Izmeni vozila
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vehicles.map((vehicle) => (
                <div
                  key={vehicle._id}
                  className="border rounded-xl bg-white shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col"
                >
                  {/* Slika vozila */}
                  {vehicle.image1 ? (
                    <div className="h-40 w-full bg-gray-100 flex items-center justify-center overflow-hidden">
                      <img
                        src={vehicle.image1}
                        alt={vehicle.type}
                        className="h-full w-auto object-contain"
                      />
                    </div>
                  ) : (
                    <div className="h-40 w-full bg-gray-100 flex items-center justify-center">
                      <FaTruck className="text-4xl text-gray-400" />
                    </div>
                  )}

                  {/* Podaci o vozilu */}
                  <div className="p-4 flex-1 flex flex-col">
                    <h4 className="font-semibold text-lg mb-3 flex items-center gap-2 text-gray-800">
                      <FaTruck className="text-green-500" />
                      {vehicle.type}
                    </h4>

                    <div className="space-y-2 text-sm text-gray-700">
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

                      {vehicle.dimensions && (
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
                      <p className="text-gray-600 text-sm mt-3 pt-3 border-t border-gray-200 leading-snug">
                        {vehicle.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {vehicles.length === 0 && (
              <div className="text-center text-gray-500 py-6">
                Trenutno nemate dodata vozila.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopDashboard;
