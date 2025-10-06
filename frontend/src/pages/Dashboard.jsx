import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { setGlobalState, useGlobalState } from "../helper/globalState";
import axios from "axios";

import {
  FaTruck,
  FaPallet,
  FaComments,
  FaBriefcase,
  FaClipboardList,
  FaUser,
  FaCog,
  FaCar,
  FaHistory,
  FaChartBar,
  FaPlusCircle,
  FaStore,
  FaSignOutAlt,
  FaExternalLinkAlt,
  FaTrash,
  FaTimes,
  FaEdit,
  FaSave,
  FaUserCircle,
  FaBuilding,
  FaEnvelope,
  FaUserTag,
  FaImage,
  FaUpload,
  FaAdjust,
} from "react-icons/fa";

export default function Dashboard() {
  const [token, setToken] = useGlobalState("token");
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [user, setUser] = useGlobalState("user");
  const [vehicles, setVehicles] = useState([]);
  const [tours, setTours] = useState([]);
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasShop, setHasShop] = useState(false);
  const [shop, setShop] = useState(null);
  const [showCreateShop, setShowCreateShop] = useState(false);
  const [shopName, setShopName] = useState("");
  const [slugAvailable, setSlugAvailable] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "",
    company: "",
  });
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // Komponenta za prikaz kartice
  const DashboardCard = ({
    icon,
    title,
    description,
    link,
    count,
    color,
    onClick,
  }) => {
    // Funkcija za formatiranje broja sa odgovarajućim nastavkom
    const getCountText = (count, type) => {
      if (count === undefined || count === null) return "";

      const lastDigit = count % 10;
      const lastTwoDigits = count % 100;

      switch (type) {
        case "vehicles":
          if (count === 1) return `${count} vozilo`;
          if (count >= 2 && count <= 4) return `${count} vozila`;
          return `${count} vozila`;

        case "tours":
          if (count === 1) return `${count} tura`;
          if (count >= 2 && count <= 4) return `${count} ture`;
          return `${count} tura`;

        case "shipments":
          if (count === 1) return `${count} zahtev`;
          if (count >= 2 && count <= 4) return `${count} zahteva`;
          return `${count} zahteva`;

        default:
          if (count === 1) return `${count} stavka`;
          if (count >= 2 && count <= 4) return `${count} stavke`;
          return `${count} stavki`;
      }
    };

    // Određivanje tipa na osnovu title-a
    const getTypeFromTitle = (title) => {
      if (title.includes("vozil")) return "vehicles";
      if (title.includes("tur")) return "tours";
      if (title.includes("zahtev")) return "shipments";
      return "default";
    };

    const type = getTypeFromTitle(title);
    const countText = getCountText(count, type);

    return (
      <div
        onClick={onClick}
        className={`block h-full text-gray-800 no-underline ${
          onClick ? "cursor-pointer" : ""
        }`}
      >
        <div
          className={`bg-white rounded-xl shadow-md p-6 h-full transition-all duration-300 hover:shadow-lg hover:transform hover:-translate-y-1 border-l-4 ${color}`}
        >
          <div className="flex items-center mb-4">
            <div
              className={`text-2xl mr-3 ${color.replace("border-l-", "text-")}`}
            >
              {icon}
            </div>
            <h3 className="text-lg font-semibold">{title}</h3>
          </div>
          <p className="text-sm text-gray-600 mb-2">{description}</p>
          {count !== undefined && (
            <div className="mt-2 text-right">
              <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                {countText}
              </span>
            </div>
          )}
          {link && !onClick && (
            <Link
              to={link}
              className="text-blue-500 text-sm font-medium mt-2 inline-block"
            >
              Vidi detalje &rarr;
            </Link>
          )}
        </div>
      </div>
    );
  };

  // Učitavanje podataka
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log(user);
        // Učitaj vozila
        const vehiclesRes = await axios.get("/api/vehicles", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(vehiclesRes.data);
        setVehicles(Array.isArray(vehiclesRes.data) ? vehiclesRes.data : []);

        // Učitaj ture
        const toursRes = await axios.get("/api/tours", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(toursRes.data);
        setTours(Array.isArray(toursRes.data.tours) ? toursRes.data.tours : []);

        // Učitaj shipmentove
        const shipmentsRes = await axios.get("/api/shipments", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(shipmentsRes.data);
        setShipments(
          Array.isArray(shipmentsRes.data.shipments)
            ? shipmentsRes.data.shipments
            : []
        );
      } catch (err) {
        console.error("Greška pri učitavanju podataka:", err);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchData();
    }
  }, [token]);

  //Provera da li korisnik ima shop
  useEffect(() => {
    const checkShop = async () => {
      try {
        const shopRes = await axios.get("/api/shop", {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Server vraća null ako nema shopa, ne prazan objekat
        setHasShop(shopRes.data !== null);
        setShop(shopRes.data);
      } catch (err) {
        console.error("Greška pri proveri shopa:", err);
        setHasShop(false);
        setShop(null);
      }
    };

    if (token) {
      checkShop();
    }
  }, [token]);

  // Inicijalizacija podataka profila
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || "",
        company: user.company || "",
      });
    }
  }, [user]);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setUploadMessage("Slika je prevelika (max 5MB)");
      return;
    }

    setUploading(true);
    setUploadMessage("");

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await axios.post(
        "/api/images/upload-profile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        setUploadMessage("✅ Slika uspešno uploadovana!");
        const updatedUser = { ...user, profileImage: response.data.imageUrl };
        setUser(updatedUser);
        setGlobalState("user", updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));

        // Resetuj file input
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }

        // Emit event da obavesti navbar o promeni
        window.dispatchEvent(new CustomEvent("profileImageUpdated"));
      }
    } catch (error) {
      console.error("Upload error:", error);
      setUploadMessage("❌ Greška pri uploadu slike");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteProfileImage = async () => {
    if (
      !window.confirm("Da li ste sigurni da želite da obrišete profilnu sliku?")
    ) {
      return;
    }

    try {
      const response = await axios.delete("/api/images/delete-profile-image", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setUploadMessage("✅ Profilna slika uspešno obrisana!");
        const updatedUser = { ...user, profileImage: "" };
        setUser(updatedUser);
        setGlobalState("user", updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));

        // Resetuj file input
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }

        window.dispatchEvent(new CustomEvent("profileImageUpdated"));
      }
    } catch (error) {
      console.error("Delete error:", error);
      setUploadMessage("❌ Greška pri brisanju slike");
    }
  };

  // Funkcija za odjavu
  const handleLogout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setGlobalState("user", null);
    setGlobalState("token", null);
    navigate("/login");
  };

  // Funkcija za izmenu profila
  const handleProfileUpdate = async () => {
    try {
      const response = await axios.put(
        "/api/auth/profile",
        {
          name: profileData.name,
          company: profileData.company,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        // Ažuriraj globalno stanje korisnika
        const updatedUser = {
          ...user,
          name: profileData.name,
          company: profileData.company,
        };
        setUser(updatedUser);
        setGlobalState("user", updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));

        setUploadMessage("✅ Profil uspešno ažuriran!");
        setEditingProfile(false);
      }
    } catch (error) {
      console.error("Update error:", error);
      setUploadMessage("❌ Greška pri ažuriranju profila");
    }
  };

  // Funkcija za brisanje kompanije
  const handleDeleteCompany = async () => {
    if (
      !window.confirm(
        "Da li ste sigurni da želite da obrišete kompaniju? Ova akcija će postaviti hasCompany na false."
      )
    ) {
      return;
    }

    try {
      const response = await axios.put(
        "/api/auth/delete-company",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        // Ažuriraj globalno stanje korisnika
        const updatedUser = {
          ...user,
          hasCompany: false,
          company: "",
        };
        setUser(updatedUser);
        setGlobalState("user", updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));

        // Ažuriraj i lokalno stanje
        setProfileData({
          ...profileData,
          company: "",
        });

        setUploadMessage("✅ Kompanija uspešno obrisana!");
      }
    } catch (error) {
      console.error("Delete company error:", error);
      setUploadMessage("❌ Greška pri brisanju kompanije");
    }
  };

  // Sadržaj za pojedinačne tabove
  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
      default:
        return (
          <div>
            {/* Istaknuta kartica za shop ako postoji */}
            {hasShop && shop && (
              <div className="mb-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
                <div className="flex flex-col md:flex-row items-center justify-between">
                  <div className="flex items-center mb-4 md:mb-0">
                    <div className="bg-white bg-opacity-20 p-3 rounded-full mr-4">
                      <FaStore className="text-2xl" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">
                        Vaša radnja je aktivna!
                      </h2>
                      <p className="opacity-90">
                        Podelite svoju radnju sa potencijalnim klijentima
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <Link
                      to={`/shop/${shop.slug}`}
                      className="bg-white text-indigo-600 font-semibold px-4 py-2 rounded-lg flex items-center hover:bg-gray-100 transition-colors"
                    >
                      <FaExternalLinkAlt className="mr-2" /> Poseti svoju radnju
                    </Link>
                    <Link
                      to="/my-shop"
                      className="bg-indigo-800 text-white font-semibold px-4 py-2 rounded-lg hover:bg-indigo-900 transition-colors"
                    >
                      Upravljaj radnjom
                    </Link>
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      className="bg-red-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center"
                    >
                      <FaTrash className="mr-2" /> Obriši radnju
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <DashboardCard
                icon={<FaCar className="text-blue-500" />}
                title="Moja vozila"
                description="Dodajte i upravljajte vašim vozilima"
                link="/my-vehicles"
                count={vehicles.length}
                color="border-l-blue-500"
              />

              <DashboardCard
                icon={<FaClipboardList className="text-green-500" />}
                title="Moje ture"
                description="Pregledajte i upravljajte vašim turama"
                link="/my-tours"
                count={tours.length}
                color="border-l-green-500"
              />

              <DashboardCard
                icon={<FaBriefcase className="text-purple-500" />}
                title="Moji zahtevi"
                description="Pregledajte vaše zahteve za transport"
                link="/my-shipments"
                count={shipments.length}
                color="border-l-purple-500"
              />

              <DashboardCard
                icon={<FaPlusCircle className="text-yellow-500" />}
                title="Dodaj vozilo"
                description="Dodajte novo vozilo u vašu flotu"
                link="/add-vehicle"
                color="border-l-yellow-500"
              />

              <DashboardCard
                icon={<FaPlusCircle className="text-red-500" />}
                title="Dodaj turu"
                description="Kreirajte novu turu za prevoz"
                link="/add-tour"
                color="border-l-red-500"
              />
              <DashboardCard
                icon={<FaPlusCircle className="text-green-500" />}
                title="Dodaj zahtev"
                description="Kreirajte novu zahtev za prevoz"
                link="/add-shipment"
                color="border-l-red-500"
              />

              {/* SHOP KARTICA */}
              {hasShop ? (
                <DashboardCard
                  icon={<FaStore className="text-indigo-500" />}
                  title="Upravljaj Radnjom"
                  description="Upravljajte vašim shopom/portfoliom"
                  link="/my-shop"
                  color="border-l-indigo-500"
                />
              ) : (
                <div
                  onClick={() => {
                    // if (vehicles.length === 0) {
                    //   alert(
                    //     "Morate imati bar jedno vozilo da biste kreirali shop!"
                    //   );
                    //   return;
                    // }
                    setShowCreateShop(true);
                  }}
                >
                  <DashboardCard
                    icon={<FaPlusCircle className="text-green-500" />}
                    title="Napravi Radnju"
                    description="Kreirajte svoj shop/portfolio"
                    color="border-l-green-500"
                    onClick={() => {
                      // if (vehicles.length === 0) {
                      //   alert(
                      //     "Morate imati bar jedno vozilo da biste kreirali shop!"
                      //   );
                      //   return;
                      // }
                      setShowCreateShop(true);
                    }}
                  />
                </div>
              )}

              <DashboardCard
                icon={<FaComments className="text-indigo-500" />}
                title="Chat"
                description="Komunicirajte sa drugim korisnicima"
                link="/chat"
                color="border-l-indigo-500"
              />
            </div>
          </div>
        );

      case "profile":
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* ----------- Profilna slika ----------- */}

            <div className="bg-white rounded-xl shadow-md p-6">
              {/* Header */}
              <div className="flex items-center mb-6">
                <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-3">
                  <FaUser className="text-2xl" />
                </div>
                <h2 className="text-lg font-semibold text-gray-800">
                  Profilna slika
                </h2>
              </div>

              {/* Jedinstveni prikaz - ili slika ili upload area */}
              <div className="flex flex-col items-center">
                {user?.profileImage ? (
                  // Prikaz postojeće profilne slike sa "x" za brisanje
                  <div className="relative">
                    <img
                      src={user.profileImage}
                      alt="Profilna"
                      className="w-32 h-32 rounded-full object-cover border-4 border-blue-100"
                    />
                    <button
                      type="button"
                      onClick={handleDeleteProfileImage}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 transition-colors duration-300 hover:bg-red-600"
                      title="Obriši profilnu sliku"
                    >
                      <FaTimes size={14} />
                    </button>
                  </div>
                ) : (
                  // SAMO UPLOAD AREA - bez placeholder-a
                  <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-full p-4 w-32 h-32 transition-colors duration-300 hover:border-blue-400">
                    <label className="cursor-pointer text-center">
                      <FaImage className="mx-auto text-gray-400 text-2xl mb-2 transition-colors duration-300 hover:text-blue-500" />
                      <span className="text-sm text-gray-600 transition-colors duration-300 hover:text-blue-500">
                        Dodaj sliku
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploading}
                        className="hidden"
                        ref={fileInputRef}
                      />
                    </label>
                  </div>
                )}
              </div>

              {/* Status poruke */}
              {uploading && (
                <div className="flex items-center justify-center text-blue-600 mt-4 text-sm">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                  Uploaduje se...
                </div>
              )}
              {uploadMessage && (
                <p
                  className={`text-sm mt-4 text-center ${
                    uploadMessage.includes("❌")
                      ? "text-red-500"
                      : "text-green-500"
                  }`}
                >
                  {uploadMessage}
                </p>
              )}
              <p className="text-xs text-gray-500 mt-2 text-center">
                Preporučena veličina: 300x300px • Max 5MB
              </p>
            </div>

            {/* ----------- Lični podaci ----------- */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-green-100 text-green-600 mr-3">
                    <FaUserCircle className="text-2xl" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    Lični podaci
                  </h2>
                </div>

                {!editingProfile ? (
                  <button
                    onClick={() => setEditingProfile(true)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded flex items-center text-sm"
                  >
                    <FaEdit className="mr-1" /> Izmeni
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleProfileUpdate}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded flex items-center text-sm"
                    >
                      <FaSave className="mr-1" /> Sačuvaj
                    </button>
                    <button
                      onClick={() => {
                        setEditingProfile(false);
                        setProfileData({
                          name: user.name || "",
                          company: user.company || "",
                        });
                        setUploadMessage("");
                      }}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm"
                    >
                      Odustani
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                {/* Ime */}
                <div>
                  <p className="text-sm text-gray-600 flex items-center mb-1">
                    <FaUser className="mr-2 text-blue-500 text-lg" /> Ime
                  </p>
                  {editingProfile ? (
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) =>
                        setProfileData({ ...profileData, name: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                    />
                  ) : (
                    <p className="font-medium text-gray-800">
                      {user?.name || "Nije postavljeno"}
                    </p>
                  )}
                </div>

                {/* Kompanija */}
                <div>
                  <p className="text-sm text-gray-600 flex items-center mb-1">
                    <FaBuilding className="mr-2 text-purple-500 text-lg" />{" "}
                    Kompanija
                  </p>
                  {editingProfile ? (
                    <div className="flex items-center">
                      <input
                        type="text"
                        value={profileData.company}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            company: e.target.value,
                          })
                        }
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                      />
                      {user?.hasCompany && (
                        <button
                          onClick={handleDeleteCompany}
                          className="ml-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded"
                          title="Obriši kompaniju"
                        >
                          <FaTrash />
                        </button>
                      )}
                    </div>
                  ) : (
                    <p className="font-medium text-gray-800">
                      {user?.company || "Nije postavljena"}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <p className="text-sm text-gray-600 flex items-center mb-1">
                    <FaEnvelope className="mr-2 text-pink-500 text-lg" /> Email
                  </p>
                  <p className="font-medium text-gray-800">
                    {user?.email || "Nije postavljen"}
                  </p>
                </div>

                {/* Uloga */}
                <div>
                  <p className="text-sm text-gray-600 flex items-center mb-1">
                    <FaUserTag className="mr-2 text-orange-500 text-lg" /> Uloga
                  </p>
                  <p className="font-medium text-gray-800">
                    {user?.roles?.join(", ") || "Nije postavljena"}
                  </p>
                </div>
              </div>
            </div>

            {/* ----------- Podešavanja ----------- */}
            {/* ----------- Podešavanja ----------- */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center mb-6">
                <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-3">
                  <FaCog className="text-2xl" />
                </div>
                <h2 className="text-lg font-semibold text-gray-800">
                  Podešavanja
                </h2>
              </div>

              <div className="space-y-4">
                {/* Tema */}
                <div>
                  <p className="text-sm text-gray-600 flex items-center mb-2">
                    <FaAdjust className="mr-2 text-pink-500 text-lg" /> Tema
                  </p>
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      className="flex-1 px-3 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 text-sm"
                    >
                      Light
                    </button>
                    <button
                      type="button"
                      className="flex-1 px-3 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 text-sm"
                    >
                      Dark
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "logout":
        return (
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="max-w-md mx-auto">
              <div className="text-red-500 text-5xl mb-4">
                <FaSignOutAlt className="mx-auto" />
              </div>
              <h2 className="text-2xl font-bold mb-4">
                Želite da se odjavite?
              </h2>
              <p className="text-gray-600 mb-6">
                Da li ste sigurni da želite da napustite svoj nalog? Možete se
                ponovo prijaviti u bilo kom trenutku.
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => setActiveTab("overview")}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Nazad na pregled
                </button>
                <button
                  onClick={handleLogout}
                  className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center"
                >
                  <FaSignOutAlt className="mr-2" /> Da, odjavi me
                </button>
              </div>
            </div>
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

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

  // Kreiranje shopa
  const handleCreateShop = async () => {
    // if (vehicles.length === 0) {
    //   alert("Morate imati bar jedno vozilo da biste kreirali shop!");
    //   return;
    // }

    if (!shopName.trim()) {
      alert("Unesite naziv shopa!");
      return;
    }

    if (slugAvailable === false) {
      alert("Izaberite drugi naziv, ovaj je već zauzet!");
      return;
    }

    try {
      const res = await axios.post(
        "/api/shop",
        {
          name: shopName,
          companyName: user.company || user.name,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setHasShop(true);
      setShop(res.data);
      setShowCreateShop(false);
      setShopName("");
      alert("Shop uspešno kreiran!");
      navigate("/my-shop");
    } catch (err) {
      console.error("Greška pri kreiranju shopa:", err);
      alert(err.response?.data?.message || "Greška pri kreiranju shopa");
    }
  };

  // Funkcija za brisanje shopa
  const handleDeleteShop = async () => {
    try {
      const res = await axios.delete(`/api/shop/${shop._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setHasShop(false);
        setShop(null);
        setShowDeleteConfirm(false);
        alert("Shop uspešno obrisan!");
      }
    } catch (err) {
      console.error("Greška pri brisanju shopa:", err);
      alert(err.response?.data?.message || "Greška pri brisanju shopa");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                Dobrodošli, {user?.hasCompany ? user.company : user?.name}!
              </h1>
              <p className="text-gray-600 mt-2">
                {user?.roles?.join(", ") || "Korisnik"}
              </p>
            </div>

            <div className="mt-4 md:mt-0">
              <div className="flex items-center">
                {user?.profileImage ? (
                  <div className="relative">
                    <img
                      src={user.profileImage}
                      alt="Profil"
                      className="w-12 h-12 rounded-full object-cover border-2 border-blue-400 mr-3"
                    />
                  </div>
                ) : (
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-blue-400 flex items-center justify-center text-white font-bold text-xl mr-3">
                      {user?.name?.charAt(0) ||
                        user?.companyName?.charAt(0) ||
                        "K"}
                    </div>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-600">
                    Trenutno prijavljeni kao
                  </p>
                  <p className="font-medium">
                    {user?.hasCompany ? "Kompanija" : "Pojedinac"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-md mb-6 overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab("overview")}
                className={`py-4 px-6 text-center font-medium text-sm border-b-2 transition-colors duration-300 flex items-center ${
                  activeTab === "overview"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <FaChartBar className="mr-2" /> Pregled
              </button>
              <button
                onClick={() => setActiveTab("profile")}
                className={`py-4 px-6 text-center font-medium text-sm border-b-2 transition-colors duration-300 flex items-center ${
                  activeTab === "profile"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <FaUser className="mr-2" /> Profil i Postavke
              </button>
              <button
                onClick={() => setActiveTab("logout")}
                className={`py-4 px-6 text-center font-medium text-sm border-b-2 transition-colors duration-300 flex items-center ${
                  activeTab === "logout"
                    ? "border-red-500 text-red-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <FaSignOutAlt className="mr-1" /> Odjavi se
              </button>
            </nav>
          </div>
        </div>

        {/* Content */}
        {renderTabContent()}

        {/* Quick Stats */}
        {activeTab === "overview" && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-blue-100 text-blue-600 mr-4">
                  <FaCar className="text-2xl" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Ukupno vozila</p>
                  <p className="text-2xl font-bold">{vehicles.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-green-100 text-green-600 mr-4">
                  <FaClipboardList className="text-2xl" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Aktivne ture</p>
                  <p className="text-2xl font-bold">{tours.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-purple-100 text-purple-600 mr-4">
                  <FaBriefcase className="text-2xl" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Aktivni zahtevi</p>
                  <p className="text-2xl font-bold">{shipments.length}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {showCreateShop && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Kreiraj Shop</h2>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Naziv vašeg shopa *
              </label>
              <input
                type="text"
                value={shopName}
                onChange={(e) => {
                  setShopName(e.target.value);
                  checkSlugAvailability(e.target.value);
                }}
                placeholder="npr. premium-transport"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              {slugAvailable !== null && (
                <p
                  className={`text-sm mt-2 ${
                    slugAvailable ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {slugAvailable
                    ? "✓ Naziv je dostupan"
                    : "✗ Naziv je već zauzet, izaberite drugi"}
                </p>
              )}
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowCreateShop(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Otkaži
              </button>
              <button
                onClick={handleCreateShop}
                disabled={!shopName.trim() || slugAvailable === false}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Kreiraj
              </button>
            </div>
          </div>
        </div>
      )}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4 text-red-600">
              Obriši radnju
            </h2>

            <div className="mb-4">
              <p className="text-gray-700">
                Da li ste sigurni da želite da obrišete svoju radnju "
                {shop.name}"? Ova akcija je nepovratna i biće trajno izbrisana.
              </p>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Otkaži
              </button>
              <button
                onClick={handleDeleteShop}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
              >
                Da, obriši radnju
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
