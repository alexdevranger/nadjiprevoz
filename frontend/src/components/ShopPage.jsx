import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
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
} from "react-icons/fa";

const ShopPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [shop, setShop] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);

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

  const borderColors = [
    "border-l-blue-500 text-blue-500",
    "border-l-green-500 text-green-500",
    "border-l-red-500 text-red-500",
    "border-l-yellow-500 text-yellow-500",
    "border-l-purple-500 text-purple-500",
    "border-l-pink-500 text-pink-500",
  ];

  const getRandomColor = (index) => borderColors[index % borderColors.length];

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

  const contact = shop.contact || {};
  const socialMedia = shop.socialMedia || {};
  const services = shop.services || [];
  const specialization = shop.specialization || "";

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
      </div>
    </div>
  );
};

export default ShopPage;
