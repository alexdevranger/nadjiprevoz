import React, { useEffect, useState } from "react";
import axios from "axios";
import { useGlobalState } from "../helper/globalState";
import { useToast } from "../components/ToastContext";
import ConfirmModal from "../components/ConfirmModal";
import { Link, useNavigate } from "react-router-dom";
import {
  FaCar,
  FaEdit,
  FaTrash,
  FaPlus,
  FaFilter,
  FaImage,
  FaTimes,
  FaWeightHanging,
  FaCalendarAlt,
  FaRulerCombined,
  FaPallet,
  FaSyncAlt,
  FaArrowLeft,
} from "react-icons/fa";

export default function MyVehicles() {
  const [token] = useGlobalState("token");
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [editForm, setEditForm] = useState({
    type: "",
    capacity: "",
    licensePlate: "",
    year: "",
    description: "",
    pallets: "",
    dimensions: { length: "", width: "", height: "" },
    image1: null,
    image2: null,
    existingImage1: "",
    existingImage2: "",
  });

  const [filterType, setFilterType] = useState("");
  const [saving, setSaving] = useState(false);
  const { success, error, warning, info } = useToast();
  const [confirmModal, setConfirmModal] = useState({
    open: false,
    title: "",
    message: "",
    onConfirm: null,
    type: "warning",
    isLoading: false,
  });
  const navigate = useNavigate();

  const showConfirmModal = ({
    title,
    message,
    onConfirm,
    type = "warning",
  }) => {
    setConfirmModal({
      open: true,
      title,
      message,
      onConfirm,
      type,
      isLoading: false,
    });
  };

  const closeConfirmModal = () => {
    setConfirmModal({
      open: false,
      title: "",
      message: "",
      onConfirm: null,
      type: "warning",
      isLoading: false,
    });
  };

  const handleConfirm = async () => {
    if (confirmModal.onConfirm) {
      setConfirmModal((prev) => ({ ...prev, isLoading: true }));
      try {
        await confirmModal.onConfirm();
        closeConfirmModal();
      } catch (error) {
        console.error("Greška pri potvrdi:", error);
        setConfirmModal((prev) => ({ ...prev, isLoading: false }));
      }
    }
  };

  const fetchVehicles = async () => {
    try {
      const token = localStorage.getItem("token");

      // Proveri da li token postoji
      if (!token) {
        console.error("Token nije pronađen");
        // Redirect to login ili pokaži error
        return;
      }
      const res = await axios.get("/api/vehicles", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVehicles(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Greška pri učitavanju vozila:", err);
      error("Greška pri učitavanju vozila");
      // setVehicles([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteVehicle = async (id) => {
    showConfirmModal({
      title: "Obriši vozilo",
      message:
        "Da li ste sigurni da želite da obrišete ovo vozilo? Ova akcija je nepovratna.",
      type: "danger",
      onConfirm: async () => {
        try {
          const token = localStorage.getItem("token");
          if (!token) {
            error("Sesija je istekla. Molimo prijavite se ponovo.");
            return;
          }

          await axios.delete(`/api/vehicles/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          success("Vozilo uspešno obrisano!");
          fetchVehicles();
        } catch (err) {
          console.error("Greška pri brisanju vozila:", err);
          error("Greška pri brisanju vozila");
          throw err; // Ovo će zaustaviti isLoading state
        }
      },
    });
  };

  const startEditing = (vehicle) => {
    setEditingVehicle(vehicle._id);
    setEditForm({
      type: vehicle.type,
      capacity: vehicle.capacity,
      licensePlate: vehicle.licensePlate,
      year: vehicle.year || "",
      description: vehicle.description || "",
      pallets: vehicle.pallets || "",
      dimensions: {
        length: vehicle.dimensions?.length || "",
        width: vehicle.dimensions?.width || "",
        height: vehicle.dimensions?.height || "",
      },
      image1: null,
      image2: null,
      existingImage1: vehicle.image1 || "",
      existingImage2: vehicle.image2 || "",
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    if (["length", "width", "height"].includes(name)) {
      setEditForm({
        ...editForm,
        dimensions: { ...editForm.dimensions, [name]: value },
      });
    } else {
      setEditForm({ ...editForm, [name]: value });
    }
  };

  const handleImageChange = async (e, imageField, vehicleId) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);

      // Ažuriraj lokalno stanje odmah
      setEditForm({
        ...editForm,
        [imageField]: file,
        [`existing${imageField.charAt(0).toUpperCase() + imageField.slice(1)}`]:
          imageUrl,
      });

      // Automatski pošalji na server
      // await saveImage(file, imageField, vehicleId);
    }
  };

  const removeImage = async (imageField, vehicleId) => {
    try {
      const token = localStorage.getItem("token");

      // Proveri da li token postoji
      if (!token) {
        console.error("Token nije pronađen");
        // Redirect to login ili pokaži error
        return;
      }
      // Šalji zahtev backendu da obriše sliku
      await axios.delete(`/api/vehicles/${vehicleId}/image`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { imageField },
      });

      // Ažuriraj lokalno stanje
      setEditForm({
        ...editForm,
        [imageField]: null,
        [`existing${imageField.charAt(0).toUpperCase() + imageField.slice(1)}`]:
          "",
      });
      success("Slika uspešno obrisana!");
      // Osveži podatke
      fetchVehicles();
    } catch (err) {
      console.error("Greška pri brisanju slike:", err);
      error("Greška pri brisanju slike");
    }
  };

  const saveImage = async (file, imageField, vehicleId) => {
    const formData = new FormData();
    formData.append(imageField, file);

    try {
      const token = localStorage.getItem("token");

      // Proveri da li token postoji
      if (!token) {
        console.error("Token nije pronađen");
        // Redirect to login ili pokaži error
        return;
      }
      await axios.put(`/api/vehicles/${vehicleId}/image`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      // Osveži podatke nakon uspešnog uploada
      fetchVehicles();
    } catch (err) {
      console.error("Greška pri čuvanju slike:", err);
      alert("Greška pri čuvanju slike");
    }
  };

  // const saveEdit = async (id) => {
  //   setSaving(true);
  //   try {
  //     const formData = new FormData();

  //     // Dodaj sve podatke u formData
  //     Object.keys(editForm).forEach((key) => {
  //       if (key === "dimensions") {
  //         formData.append("dimensions", JSON.stringify(editForm.dimensions));
  //       } else if (
  //         key !== "image1" &&
  //         key !== "image2" &&
  //         key !== "existingImage1" &&
  //         key !== "existingImage2"
  //       ) {
  //         formData.append(key, editForm[key]);
  //       }
  //     });

  //     await axios.put(`/api/vehicles/${id}`, formData, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //         "Content-Type": "multipart/form-data",
  //       },
  //     });

  //     setEditingVehicle(null);
  //     fetchVehicles();
  //   } catch (err) {
  //     console.error("Greška pri izmeni vozila:", err);
  //     alert("Greška pri izmeni vozila");
  //   } finally {
  //     setSaving(false);
  //   }
  // };
  const saveEdit = async (id) => {
    setSaving(true);
    try {
      const formData = new FormData();

      // Dodaj sve podatke u formData
      Object.keys(editForm).forEach((key) => {
        if (key === "dimensions") {
          formData.append("dimensions", JSON.stringify(editForm.dimensions));
        } else if (
          key !== "image1" &&
          key !== "image2" &&
          key !== "existingImage1" &&
          key !== "existingImage2"
        ) {
          formData.append(key, editForm[key]);
        }
      });

      // Dodaj specijalne flagove za obrisane slike
      if (editForm.existingImage1 === "") {
        formData.append("removeImage1", "true");
      }
      if (editForm.existingImage2 === "") {
        formData.append("removeImage2", "true");
      }

      // Dodaj slike ako postoje
      if (editForm.image1 instanceof File) {
        formData.append("image1", editForm.image1);
      }
      if (editForm.image2 instanceof File) {
        formData.append("image2", editForm.image2);
      }

      const token = localStorage.getItem("token");

      // Proveri da li token postoji
      if (!token) {
        console.error("Token nije pronađen");
        // Redirect to login ili pokaži error
        return;
      }

      await axios.put(`/api/vehicles/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      success("Vozilo uspešno ažurirano!");
      setEditingVehicle(null);
      fetchVehicles();
    } catch (err) {
      console.error("Greška pri izmeni vozila:", err);
      error("Greška pri izmeni vozila");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchVehicles();
    }
  }, [token]);

  // Filtrirana lista
  const filteredVehicles = filterType
    ? vehicles.filter((v) => v.type === filterType)
    : vehicles;

  // Uzimamo sve tipove vozila iz podataka (unikatne)
  const uniqueTypes = [...new Set(vehicles.map((v) => v.type))];

  const handleResetFilters = () => {
    setFilterType("");
  };

  // Funkcija za generisanje nasumične boje za border
  const getRandomBorderColor = (index) => {
    const colors = [
      "border-blue-500",
      "border-green-500",
      "border-purple-500",
      "border-yellow-500",
      "border-indigo-500",
      "border-pink-500",
      "border-red-500",
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center">
                Moja Vozila
                <span className="ml-3 text-lg font-medium text-blue-400 border-l-2 border-gray-300 pl-3">
                  {vehicles.length} vozila
                </span>
              </h1>

              <p className="text-gray-600 mt-2">
                Upravljajte svojim vozilima i njihovim specifikacijama
              </p>
            </div>
            <div className="flex items-center mt-4 md:mt-0">
              {/* <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full mr-3">
                {vehicles.length} vozila
              </span> */}
              {/* Dugme NAZAD */}
              <button
                onClick={() => navigate(-1)} // Vrati se na prethodnu stranicu
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center transition-colors text-base mr-2"
              >
                <FaArrowLeft className="mr-2" />
                Nazad
              </button>
              <Link to="/add-vehicle">
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center transition-colors text-base">
                  <FaPlus className="mr-2" />
                  Dodaj novo vozilo
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Filteri */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <FaFilter className="text-blue-500 mr-2" />
            Filteri
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Tip vozila filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <FaCar className="text-green-500 mr-2" />
                Tip vozila
              </label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Svi tipovi</option>
                {uniqueTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Reset filtera */}
            <div className="flex items-end">
              <button
                onClick={handleResetFilters}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center transition-colors w-full h-[42px] text-base"
              >
                <FaSyncAlt className="mr-2" />
                Reset filtera
              </button>
            </div>
          </div>
        </div>

        {/* Lista vozila */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className="text-gray-600 mt-4">Učitavanje vozila...</p>
            </div>
          ) : filteredVehicles.length === 0 ? (
            <div className="p-8 text-center">
              <FaCar className="text-4xl text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">
                {filterType
                  ? `Nema vozila tipa ${filterType}`
                  : "Trenutno nema dostupnih vozila."}
              </p>
              <Link to="/add-vehicle" className="mt-4 inline-block">
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors">
                  Dodaj prvo vozilo
                </button>
              </Link>
            </div>
          ) : (
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVehicles.map((vehicle, index) => (
                <div
                  key={vehicle._id}
                  className={`relative border-l-4 ${getRandomBorderColor(
                    index
                  )} rounded-xl shadow-md p-5 flex flex-col justify-between transition-all duration-300 hover:shadow-lg hover:translate-y-[-2px] bg-white`}
                  style={{ minHeight: "320px" }}
                >
                  {editingVehicle === vehicle._id ? (
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-gray-800 mb-4">
                        Izmena vozila
                      </h3>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                            <FaCar className="text-blue-500 mr-2" />
                            Tip vozila
                          </label>
                          <select
                            name="type"
                            value={editForm.type}
                            onChange={handleEditChange}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="Kamion">Kamion</option>
                            <option value="Kombi">Kombi</option>
                            <option value="Šleper">Šleper</option>
                            <option value="Dostavno vozilo">
                              Dostavno vozilo
                            </option>
                            <option value="Hladnjača">Hladnjača</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                            <FaCar className="text-green-500 mr-2" />
                            Registarska oznaka
                          </label>
                          <input
                            name="licensePlate"
                            value={editForm.licensePlate}
                            onChange={handleEditChange}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                            <FaWeightHanging className="text-purple-500 mr-2" />
                            Nosivost (kg)
                          </label>
                          <input
                            name="capacity"
                            type="number"
                            value={editForm.capacity}
                            onChange={handleEditChange}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                            <FaCalendarAlt className="text-yellow-500 mr-2" />
                            Godina proizvodnje
                          </label>
                          <input
                            name="year"
                            type="number"
                            value={editForm.year}
                            onChange={handleEditChange}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                            <FaPallet className="text-indigo-500 mr-2" />
                            Broj paletnih mesta
                          </label>
                          <input
                            name="pallets"
                            type="number"
                            value={editForm.pallets}
                            onChange={handleEditChange}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                            <FaRulerCombined className="text-red-500 mr-2" />
                            Dimenzije (cm)
                          </label>
                          <div className="grid grid-cols-3 gap-2">
                            <input
                              name="length"
                              type="number"
                              placeholder="Dužina"
                              value={editForm.dimensions.length}
                              onChange={handleEditChange}
                              className="border border-gray-300 rounded-lg px-2 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                              name="width"
                              type="number"
                              placeholder="Širina"
                              value={editForm.dimensions.width}
                              onChange={handleEditChange}
                              className="border border-gray-300 rounded-lg px-2 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                              name="height"
                              type="number"
                              placeholder="Visina"
                              value={editForm.dimensions.height}
                              onChange={handleEditChange}
                              className="border border-gray-300 rounded-lg px-2 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>

                        {/* Slike vozila */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                              <FaImage className="text-blue-500 mr-2" />
                              Slika 1
                            </label>
                            {editForm.existingImage1 ? (
                              <div className="relative">
                                <img
                                  src={editForm.existingImage1}
                                  alt="Vozilo"
                                  className="h-32 w-full object-contain rounded-lg border"
                                />
                                <button
                                  onClick={() =>
                                    removeImage("image1", vehicle._id)
                                  }
                                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                >
                                  <FaTimes size={12} />
                                </button>
                              </div>
                            ) : (
                              <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 h-32 cursor-pointer hover:border-blue-400">
                                <FaImage className="text-2xl text-gray-400 mb-2" />
                                <span className="text-sm text-gray-600">
                                  Dodaj sliku
                                </span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) =>
                                    handleImageChange(e, "image1", vehicle._id)
                                  }
                                  className="hidden"
                                />
                              </label>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                              <FaImage className="text-blue-500 mr-2" />
                              Slika 2
                            </label>
                            {editForm.existingImage2 ? (
                              <div className="relative">
                                <img
                                  src={editForm.existingImage2}
                                  alt="Vozilo"
                                  className="h-32 w-full object-contain rounded-lg border"
                                />
                                <button
                                  onClick={() =>
                                    removeImage("image2", vehicle._id)
                                  }
                                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                >
                                  <FaTimes size={12} />
                                </button>
                              </div>
                            ) : (
                              <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 h-32 cursor-pointer hover:border-blue-400">
                                <FaImage className="text-2xl text-gray-400 mb-2" />
                                <span className="text-sm text-gray-600">
                                  Dodaj sliku
                                </span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) =>
                                    handleImageChange(e, "image2", vehicle._id)
                                  }
                                  className="hidden"
                                />
                              </label>
                            )}
                          </div>
                        </div>

                        <div className="flex gap-2 pt-4">
                          <button
                            onClick={() => saveEdit(vehicle._id)}
                            disabled={saving}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition-colors flex items-center justify-center text-base"
                          >
                            {saving ? "Čuvanje..." : "Sačuvaj izmene"}
                          </button>
                          <button
                            onClick={() => setEditingVehicle(null)}
                            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 px-3 py-2 rounded-lg transition-colors text-base"
                          >
                            Odustani
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Prikaz vozila - normalni mod */}
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center">
                          <div className="p-2 rounded-lg bg-blue-100 text-blue-600 mr-3">
                            <FaCar className="text-xl" />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">
                              {vehicle.type}
                            </h3>
                            <p className="text-gray-700 font-medium">
                              {vehicle.licensePlate}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-2 text-sm text-gray-700">
                          <div className="flex items-center">
                            <FaWeightHanging className="text-green-500 mr-2" />
                            Nosivost: {vehicle.capacity} kg
                          </div>

                          {vehicle.year && (
                            <div className="flex items-center">
                              <FaCalendarAlt className="text-yellow-500 mr-2" />
                              Godina: {vehicle.year}
                            </div>
                          )}

                          {vehicle.pallets > 0 && (
                            <div className="flex items-center">
                              <FaPallet className="text-indigo-500 mr-2" />
                              Paletna mesta: {vehicle.pallets}
                            </div>
                          )}

                          {vehicle.dimensions?.length &&
                            vehicle.dimensions?.width &&
                            vehicle.dimensions?.height && (
                              <div className="flex items-center">
                                <FaRulerCombined className="text-red-500 mr-2" />
                                Dimenzije: {vehicle.dimensions.length} ×{" "}
                                {vehicle.dimensions.width} ×{" "}
                                {vehicle.dimensions.height} cm
                              </div>
                            )}
                        </div>

                        {vehicle.description && (
                          <p className="text-gray-600 text-sm italic">
                            {vehicle.description}
                          </p>
                        )}

                        {/* Prikaz slika vozila */}
                        {(vehicle.image1 || vehicle.image2) && (
                          <div className="mt-4">
                            <div className="flex gap-2 overflow-x-auto pb-2">
                              {vehicle.image1 && (
                                <img
                                  src={vehicle.image1}
                                  alt="Vozilo 1"
                                  className="h-24 w-auto object-contain rounded-lg border"
                                />
                              )}
                              {vehicle.image2 && (
                                <img
                                  src={vehicle.image2}
                                  alt="Vozilo 2"
                                  className="h-24 w-auto object-contain rounded-lg border"
                                />
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Dugmadi za akcije */}
                      <div className="flex gap-2 pt-4 mt-4 border-t border-gray-200">
                        <button
                          onClick={() => startEditing(vehicle)}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-base px-3 py-2 rounded-lg transition-colors flex items-center justify-center"
                        >
                          <FaEdit className="mr-1" />
                          Izmeni
                        </button>
                        <button
                          onClick={() => deleteVehicle(vehicle._id)}
                          className="flex-1 bg-[#d7d7d7] hover:bg-[#c1c1c1] text-[#3d3d3d] px-3 py-2 rounded-lg transition-colors flex items-center justify-center text-base"
                        >
                          <FaTrash className="mr-1" />
                          Obriši
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={confirmModal.open}
        onClose={closeConfirmModal}
        onConfirm={handleConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        type={confirmModal.type}
        isLoading={confirmModal.isLoading}
        confirmText="Da, obriši"
        cancelText="Otkaži"
      />
    </div>
  );
}
