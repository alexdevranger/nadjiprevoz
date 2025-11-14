import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useGlobalState } from "../helper/globalState";
import { useToast } from "../components/ToastContext";
import {
  FaUser,
  FaCar,
  FaBriefcase,
  FaGraduationCap,
  FaLanguage,
  FaEdit,
  FaSave,
  FaTimes,
  FaPlus,
  FaTrash,
  FaStar,
  FaCheck,
  FaEuroSign,
  FaEye,
  FaArrowLeft,
  FaExternalLinkAlt,
  FaPhone,
  FaEnvelope,
} from "react-icons/fa";
import { useTranslation } from "react-i18next";

export default function DriverPortfolioPage() {
  const [token] = useGlobalState("token");
  const [user] = useGlobalState("user");
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [viewMode, setViewMode] = useState(false);
  const [userVehicles, setUserVehicles] = useState([]);
  const [slugAvailable, setSlugAvailable] = useState(null);
  const { success, error } = useToast();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    yearsOfExperience: 0,
    licenseCategories: [],
    previousExperience: [],
    skills: [],
    languages: [],
    availability: "dostupan",
    preferredJobTypes: [],
    salaryExpectation: "",
    aboutMe: "",
    contactInfo: {
      phone: "",
      email: "",
    },
    vehicles: [],
    slug: "",
  });

  const [newExperience, setNewExperience] = useState({
    companyName: "",
    position: "",
    startDate: "",
    endDate: "",
    description: "",
    current: false,
  });

  const [newLanguage, setNewLanguage] = useState({
    language: "",
    level: "srednji",
  });

  const [newSkill, setNewSkill] = useState("");

  const licenseOptions = ["B", "C", "C1", "C+E", "D", "D1"];
  const languageLevels = ["osnovni", "srednji", "napredni", "maternji"];
  const availabilityOptions = [
    { value: "dostupan", label: "Dostupan" },
    { value: "zauzet", label: "Zauzet" },
    { value: "uskoro_dostupan", label: "Uskoro dostupan" },
  ];

  useEffect(() => {
    fetchPortfolio();
    fetchUserVehicles();
  }, []);
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };
  useEffect(() => {
    console.log("Test prevod:", t("NAĐI PREVOZ"));
  }, [t, i18n.language]);
  useEffect(() => {
    // Automatski ukloni obrisana vozila iz portfolio forme
    if (portfolio && formData.vehicles.length > 0) {
      const validVehicleIds = userVehicles.map((v) => v._id);
      const vehiclesToRemove = formData.vehicles.filter(
        (vehicleId) => !validVehicleIds.includes(vehicleId)
      );

      if (vehiclesToRemove.length > 0) {
        console.log(
          "Automatsko uklanjanje obrisanih vozila:",
          vehiclesToRemove
        );
        setFormData((prev) => ({
          ...prev,
          vehicles: prev.vehicles.filter(
            (vehicleId) => !vehiclesToRemove.includes(vehicleId)
          ),
        }));
      }
    }
  }, [userVehicles, portfolio, formData.vehicles]);

  const fetchPortfolio = async () => {
    try {
      const response = await axios.get("/api/portfolio/my-portfolio", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Portfolio fetch response:", response.data);

      if (response.data.success) {
        if (response.data.portfolio) {
          const portfolioData = response.data.portfolio;

          // ISPRAVLJENO: Pravilno postavljanje vehicles array-a
          let vehicleIds = [];

          if (portfolioData.vehicles && portfolioData.vehicles.length > 0) {
            // Proveri da li su vozila objekti ili ID-ovi
            if (
              typeof portfolioData.vehicles[0] === "object" &&
              portfolioData.vehicles[0]._id
            ) {
              // Ako su objekti, uzmemo samo _id
              vehicleIds = portfolioData.vehicles.map((vehicle) => vehicle._id);
            } else {
              // Ako su već ID-ovi, koristimo ih direktno
              vehicleIds = portfolioData.vehicles;
            }
          }

          console.log("Učitana vozila iz portfolija (ID-ovi):", vehicleIds);

          setPortfolio(portfolioData);
          setFormData({
            ...portfolioData,
            vehicles: vehicleIds, // OVO JE KLJUČNO - postavljamo prave ID-ove
            contactInfo: portfolioData.contactInfo || {
              phone: "",
              email: "",
            },
            slug:
              portfolioData.slug ||
              generateSlug(
                `${portfolioData.firstName || ""} ${
                  portfolioData.lastName || ""
                }`.trim() ||
                  user?.name ||
                  ""
              ),
          });
        } else {
          // Portfolio ne postoji - inicijalizuj prazan formular
          setPortfolio(null);
          setFormData({
            firstName: "",
            lastName: "",
            yearsOfExperience: 0,
            licenseCategories: [],
            previousExperience: [],
            skills: [],
            languages: [],
            availability: "dostupan",
            preferredJobTypes: [],
            salaryExpectation: "",
            aboutMe: "",
            contactInfo: {
              phone: user?.phone || "",
              email: user?.email || "",
            },
            vehicles: [],
            slug: generateSlug(user?.name || ""),
          });
        }
      }
    } catch (err) {
      console.error("Greška pri učitavanju portfolija:", err);
      // Inicijalizuj prazan formular
      setPortfolio(null);
      setFormData({
        firstName: "",
        lastName: "",
        yearsOfExperience: 0,
        licenseCategories: [],
        previousExperience: [],
        skills: [],
        languages: [],
        availability: "dostupan",
        preferredJobTypes: [],
        salaryExpectation: "",
        aboutMe: "",
        contactInfo: {
          phone: user?.phone || "",
          email: user?.email || "",
        },
        vehicles: [],
        slug: generateSlug(user?.name || ""),
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUserVehicles = async () => {
    try {
      const response = await axios.get("/api/vehicles", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserVehicles(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Greška pri učitavanju vozila:", err);
      setUserVehicles([]);
    }
  };

  const generateSlug = (name) => {
    if (!name) return "";
    return name
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  // Provera dostupnosti sluga
  const checkSlugAvailability = async (slug) => {
    if (!slug.trim()) {
      setSlugAvailable(null);
      return;
    }

    try {
      const res = await axios.get(`/api/portfolio/check-slug/${slug}`);
      setSlugAvailable(res.data.available);
    } catch (err) {
      console.error("Greška pri proveri sluga:", err);
      setSlugAvailable(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      console.log("Podaci koji se šalju:", formData);
      console.log("Podaci koji se šalju - VOZILA:", formData.vehicles);
      console.log(
        "Sva korisnička vozila:",
        userVehicles.map((v) => v._id)
      );

      const response = await axios.post("/api/portfolio", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        console.log(
          "Sačuvan portfolio sa vozilima:",
          response.data.portfolio.vehicles
        );
        setPortfolio(response.data.portfolio);
        setEditing(false);
        setViewMode(false);
        success("Portfolio uspešno sačuvan!");
        fetchPortfolio(); // Refresh data
      }
    } catch (err) {
      console.error("Greška pri čuvanju portfolija:", err);
      console.error("Detalji greške:", err.response?.data);
      error("Greška pri čuvanju portfolija");
    } finally {
      setSaving(false);
    }
  };

  const addExperience = () => {
    if (!newExperience.companyName || !newExperience.position) {
      error("Popunite obavezna polja (kompanija i pozicija)");
      return;
    }

    setFormData({
      ...formData,
      previousExperience: [
        ...formData.previousExperience,
        { ...newExperience },
      ],
    });

    setNewExperience({
      companyName: "",
      position: "",
      startDate: "",
      endDate: "",
      description: "",
      current: false,
    });
  };

  const removeExperience = (index) => {
    const updatedExperiences = formData.previousExperience.filter(
      (_, i) => i !== index
    );
    setFormData({ ...formData, previousExperience: updatedExperiences });
  };

  const addLanguage = () => {
    if (!newLanguage.language) {
      error("Unesite jezik");
      return;
    }

    setFormData({
      ...formData,
      languages: [...formData.languages, { ...newLanguage }],
    });

    setNewLanguage({ language: "", level: "srednji" });
  };

  const removeLanguage = (index) => {
    const updatedLanguages = formData.languages.filter((_, i) => i !== index);
    setFormData({ ...formData, languages: updatedLanguages });
  };

  const addSkill = () => {
    const skill = newSkill.trim();
    if (skill && !formData.skills.includes(skill)) {
      setFormData({
        ...formData,
        skills: [...formData.skills, skill],
      });
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((skill) => skill !== skillToRemove),
    });
  };

  const handleLicenseToggle = (license) => {
    const updatedLicenses = formData.licenseCategories.includes(license)
      ? formData.licenseCategories.filter((l) => l !== license)
      : [...formData.licenseCategories, license];

    setFormData({ ...formData, licenseCategories: updatedLicenses });
  };

  const handleVehicleToggle = (vehicleId) => {
    setFormData((prevFormData) => {
      const updatedVehicles = prevFormData.vehicles.includes(vehicleId)
        ? prevFormData.vehicles.filter((id) => id !== vehicleId) // Ukloni ako već postoji
        : [...prevFormData.vehicles, vehicleId]; // Dodaj ako ne postoji

      // Obezbedi da nema duplikata (double check)
      const uniqueVehicles = [...new Set(updatedVehicles)];

      return { ...prevFormData, vehicles: uniqueVehicles };
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("sr-RS");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-mainDarkBG py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white dark:bg-cardBGText rounded-xl shadow-md p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center">
              <button
                onClick={() => navigate("/dashboard")}
                className="mr-4 text-gray-600 hover:text-gray-800 p-2 rounded-lg hover:bg-gray-100 dark:text-white"
              >
                <FaArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
                  {viewMode ? t("Portfolio Preview") : t("My Driver Portfolio")}
                </h1>
                <p className="text-gray-600 mt-2 dark:text-darkText">
                  {viewMode
                    ? t("This is how your portfolio will appear to employers")
                    : portfolio
                    ? t("Manage your professional portfolio")
                    : t(
                        "Create a professional portfolio to stand out to employers"
                      )}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              {!viewMode ? (
                <>
                  {!editing ? (
                    <>
                      <button
                        onClick={() => setEditing(true)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
                      >
                        <FaEdit className="mr-2" />{" "}
                        {portfolio
                          ? t("Edit Portfolio")
                          : t("Create Portfolio")}
                      </button>
                      {portfolio && (
                        <>
                          <button
                            onClick={() => setViewMode(true)}
                            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center"
                          >
                            <FaEye className="mr-2" /> {t("Preview")}
                          </button>
                          <a
                            href={`/#/driver/${portfolio.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center"
                          >
                            <FaExternalLinkAlt className="mr-2" />{" "}
                            {t("Public View")}
                          </a>
                        </>
                      )}
                      <button
                        onClick={() => navigate("/dashboard")}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
                      >
                        {t("Back")}
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center disabled:opacity-50"
                      >
                        <FaSave className="mr-2" />
                        {saving ? t("Saving...") : t("Save")}
                      </button>
                      <button
                        onClick={() => {
                          setEditing(false);
                          setFormData(portfolio || formData);
                        }}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center"
                      >
                        <FaTimes className="mr-2" /> {t("Cancel")}
                      </button>
                    </>
                  )}
                </>
              ) : (
                <>
                  <button
                    onClick={() => setViewMode(false)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
                  >
                    <FaEdit className="mr-2" /> {t("Continue Editing")}
                  </button>
                  <button
                    onClick={() => navigate("/dashboard")}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
                  >
                    {t("Close")}
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Status Badges */}
          <div className="flex flex-wrap gap-3 mt-4">
            {portfolio?.hasPaidPortfolio && (
              <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-4 py-2 rounded-lg inline-flex items-center">
                <FaStar className="mr-2" /> {t("Premium Portfolio")}
              </div>
            )}
            <div
              className={`px-4 py-2 rounded-lg inline-flex items-center ${
                portfolio
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              <FaCheck className="mr-2" />
              {portfolio ? "Portfolio Aktivan" : "Portfolio Nije Kreiran"}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div
          className={`space-y-6 ${
            viewMode ? "pointer-events-none opacity-95" : ""
          }`}
        >
          {/* Kontakt Informacije */}
          <div className="bg-white rounded-xl shadow-md p-6 dark:bg-cardBGText">
            <div className="flex items-center mb-6">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-3">
                <FaUser className="text-2xl" />
              </div>
              <h2 className="text-xl font-semibold dark:text-white">
                {t("Contact Information")}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* IME */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-darkText">
                  {t("First Name")} *
                </label>
                {editing ? (
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                    className="dark:text-white dark:bg-mainDarkBG w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Unesite vaše ime"
                    required
                  />
                ) : (
                  <p className="text-lg font-medium bg-gray-50 p-3 rounded-lg dark:text-white dark:bg-mainDarkBG">
                    {formData.firstName || "Nije postavljeno"}
                  </p>
                )}
              </div>

              {/* PREZIME */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-darkText">
                  {t("Last Name")} *
                </label>
                {editing ? (
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                    className="dark:text-white dark:bg-mainDarkBG w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={t("Enter your last name")}
                    required
                  />
                ) : (
                  <p className="text-lg font-medium bg-gray-50 dark:text-white dark:bg-mainDarkBG p-3 rounded-lg">
                    {formData.lastName || t("Not set")}
                  </p>
                )}
              </div>

              {/* EMAIL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-darkText">
                  {t("Email")} *
                </label>
                {editing ? (
                  <input
                    type="email"
                    value={formData.contactInfo.email}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        contactInfo: {
                          ...formData.contactInfo,
                          email: e.target.value,
                        },
                      })
                    }
                    className="dark:text-white dark:bg-mainDarkBG w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="vas@email.com"
                    required
                  />
                ) : (
                  <p className="text-lg font-medium bg-gray-50 p-3 rounded-lg dark:text-white dark:bg-mainDarkBG">
                    {formData.contactInfo.email || t("Not set")}
                  </p>
                )}
              </div>

              {/* TELEFON */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-darkText">
                  {t("Phone")}
                </label>
                {editing ? (
                  <input
                    type="tel"
                    value={formData.contactInfo.phone}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        contactInfo: {
                          ...formData.contactInfo,
                          phone: e.target.value,
                        },
                      })
                    }
                    className="dark:text-white dark:bg-mainDarkBG w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="+381 64 123 4567"
                  />
                ) : (
                  <p className="dark:text-white dark:bg-mainDarkBG text-lg font-medium bg-gray-50 p-3 rounded-lg">
                    {formData.contactInfo.phone || t("Not set")}
                  </p>
                )}
              </div>

              {/* URL PORTFOLIJA */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-darkText">
                  {t("Portfolio URL")}
                </label>
                {editing ? (
                  <div>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => {
                        const newSlug = e.target.value;
                        setFormData({ ...formData, slug: newSlug });
                        checkSlugAvailability(newSlug);
                      }}
                      className="dark:text-white dark:bg-mainDarkBG w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="ime-prezime"
                    />
                    {slugAvailable !== null && (
                      <p
                        className={`text-sm mt-1 ${
                          slugAvailable ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {slugAvailable
                          ? t("URL is available")
                          : t("URL is taken")}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-1 ">
                      {t("Your portfolio will be available at")}: /driver/
                      {formData.slug}
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <p className="text-lg font-medium bg-gray-50 p-3 rounded-lg flex-1 dark:text-white dark:bg-mainDarkBG">
                      /driver/{formData.slug}
                    </p>
                    {portfolio && (
                      <a
                        href={`/#/driver/${formData.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg"
                        title="Otvori javni portfolio"
                      >
                        <FaExternalLinkAlt />
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* Ostale sekcije ostaju slične kao prethodno, ali bez vehicleType polja */}
          {/* Osnovne Informacije */}
          <div className="bg-white dark:text-white dark:bg-cardBGText rounded-xl shadow-md p-6">
            <div className="flex items-center mb-6">
              <div className="p-3 rounded-full bg-green-100 text-green-600 mr-3">
                <FaBriefcase className="text-2xl" />
              </div>
              <h2 className="text-xl font-semibold">
                {t("Basic Information")}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-darkText">
                  {t("Years of experience")} {editing && "*"}
                </label>
                {editing ? (
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={formData.yearsOfExperience}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        yearsOfExperience: parseInt(e.target.value) || 0,
                      })
                    }
                    className="dark:bg-mainDarkBG dark:text-white w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-lg font-medium bg-gray-50 p-3 rounded-lg dark:bg-mainDarkBG dark:text-white ">
                    {formData.yearsOfExperience || 0}{" "}
                    {formData.yearsOfExperience === 1 ? t("year") : t("years")}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-darkText">
                  {t("Driver's license categories")}
                </label>
                {editing ? (
                  <div className="flex flex-wrap gap-2">
                    {licenseOptions.map((license) => (
                      <label
                        key={license}
                        className="flex items-center space-x-2 bg-gray-100 dark:bg-mainDarkBG dark:text-white px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-200"
                      >
                        <input
                          type="checkbox"
                          checked={formData.licenseCategories.includes(license)}
                          onChange={() => handleLicenseToggle(license)}
                          className="rounded"
                        />
                        <span>{license}</span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {formData.licenseCategories?.map((license) => (
                      <span
                        key={license}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm "
                      >
                        {license}
                      </span>
                    ))}
                    {(!formData.licenseCategories ||
                      formData.licenseCategories.length === 0) && (
                      <span className="text-gray-500 bg-gray-50 p-3 rounded-lg dark:bg-mainDarkBG dark:text-white ">
                        {t("No categories added")}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Moja Vozila sekcija - SA SLIKOM */}
          {userVehicles.length > 0 && (
            <div className="bg-white rounded-xl shadow-md p-6 dark:bg-cardBGText">
              <div className="flex items-center mb-6">
                <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-3 dark:bg-mainDarkBG">
                  <FaCar className="text-2xl" />
                </div>
                <h2 className="text-xl font-semibold dark:text-white">
                  {t("My Vehicles")}
                </h2>
              </div>

              {editing ? (
                <div className="space-y-3">
                  <p className="text-sm text-gray-600 mb-4 dark:text-darkText">
                    {t(
                      "Select vehicles from your list to display in portfolio"
                    )}
                    :
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {userVehicles.map((vehicle) => (
                      <label
                        key={vehicle._id}
                        className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-all duration-200"
                      >
                        <input
                          type="checkbox"
                          checked={formData.vehicles.includes(vehicle._id)}
                          onChange={() => handleVehicleToggle(vehicle._id)}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="flex items-start space-x-3">
                            {/* Prikaz slike vozila */}
                            {vehicle.image1 && (
                              <div className="flex-shrink-0">
                                <img
                                  src={vehicle.image1}
                                  alt={vehicle.type}
                                  className="w-16 h-16 object-cover rounded-lg border"
                                />
                              </div>
                            )}
                            <div className="flex-1">
                              <div className="font-medium text-lg dark:text-white">
                                {vehicle.type}
                              </div>
                              <div className="text-sm text-gray-600 dark:text-white">
                                {vehicle.licensePlate} • {vehicle.capacity}kg
                                {vehicle.brand && ` • ${vehicle.brand}`}
                                {vehicle.model && ` ${vehicle.model}`}
                              </div>
                              {/* DEBUG: Prikaži da li je vozilo selektovano */}
                              <div
                                className={`text-xs mt-1 ${
                                  formData.vehicles.includes(vehicle._id)
                                    ? "text-green-600 font-medium"
                                    : "text-gray-400 dark:text-darkText"
                                }`}
                              >
                                {formData.vehicles.includes(vehicle._id)
                                  ? t("Selected for portfolio")
                                  : t("Not selected")}
                              </div>
                            </div>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {portfolio &&
                  portfolio.vehicles &&
                  portfolio.vehicles.length > 0 ? (
                    formData.vehicles.map((vehicleId) => {
                      // Pronađi kompletne podatke o vozilu prema ID-u
                      const vehicle = userVehicles.find(
                        (v) => v._id === vehicleId
                      );
                      return vehicle ? (
                        <div
                          key={vehicle._id}
                          className="border rounded-lg p-4 bg-gray-50 hover:shadow-md transition-shadow duration-200"
                        >
                          <div className="flex flex-col md:flex-row md:items-start space-y-3 md:space-y-0 md:space-x-4">
                            {/* Slika vozila */}
                            {vehicle.image1 && (
                              <div className="flex-shrink-0">
                                <img
                                  src={vehicle.image1}
                                  alt={vehicle.type}
                                  className="w-24 h-24 md:w-32 md:h-24 object-cover rounded-lg border shadow-sm"
                                />
                              </div>
                            )}

                            <div className="flex-1">
                              <div className="font-medium text-lg mb-2 text-gray-800 dark:text-white">
                                {vehicle.type}
                              </div>
                              <div className="text-sm text-gray-600 space-y-1">
                                <div className="flex items-center">
                                  <span className="font-medium">
                                    {t("Registration")}:
                                  </span>
                                  <span className="ml-2 bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                                    {vehicle.licensePlate}
                                  </span>
                                </div>
                                <div>
                                  <span className="font-medium">
                                    {t("Capacity")}:
                                  </span>
                                  <span className="ml-2">
                                    {vehicle.capacity} kg
                                  </span>
                                </div>
                                {vehicle.brand && vehicle.model && (
                                  <div>
                                    <span className="font-medium">
                                      {t("Vehicle")}:
                                    </span>
                                    <span className="ml-2">
                                      {vehicle.brand} {vehicle.model}
                                    </span>
                                  </div>
                                )}
                                {vehicle.year && (
                                  <div>
                                    <span className="font-medium">
                                      {t("Year")}:
                                    </span>
                                    <span className="ml-2">{vehicle.year}</span>
                                  </div>
                                )}
                                {vehicle.pallets > 0 && (
                                  <div>
                                    <span className="font-medium">
                                      {t("Pallets")}:
                                    </span>
                                    <span className="ml-2">
                                      {vehicle.pallets}
                                    </span>
                                  </div>
                                )}
                              </div>

                              {vehicle.description && (
                                <p className="text-gray-600 text-sm mt-3 pt-2 border-t border-gray-200">
                                  {vehicle.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ) : (
                        // Ako vozilo nije pronađeno (obrisano), prikaži placeholder
                        <div
                          key={vehicleId}
                          className="border rounded-lg p-4 bg-gray-50 border-dashed border-gray-300"
                        >
                          <div className="text-center text-gray-500 py-4">
                            <FaCar className="text-3xl mx-auto mb-2 opacity-50" />
                            <p>{t("Vehicle deleted")}</p>
                            <p className="text-xs mt-1">ID: {vehicleId}</p>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="col-span-2 text-center text-gray-500 py-8 dark:text-darkText">
                      <FaCar className="text-4xl mx-auto mb-3 opacity-30" />
                      <p className="text-lg">
                        {t("No selected vehicles to display")}
                      </p>
                      <p className="text-sm mt-1">
                        {editing
                          ? t("Select vehicles from list above")
                          : t("Add vehicles in edit mode")}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Prethodno Iskustvo */}
          <div className="bg-white rounded-xl shadow-md p-6 dark:bg-cardBGText">
            <div className="flex items-center mb-6">
              <div className="p-3 rounded-full bg-green-100 text-green-600 mr-3">
                <FaBriefcase className="text-2xl" />
              </div>
              <h2 className="text-xl font-semibold dark:text-white">
                {t("Previous Experience")}
              </h2>
            </div>

            {editing && (
              <div className="mb-6 p-4 bg-gray-50 dark:bg-mainDarkBG rounded-lg">
                <h3 className="font-medium mb-3 dark:text-white">
                  {t("Add new experience")}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                  <input
                    type="text"
                    placeholder="Naziv kompanije *"
                    value={newExperience.companyName}
                    onChange={(e) =>
                      setNewExperience({
                        ...newExperience,
                        companyName: e.target.value,
                      })
                    }
                    className="dark:bg-cardBGText dark:text-white border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="Pozicija *"
                    value={newExperience.position}
                    onChange={(e) =>
                      setNewExperience({
                        ...newExperience,
                        position: e.target.value,
                      })
                    }
                    className="dark:bg-cardBGText dark:text-white border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="month"
                    placeholder="Početak"
                    value={newExperience.startDate}
                    onChange={(e) =>
                      setNewExperience({
                        ...newExperience,
                        startDate: e.target.value,
                      })
                    }
                    className="dark:bg-cardBGText dark:text-white border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="flex items-center space-x-3">
                    <input
                      type="month"
                      placeholder="Kraj"
                      value={newExperience.endDate}
                      onChange={(e) =>
                        setNewExperience({
                          ...newExperience,
                          endDate: e.target.value,
                        })
                      }
                      disabled={newExperience.current}
                      className="dark:bg-cardBGText dark:text-white flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                    />
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={newExperience.current}
                        onChange={(e) =>
                          setNewExperience({
                            ...newExperience,
                            current: e.target.checked,
                            endDate: e.target.checked
                              ? ""
                              : newExperience.endDate,
                          })
                        }
                        className="mr-2"
                      />
                      <span className="text-sm dark:text-white">
                        {t("Current")}
                      </span>
                    </label>
                  </div>
                </div>
                <textarea
                  placeholder="Opis posla (opciono)"
                  value={newExperience.description}
                  onChange={(e) =>
                    setNewExperience({
                      ...newExperience,
                      description: e.target.value,
                    })
                  }
                  rows="2"
                  className="dark:bg-cardBGText dark:text-white w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
                />
                <button
                  onClick={addExperience}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
                >
                  <FaPlus className="mr-2" /> {t("Add Experience")}
                </button>
              </div>
            )}

            <div className="space-y-4">
              {formData.previousExperience.map((exp, index) => (
                <div
                  key={index}
                  className="border-l-4 border-blue-500 pl-4 py-2 bg-gray-50 rounded-r-lg"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
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
                    {editing && (
                      <button
                        onClick={() => removeExperience(index)}
                        className="text-red-500 hover:text-red-700 ml-4 p-2"
                        title={t("Delete experience")}
                      >
                        <FaTrash />
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {formData.previousExperience.length === 0 && (
                <p className="text-gray-500 text-center py-4 dark:text-darkText">
                  {editing
                    ? t("Add your first work experience")
                    : t("No work experience entered")}
                </p>
              )}
            </div>
          </div>

          {/* Veštine i Jezici */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Veštine */}
            <div className="bg-white rounded-xl shadow-md p-6 dark:bg-cardBGText">
              <div className="flex items-center mb-6">
                <div className="p-3 rounded-full bg-purple-100 dark:bg-mainDarkBG text-purple-600 mr-3">
                  <FaGraduationCap className="text-2xl" />
                </div>
                <h2 className="text-xl font-semibold dark:text-white">
                  {t("Skills")}
                </h2>
              </div>

              {editing ? (
                <div>
                  <div className="flex mb-3">
                    <input
                      type="text"
                      placeholder="Dodaj novu veštinu"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter" && newSkill.trim()) {
                          addSkill();
                        }
                      }}
                      className="dark:bg-mainDarkBG dark:text-white flex-1 border border-gray-300 rounded-l-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={addSkill}
                      disabled={!newSkill.trim()}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FaPlus />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="dark:bg-mainDarkBG dark:text-white bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center"
                      >
                        {skill}
                        <button
                          onClick={() => removeSkill(skill)}
                          className="ml-2 text-red-500 hover:text-red-700"
                        >
                          <FaTimes size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {formData.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                  {formData.skills.length === 0 && (
                    <span className="text-gray-500 dark:text-darkText">
                      {t("No skills added")}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Jezici */}
            <div className="bg-white dark:bg-cardBGText rounded-xl shadow-md p-6">
              <div className="flex items-center mb-6">
                <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-3">
                  <FaLanguage className="text-2xl" />
                </div>
                <h2 className="text-xl font-semibold dark:text-white">
                  {t("Languages")}
                </h2>
              </div>

              {editing ? (
                <div>
                  <div className="flex mb-3 gap-2">
                    <input
                      type="text"
                      placeholder="Jezik"
                      value={newLanguage.language}
                      onChange={(e) =>
                        setNewLanguage({
                          ...newLanguage,
                          language: e.target.value,
                        })
                      }
                      className="dark:bg-mainDarkBG dark:text-white flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <select
                      value={newLanguage.level}
                      onChange={(e) =>
                        setNewLanguage({
                          ...newLanguage,
                          level: e.target.value,
                        })
                      }
                      className="dark:bg-mainDarkBG dark:text-white border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {languageLevels.map((level) => (
                        <option key={level} value={level}>
                          {level.charAt(0).toUpperCase() + level.slice(1)}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={addLanguage}
                      disabled={!newLanguage.language.trim()}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FaPlus />
                    </button>
                  </div>
                  <div className="space-y-2">
                    {formData.languages.map((lang, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center bg-gray-50 dark:bg-mainDarkBG dark:text-white px-3 py-2 rounded-lg"
                      >
                        <span className="font-medium capitalize">
                          {lang.language}
                        </span>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600 dark:text-white capitalize">
                            {lang.level}
                          </span>
                          <button
                            onClick={() => removeLanguage(index)}
                            className="text-red-500 hover:text-red-700 p-1"
                            title="Obriši jezik"
                          >
                            <FaTrash size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  {formData.languages.map((lang, index) => (
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
                  {formData.languages.length === 0 && (
                    <span className="text-gray-500 dark:text-darkText">
                      Nema unetih jezika
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Dodatne Informacije */}
          <div className="bg-white dark:bg-cardBGText rounded-xl shadow-md p-6">
            <div className="flex items-center mb-6">
              <div className="p-3 rounded-full bg-indigo-100 text-indigo-600 mr-3">
                <FaEuroSign className="text-2xl" />
              </div>
              <h2 className="text-xl font-semibold dark:text-white">
                {t("Additional Information")}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-darkText mb-2">
                  {t("Availability")}
                </label>
                {editing ? (
                  <select
                    value={formData.availability}
                    onChange={(e) =>
                      setFormData({ ...formData, availability: e.target.value })
                    }
                    className="dark:bg-mainDarkBG dark:text-white w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {availabilityOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="text-lg font-medium capitalize dark:text-white">
                    {availabilityOptions.find(
                      (opt) => opt.value === formData.availability
                    )?.label || formData.availability}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-darkText">
                  {t("Salary expectation")} (RSD)
                </label>
                {editing ? (
                  <input
                    type="number"
                    value={formData.salaryExpectation}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        salaryExpectation: e.target.value,
                      })
                    }
                    className="dark:bg-mainDarkBG dark:text-white w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Unesite izraz želje"
                  />
                ) : (
                  <p className="text-lg font-medium dark:text-white">
                    {formData.salaryExpectation
                      ? `${formData.salaryExpectation} €`
                      : t("Not set")}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-darkText">
                  {t("About me")}
                </label>
                {editing ? (
                  <textarea
                    value={formData.aboutMe}
                    onChange={(e) =>
                      setFormData({ ...formData, aboutMe: e.target.value })
                    }
                    rows="4"
                    placeholder="Opisite sebe, vaše profesionalne ciljeve i šta vas čini dobrim vozačem..."
                    className="dark:bg-mainDarkBG dark:text-white w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    maxLength="1000"
                  />
                ) : (
                  <p className="text-gray-700 whitespace-pre-wrap dark:text-white">
                    {formData.aboutMe || t("No description entered") + "."}
                  </p>
                )}
                {editing && (
                  <p className="text-xs text-gray-500 dark:text-darkText mt-1">
                    {formData.aboutMe.length}/1000 {t("characters")}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action za Premium */}
        {!portfolio?.hasPaidPortfolio && !viewMode && portfolio && !editing && (
          <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl shadow-lg p-6 text-white text-center mt-8">
            <FaStar className="text-3xl mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">
              {t("Upgrade to Premium Portfolio!")}
            </h3>
            <p className="mb-4 opacity-90">
              {t(
                "Get more views, featured display and direct employer contacts"
              )}
            </p>
            <button className="bg-white text-purple-600 font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors">
              {t("Upgrade to Premium")} - 9.99€/{t("monthly")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
