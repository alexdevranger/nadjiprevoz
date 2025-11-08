// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useGlobalState } from "../helper/globalState";
// import { useToast } from "../components/ToastContext";
// import ConfirmModal from "../components/ConfirmModal";
// import { Link, useNavigate } from "react-router-dom";
// import {
//   FaWrench,
//   FaCity,
//   FaMapMarkerAlt,
//   FaPhone,
//   FaImage,
//   FaHome,
//   FaInfoCircle,
//   FaEdit,
//   FaTrash,
//   FaPlus,
//   FaArrowLeft,
//   FaTimes,
// } from "react-icons/fa";

// export default function MyServiceAds() {
//   const [token] = useGlobalState("token");
//   const [ads, setAds] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [editingAd, setEditingAd] = useState(null);
//   const [editForm, setEditForm] = useState({
//     serviceName: "",
//     type: "",
//     city: "",
//     adresa: "",
//     telefon1: "",
//     telefon2: "",
//     lokacija: { lat: "", lng: "" },
//     banner: null,
//     existingBanner: "",
//     description: "",
//   });
//   const { success, error } = useToast();
//   const [confirmModal, setConfirmModal] = useState({
//     open: false,
//     title: "",
//     message: "",
//     onConfirm: null,
//     type: "warning",
//     isLoading: false,
//   });
//   const navigate = useNavigate();

//   // --- Modal funkcije ---
//   const showConfirmModal = ({
//     title,
//     message,
//     onConfirm,
//     type = "warning",
//   }) => {
//     setConfirmModal({
//       open: true,
//       title,
//       message,
//       onConfirm,
//       type,
//       isLoading: false,
//     });
//   };

//   const closeConfirmModal = () => {
//     setConfirmModal({
//       open: false,
//       title: "",
//       message: "",
//       onConfirm: null,
//       type: "warning",
//       isLoading: false,
//     });
//   };

//   const handleConfirm = async () => {
//     if (confirmModal.onConfirm) {
//       setConfirmModal((prev) => ({ ...prev, isLoading: true }));
//       try {
//         await confirmModal.onConfirm();
//         closeConfirmModal();
//       } catch (err) {
//         console.error(err);
//         setConfirmModal((prev) => ({ ...prev, isLoading: false }));
//       }
//     }
//   };

//   // --- Fetch ads ---
//   const fetchAds = async () => {
//     setLoading(true);
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) return;
//       const res = await axios.get("/api/service-ads/my", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setAds(Array.isArray(res.data) ? res.data : []);
//     } catch (err) {
//       console.error("Greška pri učitavanju oglasa:", err);
//       error("Greška pri učitavanju oglasa");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (token) fetchAds();
//   }, [token]);

//   // --- Delete ad ---
//   const deleteAd = (id) => {
//     showConfirmModal({
//       title: "Obriši oglas",
//       message: "Da li ste sigurni da želite da obrišete ovaj oglas?",
//       type: "danger",
//       onConfirm: async () => {
//         try {
//           const token = localStorage.getItem("token");
//           await axios.delete(`/api/service-ads/${id}`, {
//             headers: { Authorization: `Bearer ${token}` },
//           });
//           success("Oglas uspešno obrisan!");
//           fetchAds();
//         } catch (err) {
//           console.error(err);
//           error("Greška pri brisanju oglasa");
//           throw err;
//         }
//       },
//     });
//   };

//   // --- Edit ---
//   const startEditing = (ad) => {
//     setEditingAd(ad._id);
//     setEditForm({
//       serviceName: ad.serviceName,
//       type: ad.type,
//       city: ad.city,
//       adresa: ad.adresa,
//       telefon1: ad.telefon1,
//       telefon2: ad.telefon2 || "",
//       lokacija: { lat: ad.lokacija?.lat || "", lng: ad.lokacija?.lng || "" },
//       banner: null,
//       existingBanner: ad.banner || "",
//       description: ad.description || "",
//     });
//   };

//   const saveEdit = async (id) => {
//     setSaving(true);
//     try {
//       const data = new FormData();
//       Object.keys(editForm).forEach((key) => {
//         if (key === "lokacija")
//           data.append("lokacija", JSON.stringify(editForm.lokacija));
//         else if (key !== "banner" && key !== "existingBanner")
//           data.append(key, editForm[key]);
//       });
//       if (editForm.banner instanceof File)
//         data.append("banner", editForm.banner);
//       if (editForm.existingBanner === "") data.append("removeBanner", "true");

//       const token = localStorage.getItem("token");
//       await axios.put(`/api/service-ads/${id}`, data, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "multipart/form-data",
//         },
//       });
//       success("Oglas uspešno ažuriran!");
//       setEditingAd(null);
//       fetchAds();
//     } catch (err) {
//       console.error(err);
//       error("Greška pri izmeni oglasa");
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleEditChange = (e) => {
//     const { name, value } = e.target;
//     if (["lat", "lng"].includes(name)) {
//       setEditForm({
//         ...editForm,
//         lokacija: { ...editForm.lokacija, [name]: value },
//       });
//     } else {
//       setEditForm({ ...editForm, [name]: value });
//     }
//   };

//   // --- Handle image change ---
//   const handleImageChange = async (e) => {
//     if (e.target.files && e.target.files[0]) {
//       const file = e.target.files[0];
//       const imageUrl = URL.createObjectURL(file);
//       setEditForm({ ...editForm, banner: file, existingBanner: imageUrl });

//       // Auto save
//       await saveImage(file);
//     }
//   };

//   const removeImage = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       await axios.delete(`/api/service-ads/${editingAd}/banner`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setEditForm({ ...editForm, banner: null, existingBanner: "" });
//       success("Baner obrisan!");
//       fetchAds();
//     } catch (err) {
//       console.error(err);
//       error("Greška pri brisanju bannera");
//     }
//   };

//   const saveImage = async (file) => {
//     try {
//       const token = localStorage.getItem("token");
//       const data = new FormData();
//       data.append("banner", file);
//       await axios.put(`/api/service-ads/${editingAd}/banner`, data, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "multipart/form-data",
//         },
//       });
//       fetchAds();
//       success("Baner uspešno ažuriran!");
//     } catch (err) {
//       console.error(err);
//       error("Greška pri čuvanju bannera");
//     }
//   };

//   // --- Render ---
//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Header */}
//         <div className="bg-white rounded-xl shadow-md p-6 mb-6 flex justify-between items-center">
//           <div>
//             <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
//               Moji Oglasi
//               <span className="ml-3 text-lg font-medium text-blue-400 pl-3 border-l-2">
//                 {ads.length} oglasa
//               </span>
//             </h1>
//           </div>
//           <div className="flex gap-2">
//             <button
//               onClick={() => navigate(-1)}
//               className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center"
//             >
//               <FaArrowLeft className="mr-2" />
//               Nazad
//             </button>
//             <Link to="/add-service-ad">
//               <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center">
//                 <FaPlus className="mr-2" />
//                 Dodaj oglas
//               </button>
//             </Link>
//           </div>
//         </div>

//         {/* Lista oglasa */}
//         {loading ? (
//           <div className="p-8 text-center">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
//             <p className="text-gray-600 mt-4">Učitavanje oglasa...</p>
//           </div>
//         ) : ads.length === 0 ? (
//           <div className="p-8 text-center text-gray-600">
//             Trenutno nemate aktivnih oglasa.
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {ads.map((ad) => (
//               <div
//                 key={ad._id}
//                 className="relative border-l-4 border-blue-500 rounded-xl shadow-md p-5 flex flex-col transition-all hover:shadow-lg"
//               >
//                 {editingAd === ad._id ? (
//                   <div className="space-y-4">
//                     <h3 className="text-lg font-medium text-gray-800 mb-2">
//                       Izmena oglasa
//                     </h3>

//                     <div className="space-y-2">
//                       {/* Sva polja */}
//                       <div>
//                         <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
//                           <FaWrench className="mr-2 text-blue-500" />
//                           Naziv servisa
//                         </label>
//                         <input
//                           name="serviceName"
//                           value={editForm.serviceName}
//                           onChange={handleEditChange}
//                           onBlur={(e) =>
//                             saveField("serviceName", e.target.value)
//                           }
//                           className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         />
//                       </div>

//                       <div>
//                         <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
//                           <FaInfoCircle className="mr-2 text-green-500" />
//                           Tip servisa
//                         </label>
//                         <select
//                           name="type"
//                           value={editForm.type}
//                           onChange={handleEditChange}
//                           onBlur={(e) => saveField("type", e.target.value)}
//                           className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         >
//                           <option value="Mehaničar">Mehaničar</option>
//                           <option value="Vulkanizer">Vulkanizer</option>
//                           <option value="Električar">Električar</option>
//                           <option value="Limar">Limar</option>
//                           <option value="Auto perionica">Auto perionica</option>
//                         </select>
//                       </div>

//                       <div>
//                         <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
//                           <FaCity className="mr-2 text-purple-500" />
//                           Grad
//                         </label>
//                         <input
//                           name="city"
//                           value={editForm.city}
//                           onChange={handleEditChange}
//                           onBlur={(e) => saveField("city", e.target.value)}
//                           className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         />
//                       </div>

//                       <div>
//                         <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
//                           <FaHome className="mr-2 text-orange-500" />
//                           Adresa
//                         </label>
//                         <input
//                           name="adresa"
//                           value={editForm.adresa}
//                           onChange={handleEditChange}
//                           onBlur={(e) => saveField("adresa", e.target.value)}
//                           className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         />
//                       </div>

//                       <div>
//                         <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
//                           <FaPhone className="mr-2 text-green-600" />
//                           Telefon 1
//                         </label>
//                         <input
//                           name="telefon1"
//                           value={editForm.telefon1}
//                           onChange={handleEditChange}
//                           onBlur={(e) => saveField("telefon1", e.target.value)}
//                           className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         />
//                       </div>

//                       <div>
//                         <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
//                           <FaPhone className="mr-2 text-blue-600" />
//                           Telefon 2
//                         </label>
//                         <input
//                           name="telefon2"
//                           value={editForm.telefon2}
//                           onChange={handleEditChange}
//                           onBlur={(e) => saveField("telefon2", e.target.value)}
//                           className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         />
//                       </div>

//                       <div>
//                         <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
//                           <FaMapMarkerAlt className="mr-2 text-red-500" />
//                           Latitude
//                         </label>
//                         <input
//                           name="lat"
//                           type="number"
//                           value={editForm.lokacija.lat}
//                           onChange={handleEditChange}
//                           onBlur={(e) =>
//                             saveField("lokacija", {
//                               ...editForm.lokacija,
//                               lat: e.target.value,
//                             })
//                           }
//                           className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         />
//                       </div>

//                       <div>
//                         <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
//                           <FaMapMarkerAlt className="mr-2 text-red-500" />
//                           Longitude
//                         </label>
//                         <input
//                           name="lng"
//                           type="number"
//                           value={editForm.lokacija.lng}
//                           onChange={handleEditChange}
//                           onBlur={(e) =>
//                             saveField("lokacija", {
//                               ...editForm.lokacija,
//                               lng: e.target.value,
//                             })
//                           }
//                           className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         />
//                       </div>

//                       <div>
//                         <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
//                           <FaInfoCircle className="mr-2 text-gray-500" />
//                           Opis
//                         </label>
//                         <textarea
//                           name="description"
//                           value={editForm.description}
//                           onChange={handleEditChange}
//                           onBlur={(e) =>
//                             saveField("description", e.target.value)
//                           }
//                           className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         />
//                       </div>

//                       {/* Banner */}
//                       <div className="flex justify-center mt-2">
//                         {editForm.existingBanner ? (
//                           <div className="relative w-[360px] h-[160px]">
//                             <img
//                               src={editForm.existingBanner}
//                               alt="Banner"
//                               className="w-[360px] h-[160px] object-cover rounded-lg"
//                             />
//                             <button
//                               onClick={removeImage}
//                               className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
//                             >
//                               <FaTimes size={12} />
//                             </button>
//                           </div>
//                         ) : (
//                           <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg w-[360px] h-[160px] cursor-pointer hover:border-blue-400">
//                             <FaImage className="text-2xl text-gray-400 mb-2" />
//                             <span className="text-sm text-gray-600">
//                               Dodaj baner
//                             </span>
//                             <input
//                               type="file"
//                               accept="image/*"
//                               onChange={handleImageChange}
//                               className="hidden"
//                             />
//                           </label>
//                         )}
//                       </div>

//                       <div className="flex gap-2 pt-4">
//                         <button
//                           onClick={() => saveEdit(ad._id)}
//                           disabled={saving}
//                           className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg"
//                         >
//                           {saving ? "Čuvanje..." : "Sačuvaj izmene"}
//                         </button>
//                         <button
//                           onClick={() => setEditingAd(null)}
//                           className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 px-3 py-2 rounded-lg"
//                         >
//                           Odustani
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 ) : (
//                   <>
//                     <div className="space-y-2">
//                       <h3 className="text-lg font-bold text-gray-900 flex items-center">
//                         <FaWrench className="mr-2 text-blue-500" />{" "}
//                         {ad.serviceName}
//                       </h3>
//                       <div className="flex items-center text-sm text-gray-700">
//                         <FaInfoCircle className="mr-2 text-green-500" />{" "}
//                         {ad.type}
//                       </div>
//                       <div className="flex items-center text-sm text-gray-700">
//                         <FaCity className="mr-2 text-purple-500" /> {ad.city}
//                       </div>
//                       <div className="flex items-center text-sm text-gray-700">
//                         <FaHome className="mr-2 text-orange-500" /> {ad.adresa}
//                       </div>
//                       <div className="flex items-center text-sm text-gray-700">
//                         <FaPhone className="mr-2 text-green-600" />{" "}
//                         {ad.telefon1}
//                       </div>
//                       {ad.telefon2 && (
//                         <div className="flex items-center text-sm text-gray-700">
//                           <FaPhone className="mr-2 text-blue-600" />{" "}
//                           {ad.telefon2}
//                         </div>
//                       )}
//                       {ad.description && (
//                         <div className="flex items-center text-sm text-gray-700">
//                           <FaInfoCircle className="mr-2 text-gray-500" />{" "}
//                           {ad.description}
//                         </div>
//                       )}
//                       {ad.banner && (
//                         <div className="flex justify-center mt-2">
//                           <img
//                             src={ad.banner}
//                             alt="Banner"
//                             className="w-[360px] h-[160px] object-cover rounded-lg"
//                           />
//                         </div>
//                       )}
//                     </div>
//                     {/* Actions */}
//                     {/* <div className="absolute top-4 right-4 flex gap-2">
//                       <button
//                         onClick={() => startEditing(ad)}
//                         className="text-blue-500 hover:text-blue-600"
//                       >
//                         <FaEdit />
//                       </button>
//                       <button
//                         onClick={() => deleteAd(ad._id)}
//                         className="text-red-500 hover:text-red-600"
//                       >
//                         <FaTrash />
//                       </button>
//                     </div> */}
//                     {/* Dugmad dole */}
//                     <div className="flex gap-2 pt-4">
//                       <button
//                         onClick={() => startEditing(ad)}
//                         className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg flex items-center justify-center"
//                       >
//                         <FaEdit className="mr-2" /> Izmeni
//                       </button>
//                       <button
//                         onClick={() => deleteAd(ad._id)}
//                         className="flex-1 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg flex items-center justify-center"
//                       >
//                         <FaTrash className="mr-2" /> Obriši
//                       </button>
//                     </div>
//                   </>
//                 )}
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Confirm modal */}
//       {confirmModal.open && (
//         <ConfirmModal
//           open={confirmModal.open}
//           title={confirmModal.title}
//           message={confirmModal.message}
//           type={confirmModal.type}
//           onConfirm={handleConfirm}
//           onCancel={closeConfirmModal}
//           loading={confirmModal.isLoading}
//         />
//       )}
//     </div>
//   );
// }
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useGlobalState } from "../helper/globalState";
import { useToast } from "../components/ToastContext";
import ConfirmModal from "../components/ConfirmModal";
import { Link, useNavigate } from "react-router-dom";
import {
  FaWrench,
  FaCity,
  FaMapMarkerAlt,
  FaPhone,
  FaImage,
  FaHome,
  FaInfoCircle,
  FaEdit,
  FaTrash,
  FaPlus,
  FaArrowLeft,
  FaTimes,
} from "react-icons/fa";

export default function MyServiceAds() {
  const [token] = useGlobalState("token");
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingAd, setEditingAd] = useState(null);
  const [editForm, setEditForm] = useState({
    serviceName: "",
    type: "",
    city: "",
    adresa: "",
    telefon1: "",
    telefon2: "",
    lokacija: { lat: "", lng: "" },
    banner: null,
    existingBanner: "",
    description: "",
  });
  const { success, error } = useToast();
  const [confirmModal, setConfirmModal] = useState({
    open: false,
    title: "",
    message: "",
    onConfirm: null,
    type: "warning",
    isLoading: false,
  });
  const navigate = useNavigate();

  // --- Modal funkcije ---
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
      } catch (err) {
        console.error(err);
        setConfirmModal((prev) => ({ ...prev, isLoading: false }));
      }
    }
  };

  // --- Fetch ads ---
  const fetchAds = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const res = await axios.get("/api/service-ads/my", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAds(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Greška pri učitavanju oglasa:", err);
      error("Greška pri učitavanju oglasa");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchAds();
  }, [token]);

  // --- Delete ad ---
  const deleteAd = (id) => {
    showConfirmModal({
      title: "Obriši oglas",
      message: "Da li ste sigurni da želite da obrišete ovaj oglas?",
      type: "danger",
      onConfirm: async () => {
        try {
          const token = localStorage.getItem("token");
          await axios.delete(`/api/service-ads/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          success("Oglas uspešno obrisan!");
          fetchAds();
        } catch (err) {
          console.error(err);
          error("Greška pri brisanju oglasa");
          throw err;
        }
      },
    });
  };

  // --- Edit ---
  const startEditing = (ad) => {
    setEditingAd(ad._id);
    setEditForm({
      serviceName: ad.serviceName,
      type: ad.type,
      city: ad.city,
      adresa: ad.adresa,
      telefon1: ad.telefon1,
      telefon2: ad.telefon2 || "",
      lokacija: { lat: ad.lokacija?.lat || "", lng: ad.lokacija?.lng || "" },
      banner: null,
      existingBanner: ad.banner || "",
      description: ad.description || "",
    });
  };

  const saveEdit = async (id) => {
    setSaving(true);
    try {
      const data = new FormData();
      Object.keys(editForm).forEach((key) => {
        if (key === "lokacija")
          data.append("lokacija", JSON.stringify(editForm.lokacija));
        else if (key !== "banner" && key !== "existingBanner")
          data.append(key, editForm[key]);
      });

      // Ako je banner već sačuvan automatski, ne šaljemo ga ponovo
      if (editForm.banner instanceof File && !editForm.banner.autoSaved) {
        data.append("banner", editForm.banner);
      }

      if (editForm.existingBanner === "") data.append("removeBanner", "true");

      const token = localStorage.getItem("token");
      await axios.put(`/api/service-ads/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      success("Oglas uspešno ažuriran!");
      setEditingAd(null);
      fetchAds();
    } catch (err) {
      console.error(err);
      error("Greška pri izmeni oglasa");
    } finally {
      setSaving(false);
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    if (["lat", "lng"].includes(name)) {
      setEditForm({
        ...editForm,
        lokacija: { ...editForm.lokacija, [name]: value },
      });
    } else {
      setEditForm({ ...editForm, [name]: value });
    }
  };

  // --- Handle image change (AUTOMATSKO ČUVANJE) ---
  const handleImageChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);

      // Označimo fajl kao automatski sačuvan
      const autoSavedFile = new File([file], file.name, {
        type: file.type,
        lastModified: file.lastModified,
      });
      autoSavedFile.autoSaved = true;

      setEditForm({
        ...editForm,
        banner: autoSavedFile,
        existingBanner: imageUrl,
      });

      // Automatsko čuvanje slike
      try {
        const token = localStorage.getItem("token");
        const data = new FormData();
        data.append("banner", file);
        await axios.put(`/api/service-ads/${editingAd}/banner`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        success("Baner uspešno ažuriran!");
        fetchAds();
      } catch (err) {
        console.error(err);
        error("Greška pri čuvanju bannera");
      }
    }
  };

  const removeImage = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/service-ads/${editingAd}/banner`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEditForm({ ...editForm, banner: null, existingBanner: "" });
      success("Baner obrisan!");
      fetchAds();
    } catch (err) {
      console.error(err);
      error("Greška pri brisanju bannera");
    }
  };

  // --- Render ---
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              Moji Oglasi
              <span className="ml-3 text-lg font-medium text-blue-400 pl-3 border-l-2">
                {ads.length} oglasa
              </span>
            </h1>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => navigate(-1)}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center"
            >
              <FaArrowLeft className="mr-2" />
              Nazad
            </button>
            <Link to="/add-service-ad">
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center">
                <FaPlus className="mr-2" />
                Dodaj oglas
              </button>
            </Link>
          </div>
        </div>

        {/* Lista oglasa */}
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-gray-600 mt-4">Učitavanje oglasa...</p>
          </div>
        ) : ads.length === 0 ? (
          <div className="p-8 text-center text-gray-600">
            Trenutno nemate aktivnih oglasa.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ads.map((ad) => (
              <div
                key={ad._id}
                className="relative border-l-4 border-blue-500 rounded-xl shadow-md p-5 flex flex-col transition-all hover:shadow-lg"
              >
                {editingAd === ad._id ? (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-800 mb-2">
                      Izmena oglasa
                    </h3>

                    <div className="space-y-2">
                      {/* Sva polja BEZ onBlur */}
                      <div>
                        <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                          <FaWrench className="mr-2 text-blue-500" />
                          Naziv servisa
                        </label>
                        <input
                          name="serviceName"
                          value={editForm.serviceName}
                          onChange={handleEditChange}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                          <FaInfoCircle className="mr-2 text-green-500" />
                          Tip servisa
                        </label>
                        <select
                          name="type"
                          value={editForm.type}
                          onChange={handleEditChange}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="Mehaničar">Mehaničar</option>
                          <option value="Vulkanizer">Vulkanizer</option>
                          <option value="Električar">Električar</option>
                          <option value="Limar">Limar</option>
                          <option value="Auto perionica">Auto perionica</option>
                        </select>
                      </div>

                      <div>
                        <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                          <FaCity className="mr-2 text-purple-500" />
                          Grad
                        </label>
                        <input
                          name="city"
                          value={editForm.city}
                          onChange={handleEditChange}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                          <FaHome className="mr-2 text-orange-500" />
                          Adresa
                        </label>
                        <input
                          name="adresa"
                          value={editForm.adresa}
                          onChange={handleEditChange}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                          <FaPhone className="mr-2 text-green-600" />
                          Telefon 1
                        </label>
                        <input
                          name="telefon1"
                          value={editForm.telefon1}
                          onChange={handleEditChange}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                          <FaPhone className="mr-2 text-blue-600" />
                          Telefon 2
                        </label>
                        <input
                          name="telefon2"
                          value={editForm.telefon2}
                          onChange={handleEditChange}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                          <FaMapMarkerAlt className="mr-2 text-red-500" />
                          Latitude
                        </label>
                        <input
                          name="lat"
                          type="number"
                          value={editForm.lokacija.lat}
                          onChange={handleEditChange}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                          <FaMapMarkerAlt className="mr-2 text-red-500" />
                          Longitude
                        </label>
                        <input
                          name="lng"
                          type="number"
                          value={editForm.lokacija.lng}
                          onChange={handleEditChange}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                          <FaInfoCircle className="mr-2 text-gray-500" />
                          Opis
                        </label>
                        <textarea
                          name="description"
                          value={editForm.description}
                          onChange={handleEditChange}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      {/* Banner - AUTOMATSKO ČUVANJE */}
                      <div className="flex justify-center mt-2">
                        {editForm.existingBanner ? (
                          <div className="relative w-[360px] h-[160px]">
                            <img
                              src={editForm.existingBanner}
                              alt="Banner"
                              className="w-[360px] h-[160px] object-cover rounded-lg"
                            />
                            <button
                              onClick={removeImage}
                              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                            >
                              <FaTimes size={12} />
                            </button>
                          </div>
                        ) : (
                          <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg w-[360px] h-[160px] cursor-pointer hover:border-blue-400">
                            <FaImage className="text-2xl text-gray-400 mb-2" />
                            <span className="text-sm text-gray-600">
                              Dodaj baner
                            </span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageChange}
                              className="hidden"
                            />
                          </label>
                        )}
                      </div>

                      <div className="flex gap-2 pt-4">
                        <button
                          onClick={() => saveEdit(ad._id)}
                          disabled={saving}
                          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg"
                        >
                          {saving ? "Čuvanje..." : "Sačuvaj izmene"}
                        </button>
                        <button
                          onClick={() => setEditingAd(null)}
                          className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 px-3 py-2 rounded-lg"
                        >
                          Odustani
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="space-y-2">
                      <h3 className="text-lg font-bold text-gray-900 flex items-center">
                        <FaWrench className="mr-2 text-blue-500" />{" "}
                        {ad.serviceName}
                      </h3>
                      <div className="flex items-center text-sm text-gray-700">
                        <FaInfoCircle className="mr-2 text-green-500" />{" "}
                        {ad.type}
                      </div>
                      <div className="flex items-center text-sm text-gray-700">
                        <FaCity className="mr-2 text-purple-500" /> {ad.city}
                      </div>
                      <div className="flex items-center text-sm text-gray-700">
                        <FaHome className="mr-2 text-orange-500" /> {ad.adresa}
                      </div>
                      <div className="flex items-center text-sm text-gray-700">
                        <FaPhone className="mr-2 text-green-600" />{" "}
                        {ad.telefon1}
                      </div>
                      {ad.telefon2 && (
                        <div className="flex items-center text-sm text-gray-700">
                          <FaPhone className="mr-2 text-blue-600" />{" "}
                          {ad.telefon2}
                        </div>
                      )}
                      {ad.description && (
                        <div className="flex items-center text-sm text-gray-700">
                          <FaInfoCircle className="mr-2 text-gray-500" />{" "}
                          {ad.description}
                        </div>
                      )}
                      {ad.banner && (
                        <div className="flex justify-center mt-2">
                          <img
                            src={ad.banner}
                            alt="Banner"
                            className="w-[360px] h-[160px] object-cover rounded-lg"
                          />
                        </div>
                      )}
                    </div>
                    {/* Dugmad dole */}
                    <div className="flex gap-2 pt-4">
                      <button
                        onClick={() => startEditing(ad)}
                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg flex items-center justify-center"
                      >
                        <FaEdit className="mr-2" /> Izmeni
                      </button>
                      <button
                        onClick={() => deleteAd(ad._id)}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg flex items-center justify-center"
                      >
                        <FaTrash className="mr-2" /> Obriši
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Confirm modal */}
      {confirmModal.open && (
        <ConfirmModal
          open={confirmModal.open}
          title={confirmModal.title}
          message={confirmModal.message}
          type={confirmModal.type}
          onConfirm={handleConfirm}
          onCancel={closeConfirmModal}
          loading={confirmModal.isLoading}
        />
      )}
    </div>
  );
}
