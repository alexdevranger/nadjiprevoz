import React, { useState, useEffect } from "react";
import axios from "axios";
import { useGlobalState } from "../helper/globalState";
import { useNavigate } from "react-router-dom";
import { useToast } from "../components/ToastContext";
import {
  FaPlus,
  FaUserTie,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaBriefcase,
  FaEnvelope,
  FaPhone,
  FaUser,
  FaStickyNote,
  FaArrowLeft,
  FaTrash,
} from "react-icons/fa";

export default function AddJob() {
  const navigate = useNavigate();
  const [token] = useGlobalState("token");
  const [user] = useGlobalState("user");
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(false);
  const { success, error } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    position: "",
    location: [""],
    salary: "",
    contact: {
      email: "",
      phone: "",
      person: "",
    },
    employmentType: "Puno radno vreme",
    description: "",
    requirements: [""],
    company: "",
  });

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const res = await axios.get("/api/shop/my-shop", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setShops(Array.isArray(res.data) ? res.data : [res.data]);
      } catch (err) {
        console.error("Greška pri učitavanju radnji:", err);
        setShops([]);
      }
    };

    fetchShops();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      contact: {
        ...prev.contact,
        [name]: value,
      },
    }));
  };

  const handleLocationChange = (index, value) => {
    const newLocations = [...formData.location];
    newLocations[index] = value;
    setFormData((prev) => ({
      ...prev,
      location: newLocations,
    }));
  };

  const addLocation = () => {
    setFormData((prev) => ({
      ...prev,
      location: [...prev.location, ""],
    }));
  };

  const removeLocation = (index) => {
    if (formData.location.length > 1) {
      const newLocations = formData.location.filter((_, i) => i !== index);
      setFormData((prev) => ({
        ...prev,
        location: newLocations,
      }));
    }
  };

  const handleRequirementChange = (index, value) => {
    const newRequirements = [...formData.requirements];
    newRequirements[index] = value;
    setFormData((prev) => ({
      ...prev,
      requirements: newRequirements,
    }));
  };

  const addRequirement = () => {
    setFormData((prev) => ({
      ...prev,
      requirements: [...prev.requirements, ""],
    }));
  };

  const removeRequirement = (index) => {
    if (formData.requirements.length > 1) {
      const newRequirements = formData.requirements.filter(
        (_, i) => i !== index
      );
      setFormData((prev) => ({
        ...prev,
        requirements: newRequirements,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Filtriraj prazne lokacije i uslove
      const submitData = {
        ...formData,
        location: formData.location.filter((loc) => loc.trim() !== ""),
        requirements: formData.requirements.filter((req) => req.trim() !== ""),

        company: formData.company || null, //????ovo treba popraviti
      };
      console.log("📤 Šaljem podatke:", submitData);

      await axios.post("/api/jobs", submitData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      success("Oglas za posao uspešno dodat");
      setTimeout(() => navigate("/my-jobs"), 1000);
    } catch (err) {
      console.error(err);
      error("Greška prilikom dodavanja oglasa");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 flex items-center">
            <FaUserTie className="mr-3 text-[#adadad]" />
            Dodaj oglas za posao
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Osnovne informacije */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center">
                    <FaBriefcase className="mr-2 text-[#adadad]" />
                    Naslov oglasa *
                  </div>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#adadad]"
                  placeholder="npr. Tražim vozača kamiona"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center">
                    <FaUserTie className="mr-2 text-blue-500" />
                    Pozicija *
                  </div>
                </label>
                <input
                  type="text"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#adadad]"
                  placeholder="npr. Vozač kamiona"
                  required
                />
              </div>
            </div>

            {/* Lokacije */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center">
                  <FaMapMarkerAlt className="mr-2 text-[#adadad]" />
                  Lokacije *
                </div>
              </label>
              {formData.location.map((location, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={location}
                    onChange={(e) =>
                      handleLocationChange(index, e.target.value)
                    }
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#adadad]"
                    placeholder="Unesi lokaciju"
                    required
                  />
                  {formData.location.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeLocation(index)}
                      className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition-colors"
                    >
                      <FaTrash />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addLocation}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center"
              >
                <FaPlus className="mr-2" />
                Dodaj lokaciju
              </button>
            </div>

            {/* Plata i tip zaposlenja */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center">
                    <FaMoneyBillWave className="mr-2 text-green-500" />
                    Plata *
                  </div>
                </label>
                <input
                  type="text"
                  name="salary"
                  value={formData.salary}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#adadad]"
                  placeholder="npr. 1200-1500€"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center">
                    <FaBriefcase className="mr-2 text-purple-500" />
                    Tip zaposlenja *
                  </div>
                </label>
                <select
                  name="employmentType"
                  value={formData.employmentType}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#adadad]"
                  required
                >
                  <option value="Puno radno vreme">Puno radno vreme</option>
                  <option value="Skraćeno radno vreme">
                    Skraćeno radno vreme
                  </option>
                  <option value="Ugovor">Ugovor</option>
                  <option value="Praksa">Praksa</option>
                  <option value="Privremeno">Privremeno</option>
                  <option value="Temporary">Temporary</option>
                </select>
              </div>
            </div>

            {/* Kontakt informacije */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center">
                    <FaUser className="mr-2 text-blue-500" />
                    Kontakt osoba
                  </div>
                </label>
                <input
                  type="text"
                  name="person"
                  value={formData.contact.person}
                  onChange={handleContactChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#adadad]"
                  placeholder="Ime i prezime"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center">
                    <FaPhone className="mr-2 text-green-500" />
                    Kontakt telefon
                  </div>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.contact.phone}
                  onChange={handleContactChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#adadad]"
                  placeholder="+381 6x xxx xxxx"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center">
                    <FaEnvelope className="mr-2 text-purple-500" />
                    Email
                  </div>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.contact.email}
                  onChange={handleContactChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#adadad]"
                  placeholder="email@primer.com"
                />
              </div>
            </div>

            {/* Kompanija */}
            {shops.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kompanija
                </label>
                <select
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#adadad]"
                >
                  <option value="">-- Izaberi kompaniju --</option>
                  {shops.map((shop) => (
                    <option key={shop._id} value={shop._id}>
                      {shop.companyName || shop.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Opis posla */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center">
                  <FaStickyNote className="mr-2 text-[#adadad]" />
                  Opis posla *
                </div>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#adadad]"
                placeholder="Opisite detalje posla, odgovornosti, uslove..."
                required
              />
            </div>

            {/* Uslovi */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Uslovi
              </label>
              {formData.requirements.map((requirement, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={requirement}
                    onChange={(e) =>
                      handleRequirementChange(index, e.target.value)
                    }
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#adadad]"
                    placeholder="npr. B kategorija sa CE"
                  />
                  {formData.requirements.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeRequirement(index)}
                      className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition-colors"
                    >
                      <FaTrash />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addRequirement}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center"
              >
                <FaPlus className="mr-2" />
                Dodaj uslov
              </button>
            </div>

            {/* Dugmad */}
            <div className="flex justify-between gap-4 pt-6">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-3 rounded-lg flex items-center justify-center transition-colors w-full"
              >
                <FaArrowLeft className="mr-2" />
                Odustani
              </button>

              <button
                type="submit"
                disabled={loading}
                className="bg-[#adadad] hover:bg-[#939393] text-white px-6 py-3 rounded-lg flex items-center justify-center disabled:opacity-50 transition-colors w-full"
              >
                {loading ? (
                  "Dodavanje..."
                ) : (
                  <>
                    <FaPlus className="mr-2" />
                    Dodaj oglas
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
