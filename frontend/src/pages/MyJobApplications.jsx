import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import {
  FaBriefcase,
  FaMapMarkerAlt,
  FaClock,
  FaCheckCircle,
  FaPauseCircle,
  FaArchive,
  FaExternalLinkAlt,
  FaBuilding,
  FaMoneyBillWave,
  FaListUl,
  FaEnvelope,
  FaPhone,
  FaUser,
  FaStar,
  FaArrowLeft,
} from "react-icons/fa";
import { useGlobalState } from "../helper/globalState";
import { useToast } from "../components/ToastContext";
import { useNavigate, Link } from "react-router-dom";

export default function MyJobApplications() {
  const [token] = useGlobalState("token");
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedRatingJob, setSelectedRatingJob] = useState(null);
  const [ratings, setRatings] = useState({}); // { companyId: { rating, comment } }
  const popupRef = useRef();
  const { success, error, warning, info } = useToast();
  const navigate = useNavigate();

  const getStatusColor = (status) => {
    switch (status) {
      case "aktivan":
        return "bg-green-100 text-green-700 border-green-300";
      case "pauziran":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "arhiviran":
        return "bg-gray-100 text-gray-700 border-gray-300";
      default:
        return "bg-blue-100 text-blue-700 border-blue-300";
    }
  };

  const getJobStatusIcon = (status) => {
    switch (status) {
      case "aktivan":
        return <FaCheckCircle className="text-green-500 mr-1" />;
      case "pauziran":
        return <FaPauseCircle className="text-yellow-500 mr-1" />;
      case "arhiviran":
        return <FaArchive className="text-gray-500 mr-1" />;
      default:
        return <FaBriefcase className="text-blue-500 mr-1" />;
    }
  };

  const getApplicationColor = (status) => {
    switch (status) {
      case "na čekanju":
        return "text-yellow-600 bg-yellow-50 border border-yellow-200";
      case "u užem izboru":
        return "text-blue-700 bg-blue-50 border border-blue-200";
      case "prihvaćen":
        return "text-green-700 bg-green-50 border border-green-200";
      case "odbijen":
        return "text-red-700 bg-red-50 border border-red-200";
      default:
        return "text-gray-700 bg-gray-50 border border-gray-200";
    }
  };

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          error("Sesija je istekla. Molimo prijavite se ponovo.");
          return;
        }
        const res = await axios.get("/api/job-applications/my-applications", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setApplications(res.data.applications || []);
      } catch (err) {
        console.error("Greška pri učitavanju prijava:", err);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchApplications();
  }, [token]);

  // zatvaranje popup-a klikom van njega
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setSelectedJob(null);
        setSelectedRatingJob(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleRatingSubmit = async (companyId, rating, comment) => {
    try {
      if (!rating) {
        warning("Molimo izaberite broj zvezdica (1–5)");
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) {
        error("Sesija je istekla. Molimo prijavite se ponovo.");
        return;
      }
      const res = await axios.post(
        "/api/company-reviews",
        { companyId, rating, comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setRatings((prev) => ({
        ...prev,
        [companyId]: res.data.review,
      }));

      success("✅ Uspešno ste sačuvali ocenu firme!");
      setSelectedRatingJob(null);
    } catch (err) {
      console.error("Greška pri čuvanju ocene:", err);
      error("❌ Greška pri čuvanju ocene. Pokušajte ponovo.");
    }
  };

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          error("Sesija je istekla. Molimo prijavite se ponovo.");
          return;
        }
        const companyIds = applications
          .map((a) => a.jobId?.company?._id)
          .filter(Boolean);
        const ratingsData = {};
        for (const id of companyIds) {
          const res = await axios.get(`/api/company-reviews/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.data.review) ratingsData[id] = res.data.review;
        }
        setRatings(ratingsData);
      } catch (err) {
        console.error("Greška pri učitavanju ocena:", err);
      }
    };

    if (applications.length > 0) fetchRatings();
  }, [applications, token]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-md p-6 mb-6 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800 flex items-center">
              <FaBriefcase className="text-orange-500 mr-2" />
              Moje prijave za posao
            </h1>

            <button
              onClick={() => navigate(-1)}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center transition-colors text-sm"
            >
              <FaArrowLeft className="mr-2" />
              Nazad
            </button>
          </div>
          <p className="text-gray-600 mt-1">
            Pregled svih poslova na koje ste aplicirali i status svake prijave.
          </p>

          {/* 💫 Link ka ocenama firmi */}
          <div className="mt-5 flex items-center justify-between bg-gradient-to-r from-yellow-50 via-orange-50 to-pink-50 border border-yellow-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center">
              <div className="bg-yellow-100 p-2 rounded-full mr-3">
                <FaStar className="text-yellow-500 text-xl" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-800">
                  Pogledajte sve svoje ocene firmi
                </h3>
                <p className="text-xs text-gray-600">
                  Pregledajte, izmenite ili dodajte svoje komentare o
                  kompanijama.
                </p>
              </div>
            </div>
            <Link
              to="/my-company-reviews"
              className="ml-4 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm font-medium shadow transition-all flex items-center"
            >
              <FaExternalLinkAlt className="mr-1" />
              Vidi ocene
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin h-10 w-10 border-b-2 border-blue-500 rounded-full mx-auto mb-3"></div>
            <p className="text-gray-600">Učitavanje prijava...</p>
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center bg-white rounded-xl shadow p-8">
            <FaBriefcase className="text-4xl text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">
              Još uvek niste aplicirali ni na jedan oglas.
            </p>
            <Link
              to="/jobs"
              className="mt-4 inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Pogledaj oglase
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {applications.map((app, index) => {
              const job = app.jobId;
              const company = job?.company;
              const ratingData = ratings[company?._id];
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-md border-l-4 border-blue-400 p-5 hover:shadow-lg transition-all"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">
                        {job?.title || "Oglas obrisan"}
                      </h2>
                      <p className="text-sm text-gray-600 flex items-center mt-1">
                        <FaMapMarkerAlt className="mr-1 text-red-500" />
                        {job?.location?.join(", ") || "Nepoznato"}
                      </p>
                      {job?.salary && (
                        <p className="text-sm text-gray-700 mt-1 flex items-center">
                          <FaMoneyBillWave className="mr-1 text-green-500" />
                          {job.salary}
                        </p>
                      )}
                      {job?.employmentType && (
                        <p className="text-xs text-gray-500 mt-1 flex items-center">
                          <FaListUl className="mr-1 text-gray-400" />
                          {job.employmentType}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 mt-1 flex items-center">
                        <FaClock className="mr-1" />
                        {new Date(app.createdAt).toLocaleDateString("sr-RS")}
                      </p>
                    </div>

                    <div className="flex flex-col items-end">
                      <span
                        className={`text-xs font-medium px-3 py-1 rounded-full flex items-center ${getStatusColor(
                          job?.status
                        )}`}
                      >
                        {getJobStatusIcon(job?.status)}
                        {job?.status}
                      </span>

                      {company && (
                        <div className="flex flex-col items-end mt-2">
                          {company.logo && (
                            <img
                              src={company.logo}
                              alt={company.companyName}
                              className="h-8 w-8 object-contain rounded mb-1"
                            />
                          )}
                          <div className="flex items-center text-xs text-gray-600">
                            <FaBuilding className="mr-1 text-gray-400" />
                            {company.companyName}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {app.message && (
                    <div className="mt-3 bg-gray-50 border border-gray-200 rounded-lg p-3">
                      <p className="text-sm text-gray-700 italic">
                        "{app.message}"
                      </p>
                    </div>
                  )}

                  <div className="mt-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getApplicationColor(
                        app.status
                      )}`}
                    >
                      Status prijave: {app.status}
                    </span>
                  </div>

                  <div className="mt-4 flex justify-between items-center">
                    <button
                      onClick={() => setSelectedJob(job)}
                      className="text-blue-600 text-sm hover:underline flex items-center"
                    >
                      <FaExternalLinkAlt className="mr-1" /> Detalji posla
                    </button>

                    {company && (
                      <button
                        onClick={() => setSelectedRatingJob({ job, company })}
                        className="text-yellow-600 text-sm hover:underline flex items-center"
                      >
                        <FaStar className="mr-1" />
                        {ratingData ? "Vidi ocenu firme" : "Oceni firmu"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 🔹 POPUP - DETALJI POSLA */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div
            ref={popupRef}
            className="bg-white rounded-xl shadow-lg max-w-2xl w-full p-6 relative overflow-y-auto max-h-[90vh]"
          >
            <button
              onClick={() => setSelectedJob(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
            >
              ✕
            </button>

            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                  <FaBriefcase className="text-orange-500 mr-2" />
                  {selectedJob.title}
                </h2>
                <p className="text-sm text-gray-600 flex items-center mt-1">
                  <FaMapMarkerAlt className="mr-1 text-red-500" />
                  {selectedJob.location?.join(", ")}
                </p>
              </div>

              {selectedJob.company && (
                <div className="flex flex-col items-end">
                  {selectedJob.company.logo && (
                    <img
                      src={selectedJob.company.logo}
                      alt={selectedJob.company.companyName}
                      className="h-10 w-10 object-contain rounded mb-1"
                    />
                  )}
                  <Link
                    to={`/shop/${selectedJob.company.slug}`}
                    target="_blank"
                    className="text-sm text-blue-600 hover:underline flex items-center"
                  >
                    <FaBuilding className="mr-1" />
                    {selectedJob.company.companyName}
                  </Link>
                </div>
              )}
            </div>

            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-3 ${getStatusColor(
                selectedJob.status
              )}`}
            >
              {getJobStatusIcon(selectedJob.status)}
              {selectedJob.status}
            </span>

            <div className="mt-4 space-y-2">
              {selectedJob.salary && (
                <p className="flex items-center text-gray-700">
                  <FaMoneyBillWave className="mr-2 text-green-500" />
                  <strong>Plata:</strong>&nbsp;{selectedJob.salary}
                </p>
              )}
              {selectedJob.employmentType && (
                <p className="flex items-center text-gray-700">
                  <FaListUl className="mr-2 text-blue-500" />
                  <strong>Tip zaposlenja:</strong>&nbsp;
                  {selectedJob.employmentType}
                </p>
              )}
            </div>

            <div className="mt-4">
              <h3 className="font-semibold text-gray-800 mb-2 flex items-center">
                <FaBriefcase className="mr-2 text-orange-500" /> Opis posla
              </h3>
              <p className="text-gray-700 text-sm whitespace-pre-line">
                {selectedJob.description}
              </p>
            </div>

            {selectedJob.requirements?.length > 0 && (
              <div className="mt-4">
                <h3 className="font-semibold text-gray-800 mb-2 flex items-center">
                  <FaListUl className="mr-2 text-purple-500" /> Uslovi
                </h3>
                <ul className="list-disc ml-6 text-gray-700 text-sm">
                  {selectedJob.requirements.map((req, i) => (
                    <li key={i}>{req}</li>
                  ))}
                </ul>
              </div>
            )}

            {selectedJob.contact && (
              <div className="mt-4">
                <h3 className="font-semibold text-gray-800 mb-2 flex items-center">
                  <FaEnvelope className="mr-2 text-green-500" /> Kontakt
                  informacije
                </h3>
                <p className="text-sm text-gray-700 flex items-center">
                  <FaEnvelope className="mr-2 text-gray-500" />
                  <strong>Email:</strong>&nbsp;
                  {selectedJob.contact.email || "—"}
                </p>
                <p className="text-sm text-gray-700 flex items-center">
                  <FaPhone className="mr-2 text-gray-500" />
                  <strong>Telefon:</strong>&nbsp;
                  {selectedJob.contact.phone || "—"}
                </p>
                {selectedJob.contact.person && (
                  <p className="text-sm text-gray-700 flex items-center">
                    <FaUser className="mr-2 text-gray-500" />
                    <strong>Kontakt osoba:</strong>&nbsp;
                    {selectedJob.contact.person}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 🔹 POPUP - OCENA FIRME */}
      {selectedRatingJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div
            ref={popupRef}
            className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 relative animate-fadeIn"
          >
            <button
              onClick={() => setSelectedRatingJob(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
            >
              ✕
            </button>

            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <FaStar className="text-yellow-500 mr-2" />
              {ratings[selectedRatingJob.company._id]
                ? "Vaša ocena firme"
                : "Ocenite firmu"}
            </h2>

            <RatingForm
              companyId={selectedRatingJob.company._id}
              existingRating={
                ratings[selectedRatingJob.company._id]?.rating || 0
              }
              existingComment={
                ratings[selectedRatingJob.company._id]?.comment || ""
              }
              onSubmit={handleRatingSubmit}
            />
          </div>
        </div>
      )}
    </div>
  );
}
function RatingForm({
  companyId,
  existingRating = 0,
  existingComment = "",
  onSubmit,
}) {
  const [rating, setRating] = useState(existingRating);
  const [comment, setComment] = useState(existingComment);
  const [isChanged, setIsChanged] = useState(false);

  useEffect(() => {
    setRating(existingRating);
    setComment(existingComment);
  }, [existingRating, existingComment]);

  const handleStarClick = (value) => {
    setRating(value);
    setIsChanged(true);
  };

  const handleSave = () => {
    onSubmit(companyId, rating, comment);
    setIsChanged(false);
  };

  return (
    <div>
      <div className="flex mb-4 justify-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <FaStar
            key={star}
            onClick={() => handleStarClick(star)}
            className={`mr-2 text-2xl cursor-pointer transition-colors ${
              star <= rating ? "text-yellow-500" : "text-gray-300"
            }`}
          />
        ))}
      </div>

      <textarea
        value={comment}
        onChange={(e) => {
          setComment(e.target.value);
          setIsChanged(true);
        }}
        placeholder="Kratka napomena o firmi (nije javna)"
        className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-yellow-400"
        rows="3"
      ></textarea>

      <button
        onClick={handleSave}
        disabled={!isChanged}
        className={`mt-3 w-full py-2 rounded-lg text-white transition-colors ${
          isChanged
            ? "bg-yellow-500 hover:bg-yellow-600"
            : "bg-gray-400 cursor-not-allowed"
        }`}
      >
        {existingRating ? "Sačuvaj izmene" : "Sačuvaj ocenu"}
      </button>
    </div>
  );
}
