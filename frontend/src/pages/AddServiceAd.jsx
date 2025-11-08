import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useGlobalState } from "../helper/globalState";
import { useToast } from "../components/ToastContext";
import {
  FaWrench,
  FaCity,
  FaMapMarkerAlt,
  FaPhone,
  FaImage,
  FaHome,
  FaInfoCircle,
  FaArrowLeft,
  FaPlus,
  FaRegFileAlt,
} from "react-icons/fa";

export default function AddServiceAd() {
  const navigate = useNavigate();
  const [token] = useGlobalState("token");
  const { success, error } = useToast();

  const [formData, setFormData] = useState({
    serviceName: "",
    type: "",
    city: "",
    adresa: "",
    telefon1: "",
    telefon2: "",
    lokacija: { lat: "", lng: "" },
    banner: null,
    description: "",
  });

  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (["lat", "lng"].includes(name)) {
      setFormData({
        ...formData,
        lokacija: { ...formData.lokacija, [name]: value },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, banner: e.target.files[0] });
    }
  };

  const removeImage = () => {
    setFormData({ ...formData, banner: null });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key === "lokacija") {
          data.append("lokacija", JSON.stringify(formData.lokacija));
        } else if (key !== "banner") {
          data.append(key, formData[key]);
        }
      });
      if (formData.banner) data.append("banner", formData.banner);

      const res = await axios.post("/api/service-ads", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Dodat servis:", res.data);
      success("Servis uspešno dodat!");
      navigate("/my-ads");
    } catch (err) {
      console.error(err);
      error("Greška pri dodavanju servisa");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
            Dodaj novi servis
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Naziv servisa */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <div className="flex items-center">
                    <FaWrench className="mr-2 text-blue-500" />
                    Naziv servisa *
                  </div>
                </label>
                <input
                  name="serviceName"
                  placeholder="npr. AutoBole"
                  value={formData.serviceName}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>

              {/* Tip servisa */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <div className="flex items-center">
                    <FaInfoCircle className="mr-2 text-green-500" />
                    Tip servisa *
                  </div>
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                >
                  <option value="">Odaberi tip</option>
                  <option value="Mehaničar">Mehaničar</option>
                  <option value="Vulkanizer">Vulkanizer</option>
                  <option value="Električar">Električar</option>
                  <option value="Limar">Limar</option>
                  <option value="Auto perionica">Auto perionica</option>
                </select>
              </div>

              {/* Grad */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <div className="flex items-center">
                    <FaCity className="mr-2 text-purple-500" />
                    Grad *
                  </div>
                </label>
                <input
                  name="city"
                  placeholder="npr. Aranđelovac"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>

              {/* Adresa */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <div className="flex items-center">
                    <FaHome className="mr-2 text-orange-500" />
                    Adresa *
                  </div>
                </label>
                <input
                  name="adresa"
                  placeholder="npr. Volgina 23"
                  value={formData.adresa}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>

              {/* Telefon 1 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <div className="flex items-center">
                    <FaPhone className="mr-2 text-green-600" />
                    Kontakt telefon 1 *
                  </div>
                </label>
                <input
                  name="telefon1"
                  placeholder="06457412458"
                  value={formData.telefon1}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>

              {/* Telefon 2 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <div className="flex items-center">
                    <FaPhone className="mr-2 text-blue-600" />
                    Kontakt telefon 2
                  </div>
                </label>
                <input
                  name="telefon2"
                  placeholder="06358512458"
                  value={formData.telefon2}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>

              {/* Lokacija */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <div className="flex items-center">
                    <FaMapMarkerAlt className="mr-2 text-red-500" />
                    Latitude
                  </div>
                </label>
                <input
                  name="lat"
                  type="number"
                  step="any"
                  placeholder="npr. 44.308"
                  value={formData.lokacija.lat}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <div className="flex items-center">
                    <FaMapMarkerAlt className="mr-2 text-red-500" />
                    Longitude
                  </div>
                </label>
                <input
                  name="lng"
                  type="number"
                  step="any"
                  placeholder="npr. 20.553"
                  value={formData.lokacija.lng}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>

              {/* Opis servisa */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <div className="flex items-center">
                    <FaRegFileAlt className="mr-2 text-indigo-500" />
                    Opis servisa
                  </div>
                </label>
                <textarea
                  name="description"
                  placeholder="Ukratko opišite svoj servis i usluge koje nudite..."
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
                />
              </div>

              {/* Upload banera */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <div className="flex items-center">
                    <FaImage className="mr-2 text-[#BA68C8]" />
                    Baner (360x160px)
                  </div>
                </label>
                {formData.banner ? (
                  <div className="relative">
                    <img
                      src={URL.createObjectURL(formData.banner)}
                      alt="Preview"
                      className="h-40 w-full object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 h-40 hover:border-blue-400 transition">
                    <label className="cursor-pointer text-center">
                      <FaImage className="mx-auto text-gray-400 text-2xl mb-2 hover:text-blue-500" />
                      <span className="text-sm text-gray-600 hover:text-blue-500">
                        Dodaj baner
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}
              </div>
            </div>

            {/* Dugmad */}
            <div className="flex justify-between gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-3 rounded-lg flex items-center justify-center transition-colors duration-300 w-full"
              >
                <FaArrowLeft className="mr-2" />
                Odustani
              </button>

              <button
                type="submit"
                disabled={uploading}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center justify-center disabled:opacity-50 transition-colors duration-300 w-full"
              >
                {uploading ? (
                  "Dodavanje..."
                ) : (
                  <>
                    <FaPlus className="mr-2" /> Dodaj oglas
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
