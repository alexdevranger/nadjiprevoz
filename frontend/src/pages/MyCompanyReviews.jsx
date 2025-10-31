import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaStar,
  FaBuilding,
  FaCalendarAlt,
  FaPen,
  FaSave,
  FaTimes,
} from "react-icons/fa";
import { useGlobalState } from "../helper/globalState";
import { Link } from "react-router-dom";

export default function MyCompanyReviews() {
  const [token] = useGlobalState("token");
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [editData, setEditData] = useState({ rating: 0, comment: "" });

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          error("Sesija je istekla. Molimo prijavite se ponovo.");
          return;
        }
        const res = await axios.get("/api/company-reviews/my", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setReviews(res.data.reviews || []);
      } catch (err) {
        console.error("Greška pri učitavanju ocena:", err);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchReviews();
  }, [token]);

  const handleEditClick = (review) => {
    setEditing(review._id);
    setEditData({ rating: review.rating, comment: review.comment });
  };

  const handleSave = async (id, companyId) => {
    try {
      console.log("Submitting rating:", {
        companyId,
        rating: editData.rating,
        comment: editData.comment,
      });
      const token = localStorage.getItem("token");
      if (!token) {
        error("Sesija je istekla. Molimo prijavite se ponovo.");
        return;
      }
      const res = await axios.post(
        "/api/company-reviews",
        { companyId, rating: editData.rating, comment: editData.comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReviews((prev) =>
        prev.map((r) => (r._id === id ? res.data.review : r))
      );
      setEditing(null);
    } catch (err) {
      console.error("Greška pri čuvanju izmene:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center">
            <FaStar className="text-yellow-500 mr-2" />
            Moje ocene firmi
          </h1>
          <p className="text-gray-600 mt-1">
            Pregled i uređivanje firmi koje ste ocenili.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin h-10 w-10 border-b-2 border-yellow-500 rounded-full mx-auto mb-3"></div>
            <p className="text-gray-600">Učitavanje ocena...</p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center bg-white rounded-xl shadow p-8">
            <FaBuilding className="text-4xl text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">
              Još uvek niste ocenili nijednu firmu.
            </p>
            <Link
              to="/jobs"
              className="mt-4 inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Pogledaj poslove
            </Link>
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
                      <FaBuilding className="text-gray-500 mr-2" />
                      {r.companyId?.companyName || "Nepoznata firma"}
                    </h2>
                    <p className="text-xs text-gray-500 mt-1 flex items-center">
                      <FaCalendarAlt className="mr-1" />
                      {new Date(r.createdAt).toLocaleDateString("sr-RS")}
                    </p>
                  </div>

                  {r.companyId?.logo && (
                    <img
                      src={r.companyId.logo}
                      alt={r.companyId.companyName}
                      className="h-10 w-10 object-contain rounded"
                    />
                  )}
                </div>

                {/* Ocene zvezdice */}
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

                {/* Komentar */}
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

                <div className="mt-4 flex justify-end space-x-2">
                  {editing === r._id ? (
                    <>
                      <button
                        onClick={() => handleSave(r._id, r.companyId._id)}
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

                {r.companyId?.slug && (
                  <div className="mt-3 text-right">
                    <Link
                      to={`/shop/${r.companyId.slug}`}
                      target="_blank"
                      className="text-blue-600 text-sm hover:underline"
                    >
                      Pogledaj profil firme
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
