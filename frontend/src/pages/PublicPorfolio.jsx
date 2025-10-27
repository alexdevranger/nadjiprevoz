import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useGlobalState } from "../helper/globalState";
import {
  FaUser,
  FaCar,
  FaBriefcase,
  FaGraduationCap,
  FaLanguage,
  FaEuroSign,
  FaStar,
  FaEnvelope,
  FaPhone,
  FaEye,
  FaArrowLeft,
  FaEdit,
} from "react-icons/fa";

const PublicPortfolio = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [user] = useGlobalState("user");
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    fetchPortfolio();
  }, [slug]);

  const fetchPortfolio = async () => {
    try {
      const response = await axios.get(`/api/portfolio/public/${slug}`);
      if (response.data.success) {
        setPortfolio(response.data.portfolio);

        // Proveri da li je trenutni korisnik vlasnik
        if (user && user.id === response.data.portfolio.userId._id) {
          setIsOwner(true);
        }
      }
    } catch (err) {
      console.error("Greška pri učitavanju portfolija:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleEdit = () => {
    navigate("/driver-portfolio");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!portfolio) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Portfolio nije pronađen
          </h1>
          <p className="text-gray-600">
            Portfolio koji tražite ne postoji ili je deaktiviran.
          </p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("sr-RS");
  };

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
          title="Izmeni portfolio"
        >
          <FaEdit className="mr-2" />
          Izmeni Portfolio
        </button>
      )}

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-slate-800 via-blue-900 to-slate-900 text-white mb-8 pt-4">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            {/* Leva strana - Profilna slika i osnovne informacije */}
            <div className="flex flex-col items-start gap-6">
              <div className="flex items-center gap-6">
                <div className="flex-shrink-0">
                  {portfolio.userId.profileImage ? (
                    <img
                      src={portfolio.userId.profileImage}
                      alt={portfolio.userId.name}
                      className="h-24 w-24 rounded-full object-cover border-4 border-white/20"
                    />
                  ) : (
                    <div className="h-24 w-24 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-3xl border-4 border-white/20">
                      {portfolio.userId.name?.charAt(0) || "V"}
                    </div>
                  )}
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold">
                    {portfolio.userId.name}
                  </h1>
                  <p className="text-gray-300 mt-2">Profesionalni vozač</p>
                </div>
              </div>

              <div className="flex-1">
                {portfolio.aboutMe && (
                  <p className="text-gray-300 leading-relaxed max-w-2xl">
                    {portfolio.aboutMe}
                  </p>
                )}
              </div>
            </div>

            {/* Desna strana - Kontakt i statistika */}
            <div className="flex flex-col gap-4">
              {/* Kontakt informacije */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  Kontakt Informacije
                </h3>
                <div className="space-y-2">
                  {/* Email */}
                  {portfolio.contactInfo?.email && (
                    <div className="flex items-center gap-3 hover:bg-white/5 p-2 rounded-lg transition-colors">
                      <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center">
                        <FaEnvelope className="text-purple-400" />
                      </div>
                      <span className="font-medium">
                        {portfolio.contactInfo.email}
                      </span>
                    </div>
                  )}

                  {/* Telefon */}
                  {portfolio.contactInfo?.phone && (
                    <div className="flex items-center gap-3 hover:bg-white/5 p-2 rounded-lg transition-colors">
                      <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                        <FaPhone className="text-green-400" />
                      </div>
                      <span className="font-medium">
                        {portfolio.contactInfo.phone}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Statistika */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/10 rounded-lg p-3 text-center border border-white/10">
                  <div className="text-2xl font-bold text-blue-400">
                    {portfolio.yearsOfExperience}
                  </div>
                  <div className="text-xs text-gray-300">Godine iskustva</div>
                </div>
                <div className="bg-white/10 rounded-lg p-3 text-center border border-white/10">
                  <div className="text-2xl font-bold text-green-400">
                    {portfolio.vehicles?.length || 0}
                  </div>
                  <div className="text-xs text-gray-300">Vozila</div>
                </div>
                <div className="bg-white/10 rounded-lg p-3 text-center border border-white/10">
                  <div className="text-2xl font-bold text-yellow-400">
                    {portfolio.viewCount}
                  </div>
                  <div className="text-xs text-gray-300">Pregleda</div>
                </div>
                <div className="bg-white/10 rounded-lg p-3 text-center border border-white/10">
                  <div className="text-2xl font-bold text-purple-400">
                    {portfolio.licenseCategories?.length || 0}
                  </div>
                  <div className="text-xs text-gray-300">Kategorije</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ostali sadržaj */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        {/* Osnovne Informacije */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex items-center mb-6">
            <div className="p-3 rounded-full bg-green-100 text-green-600 mr-3">
              <FaBriefcase className="text-2xl" />
            </div>
            <h2 className="text-xl font-semibold">Osnovne Informacije</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Godine iskustva
              </label>
              <p className="text-lg font-medium bg-gray-50 p-3 rounded-lg">
                {portfolio.yearsOfExperience}{" "}
                {portfolio.yearsOfExperience === 1 ? "godina" : "godine"}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dostupnost
              </label>
              <p className="text-lg font-medium bg-gray-50 p-3 rounded-lg capitalize">
                {portfolio.availability?.replace("_", " ") || "dostupan"}
              </p>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kategorije vozačke dozvole
              </label>
              <div className="flex flex-wrap gap-2">
                {portfolio.licenseCategories?.map((license) => (
                  <span
                    key={license}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                  >
                    {license}
                  </span>
                ))}
                {(!portfolio.licenseCategories ||
                  portfolio.licenseCategories.length === 0) && (
                  <span className="text-gray-500 bg-gray-50 p-3 rounded-lg">
                    Nema unetih kategorija
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Vozila */}
        {portfolio.vehicles && portfolio.vehicles.length > 0 && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <div className="flex items-center mb-6">
              <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-3">
                <FaCar className="text-2xl" />
              </div>
              <h2 className="text-xl font-semibold">
                Vozila ({portfolio.vehicles.length})
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {portfolio.vehicles.map((vehicle) => (
                <div
                  key={vehicle._id}
                  className="border rounded-lg p-4 bg-gray-50 hover:shadow-md transition-shadow"
                >
                  <div className="font-medium text-lg mb-2">{vehicle.type}</div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>Registracija: {vehicle.licensePlate}</div>
                    <div>Kapacitet: {vehicle.capacity} kg</div>
                    {vehicle.brand && <div>Marka: {vehicle.brand}</div>}
                    {vehicle.model && <div>Model: {vehicle.model}</div>}
                    {vehicle.year && <div>Godina: {vehicle.year}</div>}
                  </div>
                  {vehicle.description && (
                    <p className="text-gray-600 text-sm mt-3 pt-2 border-t border-gray-200">
                      {vehicle.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Prethodno Iskustvo */}
        {portfolio.previousExperience &&
          portfolio.previousExperience.length > 0 && (
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <div className="flex items-center mb-6">
                <div className="p-3 rounded-full bg-orange-100 text-orange-600 mr-3">
                  <FaBriefcase className="text-2xl" />
                </div>
                <h2 className="text-xl font-semibold">Prethodno Iskustvo</h2>
              </div>

              <div className="space-y-4">
                {portfolio.previousExperience.map((exp, index) => (
                  <div
                    key={index}
                    className="border-l-4 border-blue-500 pl-4 py-2 bg-gray-50 rounded-r-lg"
                  >
                    <div>
                      <h3 className="font-semibold text-lg">{exp.position}</h3>
                      <p className="text-gray-600 font-medium">
                        {exp.companyName}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatDate(exp.startDate)} -{" "}
                        {exp.current ? "Sada" : formatDate(exp.endDate)}
                      </p>
                      {exp.description && (
                        <p className="text-gray-700 mt-2 text-sm">
                          {exp.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        {/* Veštine i Jezici */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Veštine */}
          {portfolio.skills && portfolio.skills.length > 0 && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center mb-6">
                <div className="p-3 rounded-full bg-teal-100 text-teal-600 mr-3">
                  <FaGraduationCap className="text-2xl" />
                </div>
                <h2 className="text-xl font-semibold">Veštine</h2>
              </div>

              <div className="flex flex-wrap gap-2">
                {portfolio.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Jezici */}
          {portfolio.languages && portfolio.languages.length > 0 && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center mb-6">
                <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-3">
                  <FaLanguage className="text-2xl" />
                </div>
                <h2 className="text-xl font-semibold">Jezici</h2>
              </div>

              <div className="space-y-2">
                {portfolio.languages.map((lang, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center bg-gray-50 px-3 py-2 rounded-lg"
                  >
                    <span className="font-medium capitalize">
                      {lang.language}
                    </span>
                    <span className="text-sm text-gray-600 capitalize">
                      {lang.level}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Očekivana Plata */}
        {portfolio.salaryExpectation && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center mb-6">
              <div className="p-3 rounded-full bg-green-100 text-green-600 mr-3">
                <FaEuroSign className="text-2xl" />
              </div>
              <h2 className="text-xl font-semibold">Očekivana Plata</h2>
            </div>
            <p className="text-2xl font-bold text-gray-800">
              {portfolio.salaryExpectation} €
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicPortfolio;
