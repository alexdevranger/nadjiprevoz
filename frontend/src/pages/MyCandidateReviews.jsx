import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaStar,
  FaUser,
  FaCalendarAlt,
  FaPen,
  FaSave,
  FaTimes,
  FaArrowLeft,
  FaExternalLinkAlt,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useGlobalState } from "../helper/globalState";
import { useToast } from "../components/ToastContext";

export default function MyCandidateReviews() {
  const [reviews, setReviews] = useState([]);
  const [editing, setEditing] = useState(null);
  const [editData, setEditData] = useState({ rating: 0, comment: "" });
  const [token] = useGlobalState("token");
  const navigate = useNavigate();
  const { success, error } = useToast();

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          error("Sesija je istekla. Molimo prijavite se ponovo.");
          return;
        }
        const res = await axios.get("/api/candidate-reviews", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Sačuvana ocena kandidata:", res.data);
        setReviews(res.data.reviews || []);
      } catch (err) {
        console.error("❌ Greška pri učitavanju ocena kandidata:", err);
      }
    };
    if (token) fetchReviews();
  }, [token]);

  const handleEditClick = (r) => {
    setEditing(r._id);
    setEditData({ rating: r.rating, comment: r.comment || "" });
  };

  const handleSave = async (reviewId, applicantId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        error("Sesija je istekla. Molimo prijavite se ponovo.");
        return;
      }
      const res = await axios.post(
        "/api/candidate-reviews",
        {
          applicantId,
          rating: editData.rating,
          comment: editData.comment,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setReviews((prev) =>
        prev.map((r) =>
          r._id === reviewId
            ? { ...r, rating: editData.rating, comment: editData.comment }
            : r
        )
      );

      setEditing(null);
      success("✅ Ocena uspešno sačuvana!");
    } catch (err) {
      console.error("Greška pri čuvanju izmene:", err);
      error("❌ Greška pri čuvanju ocene.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 🔹 Header */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800 flex items-center">
              <FaStar className="text-yellow-500 mr-2" />
              Moje ocene kandidata
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
            Pregled svih kandidata koje ste ocenili i mogućnost izmene ocene.
          </p>
        </div>

        {reviews.length === 0 ? (
          <div className="text-center bg-white rounded-xl shadow p-8">
            <FaUser className="text-4xl text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">
              Još uvek niste ocenili nijednog kandidata.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviews.map((r) => (
              <div
                key={r._id}
                className="bg-white rounded-xl shadow-md border-l-4 border-yellow-400 p-5 hover:shadow-lg transition-all"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 flex items-center">
                      <FaUser className="text-gray-500 mr-2" />
                      {r.applicantId?.name || "Nepoznat kandidat"}
                    </h2>
                    <p className="text-xs text-gray-500 mt-1 flex items-center">
                      <FaCalendarAlt className="mr-1" />
                      {new Date(r.createdAt).toLocaleDateString("sr-RS")}
                    </p>
                  </div>
                </div>

                {/* ⭐ Ocene zvezdice */}
                <div className="flex mt-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                      key={star}
                      className={`mr-1 ${
                        star <= (editing === r._id ? editData.rating : r.rating)
                          ? "text-yellow-500"
                          : "text-gray-300"
                      } ${editing === r._id ? "cursor-pointer" : ""}`}
                      onClick={() =>
                        editing === r._id &&
                        setEditData((prev) => ({ ...prev, rating: star }))
                      }
                    />
                  ))}
                </div>

                {/* 💬 Komentar */}
                {editing === r._id ? (
                  <textarea
                    value={editData.comment}
                    onChange={(e) =>
                      setEditData((prev) => ({
                        ...prev,
                        comment: e.target.value,
                      }))
                    }
                    className="w-full border border-gray-300 rounded-lg p-2 text-sm mt-3 focus:ring-2 focus:ring-yellow-400"
                    rows="3"
                  ></textarea>
                ) : (
                  <p className="text-sm text-gray-700 italic mt-2">
                    {r.comment || "Bez komentara"}
                  </p>
                )}

                {/* 🔘 Dugmad */}
                <div className="mt-4 flex justify-end space-x-2">
                  {editing === r._id ? (
                    <>
                      <button
                        onClick={() =>
                          handleSave(r._id, r.applicantId?._id || r.applicantId)
                        }
                        className="flex items-center bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg text-sm"
                      >
                        <FaSave className="mr-1" /> Sačuvaj
                      </button>
                      <button
                        onClick={() => setEditing(null)}
                        className="flex items-center bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded-lg text-sm"
                      >
                        <FaTimes className="mr-1" /> Otkaži
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleEditClick(r)}
                      className="flex items-center bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-lg text-sm"
                    >
                      <FaPen className="mr-1" /> Izmeni
                    </button>
                  )}
                </div>

                {/* 🔗 Link ka profilu kandidata */}
                {r.applicantId?.portfolio?.slug && (
                  <div className="mt-3 text-right">
                    <Link
                      to={`/driver/${r.applicantId.portfolio.slug}`}
                      target="_blank"
                      className="text-blue-600 text-sm hover:underline flex items-center justify-end"
                    >
                      <FaExternalLinkAlt className="mr-1" />
                      Pogledaj profil kandidata
                    </Link>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
