// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useGlobalState } from "../helper/globalState";
// import { Link } from "react-router-dom";
// import {
//   FaPlus,
//   FaTrash,
//   FaEdit,
//   FaSave,
//   FaTimes,
//   FaUpload,
//   FaPhone,
//   FaEnvelope,
//   FaTruck,
//   FaStore,
//   FaInfoCircle,
//   FaTimesCircle,
//   FaBuilding,
//   FaTag,
//   FaIdCard,
//   FaWeightHanging,
//   FaRulerCombined,
//   FaCheckCircle,
//   FaExternalLinkAlt,
//   FaGlobe,
//   FaFacebook,
//   FaInstagram,
//   FaLinkedin,
//   FaToggleOn,
//   FaToggleOff,
// } from "react-icons/fa";

// const ShopDashboard = () => {
//   const [token] = useGlobalState("token");
//   const [shop, setShop] = useState(null);
//   const [vehicles, setVehicles] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [editing, setEditing] = useState(false);
//   const [newService, setNewService] = useState({ name: "", description: "" });
//   const [editData, setEditData] = useState({
//     contact: {},
//     socialMedia: {},
//   });
//   const [uploading, setUploading] = useState(false);
//   const [slugAvailable, setSlugAvailable] = useState(null);
//   const [helpText, setHelpText] = useState(null);

//   useEffect(() => {
//     fetchShopData();
//   }, []);

//   const fetchShopData = async () => {
//     try {
//       const shopRes = await axios.get("/api/shop", {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       const vehiclesRes = await axios.get("/api/vehicles", {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       setShop(shopRes.data);
//       setEditData({
//         ...shopRes.data,
//         contact: shopRes.data.contact || {},
//         socialMedia: shopRes.data.socialMedia || {},
//       });
//       setVehicles(vehiclesRes.data);
//     } catch (err) {
//       console.error("Greška pri učitavanju podataka:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const checkSlugAvailability = async (name) => {
//     if (!name.trim()) {
//       setSlugAvailable(null);
//       return;
//     }
//     const slug = name
//       .toLowerCase()
//       .replace(/[^a-z0-9 -]/g, "")
//       .replace(/\s+/g, "-")
//       .replace(/-+/g, "-")
//       .trim();

//     try {
//       const res = await axios.get(`/api/shop/check-slug/${slug}`);
//       setSlugAvailable(res.data.available);
//     } catch (err) {
//       console.error("Greška pri proveri sluga:", err);
//       setSlugAvailable(false);
//     }
//   };

//   const handleSave = async () => {
//     try {
//       const res = await axios.put(`/api/shop/${shop._id}`, editData, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setShop(res.data);
//       setEditing(false);
//       alert("Podaci uspešno sačuvani!");
//     } catch (err) {
//       console.error("Greška pri čuvanju podataka:", err);
//       alert("Greška pri čuvanju podataka");
//     }
//   };

//   const handleAddService = async () => {
//     if (!newService.name.trim()) {
//       alert("Unesite naziv usluge!");
//       return;
//     }

//     try {
//       const res = await axios.post(
//         `/api/shop/${shop._id}/services`,
//         newService,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       setShop(res.data);
//       setEditData({
//         ...res.data,
//         contact: res.data.contact || {},
//         socialMedia: res.data.socialMedia || {},
//       });
//       setNewService({ name: "", description: "" });
//     } catch (err) {
//       console.error("Greška pri dodavanju usluge:", err);
//       alert("Greška pri dodavanju usluge");
//     }
//   };

//   const handleDeleteService = async (serviceId) => {
//     if (
//       !window.confirm("Da li ste sigurni da želite da obrišete ovu uslugu?")
//     ) {
//       return;
//     }

//     try {
//       const res = await axios.delete(
//         `/api/shop/${shop._id}/services/${serviceId}`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       setShop(res.data);
//       setEditData({
//         ...res.data,
//         contact: res.data.contact || {},
//         socialMedia: res.data.socialMedia || {},
//       });
//     } catch (err) {
//       console.error("Greška pri brisanju usluge:", err);
//       alert("Greška pri brisanju usluge");
//     }
//   };

//   const handleImageUpload = async (event) => {
//     const file = event.target.files[0];
//     if (!file) return;

//     setUploading(true);
//     const formData = new FormData();
//     formData.append("image", file);

//     try {
//       const response = await axios.post(
//         "/api/images/upload-shop-logo",
//         formData,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );

//       if (response.data.success) {
//         const newLogoUrl = response.data.imageUrl;
//         const updateResponse = await axios.put(
//           `/api/shop/${shop._id}`,
//           { ...editData, logo: newLogoUrl },
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );

//         setShop(updateResponse.data);
//         setEditData({
//           ...updateResponse.data,
//           contact: updateResponse.data.contact || {},
//           socialMedia: updateResponse.data.socialMedia || {},
//         });
//         alert("Logo uspešno uploadovan i sačuvan!");
//       }
//     } catch (error) {
//       console.error("Upload error:", error);
//       alert("Greška pri uploadu logoa");
//     } finally {
//       setUploading(false);
//     }
//   };

//   const handleDeleteShopLogo = async () => {
//     if (!window.confirm("Da li ste sigurni da želite da obrišete logo?")) {
//       return;
//     }

//     try {
//       const response = await axios.delete("/api/images/delete-shop-logo", {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (response.data.success) {
//         const updateResponse = await axios.put(
//           `/api/shop/${shop._id}`,
//           { ...editData, logo: "" },
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );

//         setShop(updateResponse.data);
//         setEditData({
//           ...updateResponse.data,
//           contact: updateResponse.data.contact || {},
//           socialMedia: updateResponse.data.socialMedia || {},
//         });
//         alert("Logo uspešno obrisan!");
//       }
//     } catch (error) {
//       console.error("Delete error:", error);
//       alert("Greška pri brisanju logoa");
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setEditData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleContactChange = (field, value) => {
//     setEditData((prev) => ({
//       ...prev,
//       contact: {
//         ...prev.contact,
//         [field]: value,
//       },
//     }));
//   };

//   const handleSocialMediaChange = (platform, value) => {
//     setEditData((prev) => ({
//       ...prev,
//       socialMedia: {
//         ...prev.socialMedia,
//         [platform]: value,
//       },
//     }));
//   };

//   const toggleActiveStatus = () => {
//     setEditData((prev) => ({
//       ...prev,
//       isActive: !prev.isActive,
//     }));
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         Učitavanje...
//       </div>
//     );
//   }

//   if (!shop) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         Shop nije pronađen
//       </div>
//     );
//   }

//   const renderHelp = (field) => {
//     const texts = {
//       name: "Naziv shopa mora biti jedinstven jer se koristi kao link (slug).",
//       companyName: "Zvaničan naziv firme prema registraciji.",
//       specialization: "Unesite glavnu delatnost ili tip usluga.",
//       description: "Ovde možete detaljno opisati svoj shop i usluge.",
//       isActive: "Ako je isključeno, radnja se neće prikazivati javno.",
//     };
//     return (
//       <FaInfoCircle
//         className="inline ml-2 text-blue-400 cursor-pointer"
//         title={texts[field]}
//         onClick={() =>
//           setHelpText(helpText === texts[field] ? null : texts[field])
//         }
//       />
//     );
//   };

//   // Stilovi koji se koriste u oba moda
//   const inputStyle =
//     "w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500";
//   const labelStyle =
//     "block text-sm font-medium text-gray-700 mb-2 flex items-center";
//   const sectionStyle = "bg-white rounded-xl shadow-md p-6 mb-6";

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Header */}
//         <div className={sectionStyle}>
//           <div className="flex justify-between items-center mb-6">
//             <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
//               <FaStore className="text-blue-500" />
//               Upravljanje Radnjom:
//               <div className="relative group">
//                 <Link
//                   to={`/shop/${shop.slug || shop._id}`}
//                   className="flex items-center gap-1 text-[#8a91f3] hover:text-[#6973f3] text-4xl border rounded p-2 underline decoration-dotted underline-offset-4 transition-colors duration-200 ml-2"
//                   target="_blank"
//                 >
//                   {shop.name}
//                   <FaExternalLinkAlt className="text-xs ml-1" />
//                 </Link>
//                 <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
//                   Klikni da vidiš radnju
//                   <div className="absolute top-full left-3 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-800"></div>
//                 </div>
//               </div>
//             </h1>
//             {editing ? (
//               <div className="flex gap-2">
//                 <button
//                   onClick={() => setEditing(false)}
//                   className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg flex items-center transition-colors"
//                 >
//                   <FaTimes className="mr-2" />
//                   Otkaži
//                 </button>
//                 <button
//                   onClick={handleSave}
//                   className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
//                 >
//                   <FaSave className="mr-2" />
//                   Sačuvaj
//                 </button>
//               </div>
//             ) : (
//               <button
//                 onClick={() => setEditing(true)}
//                 className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
//               >
//                 <FaEdit className="mr-2" />
//                 Izmeni
//               </button>
//             )}
//           </div>

//           {/* Status aktivnosti */}
//           <div className="mb-6 p-4 bg-gray-50 rounded-lg">
//             <label className={labelStyle}>
//               Status radnje {renderHelp("isActive")}
//             </label>
//             {editing ? (
//               <div className="flex items-center gap-4">
//                 <button
//                   type="button"
//                   onClick={toggleActiveStatus}
//                   className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
//                     editData.isActive
//                       ? "bg-green-500 hover:bg-green-600 text-white"
//                       : "bg-red-500 hover:bg-red-600 text-white"
//                   }`}
//                 >
//                   {editData.isActive ? (
//                     <>
//                       <FaToggleOn className="text-xl" /> Aktivno
//                     </>
//                   ) : (
//                     <>
//                       <FaToggleOff className="text-xl" /> Neaktivno
//                     </>
//                   )}
//                 </button>
//                 <span className="text-sm text-gray-600">
//                   {editData.isActive
//                     ? "✅ Radnja je vidljiva javno"
//                     : "❌ Radnja je skrivena od javnosti"}
//                 </span>
//               </div>
//             ) : (
//               <div className="flex items-center gap-4">
//                 <div
//                   className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
//                     shop.isActive
//                       ? "bg-green-100 text-green-800"
//                       : "bg-red-100 text-red-800"
//                   }`}
//                 >
//                   {shop.isActive ? (
//                     <>
//                       <FaToggleOn className="text-xl" /> Aktivno
//                     </>
//                   ) : (
//                     <>
//                       <FaToggleOff className="text-xl" /> Neaktivno
//                     </>
//                   )}
//                 </div>
//                 <span className="text-sm text-gray-600">
//                   {shop.isActive
//                     ? "✅ Radnja je vidljiva javno"
//                     : "❌ Radnja je skrivena od javnosti"}
//                 </span>
//               </div>
//             )}
//           </div>

//           {/* Osnovni podaci */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//             {/* Naziv Shopa */}
//             <div>
//               <label className={labelStyle}>
//                 <FaStore className="mr-2 text-blue-500" />
//                 Naziv Shopa * {renderHelp("name")}
//               </label>
//               {editing ? (
//                 <>
//                   <input
//                     type="text"
//                     name="name"
//                     value={editData.name || ""}
//                     onChange={(e) => {
//                       handleInputChange(e);
//                       checkSlugAvailability(e.target.value);
//                     }}
//                     className={inputStyle}
//                     required
//                   />
//                   {slugAvailable !== null && (
//                     <p
//                       className={`mt-1 text-sm flex items-center gap-1 ${
//                         slugAvailable
//                           ? "text-green-600"
//                           : "text-red-600 font-medium"
//                       }`}
//                     >
//                       {slugAvailable ? (
//                         <>
//                           <FaCheckCircle /> Naziv dostupan
//                         </>
//                       ) : (
//                         <>
//                           <FaTimesCircle /> Naziv zauzet
//                         </>
//                       )}
//                     </p>
//                   )}
//                 </>
//               ) : (
//                 <div className={inputStyle + " bg-gray-50 cursor-default"}>
//                   {shop.name}
//                 </div>
//               )}
//             </div>

//             {/* Naziv kompanije */}
//             <div>
//               <label className={labelStyle}>
//                 <FaBuilding className="mr-2 text-indigo-500" />
//                 Naziv Kompanije * {renderHelp("companyName")}
//               </label>
//               {editing ? (
//                 <input
//                   type="text"
//                   name="companyName"
//                   value={editData.companyName || ""}
//                   onChange={handleInputChange}
//                   className={inputStyle}
//                   required
//                 />
//               ) : (
//                 <div className={inputStyle + " bg-gray-50 cursor-default"}>
//                   {shop.companyName}
//                 </div>
//               )}
//             </div>

//             {/* Specijalnost */}
//             <div>
//               <label className={labelStyle}>
//                 <FaTag className="mr-2 text-pink-500" />
//                 Specijalnost {renderHelp("specialization")}
//               </label>
//               {editing ? (
//                 <input
//                   type="text"
//                   name="specialization"
//                   value={editData.specialization || ""}
//                   onChange={handleInputChange}
//                   className={inputStyle}
//                   placeholder="npr. Međunarodni transport, Selidbe, itd."
//                 />
//               ) : (
//                 <div className={inputStyle + " bg-gray-50 cursor-default"}>
//                   {shop.specialization || "Nije postavljena"}
//                 </div>
//               )}
//             </div>

//             {/* Website */}
//             <div>
//               <label className={labelStyle}>
//                 <FaGlobe className="mr-2 text-orange-500" />
//                 Website
//               </label>
//               {editing ? (
//                 <input
//                   type="url"
//                   name="website"
//                   value={editData.contact.website || ""}
//                   onChange={handleInputChange}
//                   className={inputStyle}
//                   placeholder="https://www.example.com"
//                 />
//               ) : (
//                 <div className={inputStyle + " bg-gray-50 cursor-default"}>
//                   {shop.contact.website || "Nije postavljen"}
//                 </div>
//               )}
//             </div>

//             {/* Logo */}
//             <div className="flex flex-col items-start">
//               <label className={labelStyle}>
//                 <FaUpload className="mr-2 text-orange-500" />
//                 Logo
//               </label>
//               {editing ? (
//                 <div className="space-y-2">
//                   <label className="inline-flex items-center bg-gray-200 hover:bg-gray-300 text-black px-4 py-2 rounded-lg cursor-pointer transition-colors">
//                     <FaUpload className="mr-2" />
//                     Odaberite sliku
//                     <input
//                       type="file"
//                       accept="image/*"
//                       onChange={handleImageUpload}
//                       disabled={uploading}
//                       className="hidden"
//                     />
//                   </label>
//                   <div className="text-sm text-gray-500">
//                     {uploading
//                       ? "📤 Uploaduje se..."
//                       : "📷 Nijedna slika nije odabrana"}
//                   </div>

//                   {(editData.logo || shop.logo) && (
//                     <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
//                       <div className="flex items-center gap-3">
//                         <img
//                           src={editData.logo || shop.logo}
//                           alt="Logo"
//                           className="h-12 w-auto object-contain"
//                         />
//                         <span className="text-green-700 font-medium">
//                           ✅ Slika je postavljena
//                         </span>
//                         <button
//                           type="button"
//                           onClick={handleDeleteShopLogo}
//                           className="ml-auto bg-red-500 hover:bg-red-600 text-white p-1 rounded"
//                           title="Obriši logo"
//                         >
//                           <FaTimes size={10} />
//                         </button>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               ) : shop.logo ? (
//                 <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border">
//                   <img
//                     src={shop.logo}
//                     alt="Logo"
//                     className="h-12 w-auto object-contain"
//                   />
//                   <span className="text-gray-700">✅ Logo je postavljen</span>
//                 </div>
//               ) : (
//                 <div className="p-3 bg-gray-50 rounded-lg border text-gray-500">
//                   ❌ Logo nije postavljen
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Opis */}
//           <div className="mb-6">
//             <label className={labelStyle}>
//               <FaInfoCircle className="mr-2 text-teal-500" />
//               Opis Shopa {renderHelp("description")}
//             </label>
//             {editing ? (
//               <textarea
//                 name="description"
//                 value={editData.description || ""}
//                 onChange={handleInputChange}
//                 rows="3"
//                 className={inputStyle}
//                 placeholder="Opisite vašu kompaniju i usluge..."
//               />
//             ) : (
//               <div
//                 className={
//                   inputStyle + " bg-gray-50 cursor-default min-h-[80px]"
//                 }
//                 style={{ whiteSpace: "pre-wrap" }}
//               >
//                 {shop.description || "Nije postavljen opis"}
//               </div>
//             )}
//           </div>

//           {/* Kontakt */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//             <div>
//               <label className={labelStyle}>
//                 <FaPhone className="inline mr-2 text-green-500" />
//                 Telefon 1
//               </label>
//               {editing ? (
//                 <input
//                   type="text"
//                   value={editData.contact?.phone || ""}
//                   onChange={(e) => handleContactChange("phone", e.target.value)}
//                   className={inputStyle}
//                   placeholder="+381 11 123 456"
//                 />
//               ) : (
//                 <div className={inputStyle + " bg-gray-50 cursor-default"}>
//                   {shop.contact?.phone || "Nije postavljen"}
//                 </div>
//               )}
//             </div>

//             <div>
//               <label className={labelStyle}>
//                 <FaPhone className="inline mr-2 text-blue-500" />
//                 Telefon 2
//               </label>
//               {editing ? (
//                 <input
//                   type="text"
//                   value={editData.contact?.phone2 || ""}
//                   onChange={(e) =>
//                     handleContactChange("phone2", e.target.value)
//                   }
//                   className={inputStyle}
//                   placeholder="+381 11 123 457"
//                 />
//               ) : (
//                 <div className={inputStyle + " bg-gray-50 cursor-default"}>
//                   {shop.contact?.phone2 || "Nije postavljen"}
//                 </div>
//               )}
//             </div>

//             <div>
//               <label className={labelStyle}>
//                 <FaEnvelope className="inline mr-2 text-purple-500" />
//                 Email
//               </label>
//               {editing ? (
//                 <input
//                   type="email"
//                   value={editData.contact?.email || ""}
//                   onChange={(e) => handleContactChange("email", e.target.value)}
//                   className={inputStyle}
//                   placeholder="office@example.com"
//                 />
//               ) : (
//                 <div className={inputStyle + " bg-gray-50 cursor-default"}>
//                   {shop.contact?.email || "Nije postavljen"}
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Društvene mreže - samo u edit modu */}
//           {editing && (
//             <div className="mb-6">
//               <h3 className="text-lg font-semibold mb-4 flex items-center">
//                 <FaGlobe className="mr-2 text-blue-500" />
//                 Društvene mreže
//               </h3>
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 <div>
//                   <label className={labelStyle}>
//                     <FaFacebook className="mr-2 text-blue-600" />
//                     Facebook
//                   </label>
//                   <input
//                     type="url"
//                     value={editData.socialMedia?.facebook || ""}
//                     onChange={(e) =>
//                       handleSocialMediaChange("facebook", e.target.value)
//                     }
//                     className={inputStyle}
//                     placeholder="https://facebook.com/username"
//                   />
//                 </div>
//                 <div>
//                   <label className={labelStyle}>
//                     <FaInstagram className="mr-2 text-pink-600" />
//                     Instagram
//                   </label>
//                   <input
//                     type="url"
//                     value={editData.socialMedia?.instagram || ""}
//                     onChange={(e) =>
//                       handleSocialMediaChange("instagram", e.target.value)
//                     }
//                     className={inputStyle}
//                     placeholder="https://instagram.com/username"
//                   />
//                 </div>
//                 <div>
//                   <label className={labelStyle}>
//                     <FaLinkedin className="mr-2 text-blue-500" />
//                     LinkedIn
//                   </label>
//                   <input
//                     type="url"
//                     value={editData.socialMedia?.linkedin || ""}
//                     onChange={(e) =>
//                       handleSocialMediaChange("linkedin", e.target.value)
//                     }
//                     className={inputStyle}
//                     placeholder="https://linkedin.com/company/username"
//                   />
//                 </div>
//               </div>
//             </div>
//           )}

//           {helpText && (
//             <div className="bg-blue-50 text-blue-800 p-3 rounded-lg mb-4 text-sm border border-blue-200">
//               {helpText}
//             </div>
//           )}
//         </div>
//         {/* Sekcija za Usluge */}
//         <div className="bg-white rounded-xl shadow-md p-6 mb-6">
//           <div className="flex items-center justify-between mb-4">
//             <h2 className="text-xl font-semibold flex items-center gap-2">
//               <FaPlus className="mr-2 text-blue-500" />
//               Usluge
//             </h2>
//             <div className="text-sm text-gray-500">
//               {editing ? "Režim izmena" : "Pregled usluga"}
//             </div>
//           </div>

//           {/* Forma za dodavanje nove usluge */}
//           {editing && (
//             <div className="bg-gray-50 p-4 rounded-lg mb-6">
//               <h3 className="text-lg font-medium mb-3">Dodaj novu uslugu</h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Naziv usluge *
//                   </label>
//                   <input
//                     type="text"
//                     value={newService.name}
//                     onChange={(e) =>
//                       setNewService({ ...newService, name: e.target.value })
//                     }
//                     placeholder="npr. Selidbe, Transport robe, Međunarodni transport"
//                     className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//               </div>

//               <div className="mb-3">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Opis usluge
//                 </label>
//                 <textarea
//                   value={newService.description}
//                   onChange={(e) =>
//                     setNewService({
//                       ...newService,
//                       description: e.target.value,
//                     })
//                   }
//                   placeholder="Detaljan opis usluge..."
//                   rows="2"
//                   className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>

//               <div className="flex items-center gap-3">
//                 <button
//                   onClick={handleAddService}
//                   className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
//                 >
//                   <FaPlus className="mr-2" />
//                   Dodaj uslugu
//                 </button>

//                 <button
//                   onClick={() => setNewService({ name: "", description: "" })}
//                   className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg"
//                 >
//                   Poništi
//                 </button>
//               </div>
//             </div>
//           )}

//           {/* Lista usluga (DashboardCard stil: border-l-4 u random boji) */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {shop.services && shop.services.length > 0 ? (
//               (() => {
//                 // boje za border (stil, UI-only)
//                 const colors = [
//                   "border-blue-500",
//                   "border-green-500",
//                   "border-yellow-500",
//                   "border-purple-500",
//                   "border-indigo-500",
//                   "border-pink-500",
//                   "border-red-500",
//                 ];

//                 return shop.services.map((service, index) => {
//                   const color = colors[index % colors.length];
//                   // izvući prvo slovo za mali avatar (vizuelni detalj, ne šalje se backendu)
//                   const initial = (service.name || "U").charAt(0).toUpperCase();

//                   return (
//                     <div
//                       key={service._id || index}
//                       className={`bg-white rounded-xl shadow-md p-4 h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-l-4 ${color}`}
//                     >
//                       <div className="flex items-start gap-3">
//                         {/* avatar inicijal u krugu */}
//                         <div
//                           className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${color.replace(
//                             "border-",
//                             "bg-"
//                           )} bg-opacity-20 text-sm font-semibold`}
//                           aria-hidden
//                         >
//                           {initial}
//                         </div>

//                         <div className="flex-1">
//                           <div className="flex items-center justify-between">
//                             <h4 className="font-semibold text-blue-600 text-base">
//                               {service.name}
//                             </h4>

//                             {/* obriši (samo u edit modu) */}
//                             {editing && (
//                               <button
//                                 onClick={() => handleDeleteService(service._id)}
//                                 className="text-red-500 hover:text-red-700 p-2 rounded-md"
//                                 title="Obriši uslugu"
//                               >
//                                 <FaTrash />
//                               </button>
//                             )}
//                           </div>

//                           {service.description ? (
//                             <p className="text-gray-600 text-sm mt-1 leading-snug">
//                               {service.description}
//                             </p>
//                           ) : (
//                             <p className="text-gray-400 text-sm italic mt-1">
//                               Nema opisa
//                             </p>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 });
//               })()
//             ) : (
//               <div className="col-span-2 text-center py-8 text-gray-500">
//                 {editing ? "Dodajte prvu uslugu" : "Trenutno nema usluga"}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Sekcija za Vozila */}
//         {/* Vozila */}
//         {!editing && (
//           <div className="bg-white rounded-xl shadow-md p-6 mb-6">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-semibold flex items-center gap-2">
//                 <FaTruck className="text-green-500" />
//                 Vaša Vozila
//               </h2>
//               <Link
//                 to="/my-vehicles"
//                 className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center"
//               >
//                 <FaEdit className="mr-2" />
//                 Izmeni vozila
//               </Link>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {vehicles.map((vehicle) => (
//                 <div
//                   key={vehicle._id}
//                   className="border rounded-xl bg-white shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col"
//                 >
//                   {/* Slika vozila */}
//                   {vehicle.image1 ? (
//                     <div className="h-40 w-full bg-gray-100 flex items-center justify-center overflow-hidden">
//                       <img
//                         src={vehicle.image1}
//                         alt={vehicle.type}
//                         className="h-full w-auto object-contain"
//                       />
//                     </div>
//                   ) : (
//                     <div className="h-40 w-full bg-gray-100 flex items-center justify-center">
//                       <FaTruck className="text-4xl text-gray-400" />
//                     </div>
//                   )}

//                   {/* Podaci o vozilu */}
//                   <div className="p-4 flex-1 flex flex-col">
//                     <h4 className="font-semibold text-lg mb-3 flex items-center gap-2 text-gray-800">
//                       <FaTruck className="text-green-500" />
//                       {vehicle.type}
//                     </h4>

//                     <div className="space-y-2 text-sm text-gray-700">
//                       <p className="flex items-center gap-2">
//                         <FaIdCard className="text-blue-500" />
//                         <span className="font-medium">Registracija:</span>{" "}
//                         {vehicle.licensePlate}
//                       </p>

//                       <p className="flex items-center gap-2">
//                         <FaWeightHanging className="text-red-500" />
//                         <span className="font-medium">Kapacitet:</span>{" "}
//                         {vehicle.capacity} kg
//                       </p>

//                       {vehicle.dimensions && (
//                         <p className="flex items-center gap-2">
//                           <FaRulerCombined className="text-purple-500" />
//                           <span className="font-medium">Dimenzije:</span>{" "}
//                           {vehicle.dimensions.length}m ×{" "}
//                           {vehicle.dimensions.width}m ×{" "}
//                           {vehicle.dimensions.height}m
//                         </p>
//                       )}
//                     </div>

//                     {vehicle.description && (
//                       <p className="text-gray-600 text-sm mt-3 pt-3 border-t border-gray-200 leading-snug">
//                         {vehicle.description}
//                       </p>
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {vehicles.length === 0 && (
//               <div className="text-center text-gray-500 py-6">
//                 Trenutno nemate dodata vozila.
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ShopDashboard;
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useGlobalState } from "../helper/globalState";
import { useToast } from "../components/ToastContext";
import { Link } from "react-router-dom";
import {
  FaPlus,
  FaTrash,
  FaEdit,
  FaSave,
  FaTimes,
  FaUpload,
  FaPhone,
  FaEnvelope,
  FaTruck,
  FaStore,
  FaInfoCircle,
  FaTimesCircle,
  FaBuilding,
  FaTag,
  FaIdCard,
  FaWeightHanging,
  FaRulerCombined,
  FaCheckCircle,
  FaExternalLinkAlt,
  FaGlobe,
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaToggleOn,
  FaToggleOff,
} from "react-icons/fa";

const ShopDashboard = () => {
  const [token] = useGlobalState("token");
  const [shop, setShop] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [newService, setNewService] = useState({ name: "", description: "" });
  const [editData, setEditData] = useState({
    contact: {},
    socialMedia: {},
  });
  const [uploading, setUploading] = useState(false);
  const [slugAvailable, setSlugAvailable] = useState(null);
  const [helpText, setHelpText] = useState(null);
  const { success, error, warning, info } = useToast();

  useEffect(() => {
    fetchShopData();
  }, []);

  const fetchShopData = async () => {
    try {
      const token = localStorage.getItem("token");
      const shopRes = await axios.get("/api/shop", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const vehiclesRes = await axios.get("/api/vehicles", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setShop(shopRes.data);
      setEditData({
        ...shopRes.data,
        contact: shopRes.data.contact || {},
        socialMedia: shopRes.data.socialMedia || {},
      });
      setVehicles(vehiclesRes.data);
    } catch (err) {
      console.error("Greška pri učitavanju podataka:", err);
    } finally {
      setLoading(false);
    }
  };

  const checkSlugAvailability = async (name) => {
    if (!name.trim()) {
      setSlugAvailable(null);
      return;
    }
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();

    try {
      const res = await axios.get(`/api/shop/check-slug/${slug}`);
      setSlugAvailable(res.data.available);
    } catch (err) {
      console.error("Greška pri proveri sluga:", err);
      setSlugAvailable(false);
    }
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(`/api/shop/${shop._id}`, editData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShop(res.data);
      setEditing(false);
      success("Podaci uspešno sačuvani!");
    } catch (err) {
      console.error("Greška pri čuvanju podataka:", err);
      error("Greška pri čuvanju podataka");
    }
  };

  const handleAddService = async () => {
    if (!newService.name.trim()) {
      success("Unesite naziv usluge!");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `/api/shop/${shop._id}/services`,
        newService,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setShop(res.data);
      setEditData({
        ...res.data,
        contact: res.data.contact || {},
        socialMedia: res.data.socialMedia || {},
      });
      setNewService({ name: "", description: "" });
    } catch (err) {
      console.error("Greška pri dodavanju usluge:", err);
      error("Greška pri dodavanju usluge");
    }
  };

  const handleDeleteService = async (serviceId) => {
    if (
      !window.confirm("Da li ste sigurni da želite da obrišete ovu uslugu?")
    ) {
      return;
    }
    const token = localStorage.getItem("token");

    try {
      const res = await axios.delete(
        `/api/shop/${shop._id}/services/${serviceId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setShop(res.data);
      setEditData({
        ...res.data,
        contact: res.data.contact || {},
        socialMedia: res.data.socialMedia || {},
      });
    } catch (err) {
      console.error("Greška pri brisanju usluge:", err);
      error("Greška pri brisanju usluge");
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("image", file);
    const token = localStorage.getItem("token");

    try {
      const response = await axios.post(
        "/api/images/upload-shop-logo",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        const newLogoUrl = response.data.imageUrl;
        console.log("Uploaded image URL:", newLogoUrl);
        const updateResponse = await axios.put(
          `/api/shop/${shop._id}`,
          { ...editData, logo: newLogoUrl },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("Shop update response:", updateResponse.data);
        setShop(updateResponse.data);
        setEditData({
          ...updateResponse.data,
          contact: updateResponse.data.contact || {},
          socialMedia: updateResponse.data.socialMedia || {},
        });
        success("Logo uspešno uploadovan i sačuvan!");
      }
    } catch (error) {
      console.error("Upload error:", error);
      error("Greška pri uploadu logoa");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteShopLogo = async () => {
    if (!window.confirm("Da li ste sigurni da želite da obrišete logo?")) {
      return;
    }
    const token = localStorage.getItem("token");

    try {
      const response = await axios.delete("/api/images/delete-shop-logo", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        const updateResponse = await axios.put(
          `/api/shop/${shop._id}`,
          { ...editData, logo: "" },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setShop(updateResponse.data);
        setEditData({
          ...updateResponse.data,
          contact: updateResponse.data.contact || {},
          socialMedia: updateResponse.data.socialMedia || {},
        });
        success("Logo uspešno obrisan!");
      }
    } catch (error) {
      console.error("Delete error:", error);
      error("Greška pri brisanju logoa");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleContactChange = (field, value) => {
    setEditData((prev) => ({
      ...prev,
      contact: {
        ...prev.contact,
        [field]: value,
      },
    }));
  };

  const handleSocialMediaChange = (platform, value) => {
    setEditData((prev) => ({
      ...prev,
      socialMedia: {
        ...prev.socialMedia,
        [platform]: value,
      },
    }));
  };

  const toggleActiveStatus = () => {
    setEditData((prev) => ({
      ...prev,
      isActive: !prev.isActive,
    }));
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

  const renderHelp = (field) => {
    const texts = {
      name: "Naziv shopa mora biti jedinstven jer se koristi kao link (slug).",
      companyName: "Zvaničan naziv firme prema registraciji.",
      specialization: "Unesite glavnu delatnost ili tip usluga.",
      description: "Ovde možete detaljno opisati svoj shop i usluge.",
      isActive: "Ako je isključeno, radnja se neće prikazivati javno.",
    };
    return (
      <FaInfoCircle
        className="inline ml-2 text-blue-400 cursor-pointer"
        title={texts[field]}
        onClick={() =>
          setHelpText(helpText === texts[field] ? null : texts[field])
        }
      />
    );
  };

  // Stilovi koji se koriste u oba moda
  const inputStyle =
    "w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white dark:bg-cardBGText";
  const labelStyle =
    "block text-sm font-medium text-gray-700 mb-2 flex items-center";
  const sectionStyle =
    "bg-white rounded-xl shadow-md p-6 mb-6 dark:bg-cardBGText";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-mainDarkBG py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className={sectionStyle}>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <FaStore className="text-blue-500" />
              Upravljanje Radnjom:
              <div className="relative group">
                <Link
                  to={`/shop/${shop.slug || shop._id}`}
                  className="flex items-center gap-1 text-[#8a91f3] hover:text-[#6973f3] text-4xl border rounded p-2 underline decoration-dotted underline-offset-4 transition-colors duration-200 ml-2"
                  target="_blank"
                >
                  {shop.name}
                  <FaExternalLinkAlt className="text-xs ml-1" />
                </Link>
                <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                  Klikni da vidiš radnju
                  <div className="absolute top-full left-3 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-800"></div>
                </div>
              </div>
            </h1>
            {editing ? (
              <div className="flex gap-2">
                <button
                  onClick={() => setEditing(false)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg flex items-center transition-colors"
                >
                  <FaTimes className="mr-2" />
                  Otkaži
                </button>
                <button
                  onClick={handleSave}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
                >
                  <FaSave className="mr-2" />
                  Sačuvaj
                </button>
              </div>
            ) : (
              <button
                onClick={() => setEditing(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
              >
                <FaEdit className="mr-2" />
                Izmeni
              </button>
            )}
          </div>

          {/* Status aktivnosti - LEPŠI TOGGLE */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg border dark:bg-mainDarkBG">
            <label className={labelStyle}>
              <p className="dark:text-white">Status radnje</p>{" "}
              {renderHelp("isActive")}
            </label>
            {editing ? (
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <button
                  type="button"
                  onClick={toggleActiveStatus}
                  className={`flex items-center gap-3 px-8 py-4 rounded-xl transition-all duration-300 text-lg font-semibold min-w-[160px] justify-center border-2 shadow-sm hover:shadow-md ${
                    editData.isActive
                      ? "bg-green-500 hover:bg-green-600 text-white border-green-600"
                      : "bg-red-500 hover:bg-red-600 text-white border-red-600"
                  }`}
                >
                  {editData.isActive ? (
                    <>
                      <FaToggleOn className="text-2xl" />
                      <span>Aktivno</span>
                    </>
                  ) : (
                    <>
                      <FaToggleOff className="text-2xl" />
                      <span>Neaktivno</span>
                    </>
                  )}
                </button>
                <span className="text-sm text-gray-600 bg-white dark:bg-mainDarkBG dark:text-white px-3 py-2 rounded-lg border">
                  {editData.isActive
                    ? "✅ Radnja je trenutno vidljiva javno"
                    : "❌ Radnja je trenutno skrivena od javnosti"}
                </span>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div
                  className={`flex items-center gap-3 px-8 py-4 rounded-xl text-lg font-semibold min-w-[160px] justify-center border-2 ${
                    shop.isActive
                      ? "bg-green-100 text-green-800 border-green-300"
                      : "bg-red-100 text-red-800 border-red-300"
                  }`}
                >
                  {shop.isActive ? (
                    <>
                      <FaToggleOn className="text-2xl" />
                      <span>Aktivno</span>
                    </>
                  ) : (
                    <>
                      <FaToggleOff className="text-2xl" />
                      <span>Neaktivno</span>
                    </>
                  )}
                </div>
                <span className="text-sm text-gray-600 bg-white px-3 py-2 rounded-lg border dark:text-white dark:bg-cardBGText">
                  {shop.isActive
                    ? "✅ Radnja je trenutno vidljiva javno"
                    : "❌ Radnja je trenutno skrivena od javnosti"}
                </span>
              </div>
            )}
          </div>

          {/* Osnovni podaci */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Naziv Shopa */}
            <div>
              <label className={labelStyle}>
                <FaStore className="mr-2 text-blue-500" />
                <p className="dark:text-white">Naziv Shopa *</p>{" "}
                {renderHelp("name")}
              </label>
              {editing ? (
                <>
                  <input
                    type="text"
                    name="name"
                    value={editData.name || ""}
                    onChange={(e) => {
                      handleInputChange(e);
                      checkSlugAvailability(e.target.value);
                    }}
                    className={inputStyle}
                    required
                  />
                  {slugAvailable !== null && (
                    <p
                      className={`mt-1 text-sm flex items-center gap-1 ${
                        slugAvailable
                          ? "text-green-600"
                          : "text-red-600 font-medium"
                      }`}
                    >
                      {slugAvailable ? (
                        <>
                          <FaCheckCircle /> Naziv dostupan
                        </>
                      ) : (
                        <>
                          <FaTimesCircle /> Naziv zauzet
                        </>
                      )}
                    </p>
                  )}
                </>
              ) : (
                <div className={inputStyle + " bg-gray-50 cursor-default"}>
                  {shop.name}
                </div>
              )}
            </div>

            {/* Naziv kompanije */}
            <div>
              <label className={labelStyle}>
                <FaBuilding className="mr-2 text-indigo-500" />
                <p className="dark:text-white">Naziv Kompanije *</p>{" "}
                {renderHelp("companyName")}
              </label>
              {editing ? (
                <input
                  type="text"
                  name="companyName"
                  value={editData.companyName || ""}
                  onChange={handleInputChange}
                  className={inputStyle}
                  required
                />
              ) : (
                <div className={inputStyle + " bg-gray-50 cursor-default"}>
                  {shop.companyName}
                </div>
              )}
            </div>

            {/* Specijalnost */}
            <div>
              <label className={labelStyle}>
                <FaTag className="mr-2 text-pink-500" />
                <p className="dark:text-white">Specijalnost</p>{" "}
                {renderHelp("specialization")}
              </label>
              {editing ? (
                <input
                  type="text"
                  name="specialization"
                  value={editData.specialization || ""}
                  onChange={handleInputChange}
                  className={inputStyle}
                  placeholder="npr. Međunarodni transport, Selidbe, itd."
                />
              ) : (
                <div className={inputStyle + " bg-gray-50 cursor-default"}>
                  {shop.specialization || "Nije postavljena"}
                </div>
              )}
            </div>

            {/* Website */}
            <div>
              <label className={labelStyle}>
                <FaGlobe className="mr-2 text-orange-500" />
                <p className="dark:text-white">Website</p>
              </label>
              {editing ? (
                <input
                  type="url"
                  value={editData.contact?.website || ""}
                  onChange={(e) =>
                    handleContactChange("website", e.target.value)
                  }
                  className={inputStyle}
                  placeholder="https://www.example.com"
                />
              ) : (
                <div className={inputStyle + " bg-gray-50 cursor-default"}>
                  {shop.contact?.website || "Nije postavljen"}
                </div>
              )}
            </div>

            {/* Logo */}
            <div className="flex flex-col items-start">
              <label className={labelStyle}>
                <FaUpload className="mr-2 text-orange-500" />
                <p className="dark:text-white">Logo</p>
              </label>
              {editing ? (
                <div className="space-y-2">
                  <label className="inline-flex items-center bg-gray-200 hover:bg-gray-300 text-black px-4 py-2 rounded-lg cursor-pointer transition-colors">
                    <FaUpload className="mr-2" />
                    Odaberite sliku
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading}
                      className="hidden"
                    />
                  </label>
                  <div className="text-sm text-gray-500">
                    {uploading
                      ? "📤 Uploaduje se..."
                      : editData.logo || shop.logo
                      ? "✅ Slika je odabrana"
                      : "📷 Nijedna slika nije odabrana"}
                  </div>

                  {(editData.logo || shop.logo) && (
                    <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center gap-3">
                        <img
                          src={editData.logo || shop.logo}
                          alt="Logo"
                          className="h-12 w-auto object-contain"
                        />
                        <span className="text-green-700 font-medium">
                          ✅ Slika je postavljena
                        </span>
                        <button
                          type="button"
                          onClick={handleDeleteShopLogo}
                          className="ml-auto bg-red-500 hover:bg-red-600 text-white p-1 rounded"
                          title="Obriši logo"
                        >
                          <FaTimes size={10} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : shop.logo ? (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border">
                  <img
                    src={shop.logo}
                    alt="Logo"
                    className="h-12 w-auto object-contain"
                  />
                  <span className="text-gray-700">✅ Logo je postavljen</span>
                </div>
              ) : (
                <div className="p-3 bg-gray-50 rounded-lg border text-gray-500 dark:text-darkText dark:bg-mainDarkBG">
                  ❌ Logo nije postavljen
                </div>
              )}
            </div>
          </div>

          {/* Opis */}
          <div className="mb-6">
            <label className={labelStyle}>
              <FaInfoCircle className="mr-2 text-teal-500" />
              <p className="dark:text-white">Opis Shopa</p>{" "}
              {renderHelp("description")}
            </label>
            {editing ? (
              <textarea
                name="description"
                value={editData.description || ""}
                onChange={handleInputChange}
                rows="3"
                className={inputStyle}
                placeholder="Opisite vašu kompaniju i usluge..."
              />
            ) : (
              <div
                className={
                  inputStyle + " bg-gray-50 cursor-default min-h-[80px]"
                }
                style={{ whiteSpace: "pre-wrap" }}
              >
                {shop.description || "Nije postavljen opis"}
              </div>
            )}
          </div>

          {/* Kontakt */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className={labelStyle}>
                <FaPhone className="inline mr-2 text-green-500" />
                <p className="dark:text-white">Telefon 1</p>
              </label>
              {editing ? (
                <input
                  type="text"
                  value={editData.contact?.phone || ""}
                  onChange={(e) => handleContactChange("phone", e.target.value)}
                  className={inputStyle}
                  placeholder="+381 11 123 456"
                />
              ) : (
                <div className={inputStyle + " bg-gray-50 cursor-default"}>
                  {shop.contact?.phone || "Nije postavljen"}
                </div>
              )}
            </div>

            <div>
              <label className={labelStyle}>
                <FaPhone className="inline mr-2 text-blue-500" />
                <p className="dark:text-white">Telefon 2</p>
              </label>
              {editing ? (
                <input
                  type="text"
                  value={editData.contact?.phone2 || ""}
                  onChange={(e) =>
                    handleContactChange("phone2", e.target.value)
                  }
                  className={inputStyle}
                  placeholder="+381 11 123 457"
                />
              ) : (
                <div className={inputStyle + " bg-gray-50 cursor-default"}>
                  {shop.contact?.phone2 || "Nije postavljen"}
                </div>
              )}
            </div>

            <div>
              <label className={labelStyle}>
                <FaEnvelope className="inline mr-2 text-purple-500" />
                <p className="dark:text-white">Email</p>
              </label>
              {editing ? (
                <input
                  type="email"
                  value={editData.contact?.email || ""}
                  onChange={(e) => handleContactChange("email", e.target.value)}
                  className={inputStyle}
                  placeholder="office@example.com"
                />
              ) : (
                <div className={inputStyle + " bg-gray-50 cursor-default"}>
                  {shop.contact?.email || "Nije postavljen"}
                </div>
              )}
            </div>
          </div>

          {/* Društvene mreže - PRIKAZUJE SE I U OBICNOM MODU */}
          {(shop.socialMedia?.facebook ||
            shop.socialMedia?.instagram ||
            shop.socialMedia?.linkedin ||
            editing) && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <FaGlobe className="mr-2 text-blue-500" />
                Društvene mreže
              </h3>

              {editing ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className={labelStyle}>
                      <FaFacebook className="mr-2 text-blue-600" />
                      Facebook
                    </label>
                    <input
                      type="url"
                      value={editData.socialMedia?.facebook || ""}
                      onChange={(e) =>
                        handleSocialMediaChange("facebook", e.target.value)
                      }
                      className={inputStyle}
                      placeholder="https://facebook.com/username"
                    />
                  </div>
                  <div>
                    <label className={labelStyle}>
                      <FaInstagram className="mr-2 text-pink-600" />
                      Instagram
                    </label>
                    <input
                      type="url"
                      value={editData.socialMedia?.instagram || ""}
                      onChange={(e) =>
                        handleSocialMediaChange("instagram", e.target.value)
                      }
                      className={inputStyle}
                      placeholder="https://instagram.com/username"
                    />
                  </div>
                  <div>
                    <label className={labelStyle}>
                      <FaLinkedin className="mr-2 text-blue-500" />
                      LinkedIn
                    </label>
                    <input
                      type="url"
                      value={editData.socialMedia?.linkedin || ""}
                      onChange={(e) =>
                        handleSocialMediaChange("linkedin", e.target.value)
                      }
                      className={inputStyle}
                      placeholder="https://linkedin.com/company/username"
                    />
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-4">
                  {shop.socialMedia?.facebook && (
                    <a
                      href={shop.socialMedia.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-3 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors"
                    >
                      <FaFacebook className="text-xl" />
                      <span>Facebook</span>
                    </a>
                  )}
                  {shop.socialMedia?.instagram && (
                    <a
                      href={shop.socialMedia.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-pink-50 text-pink-700 px-4 py-3 rounded-lg border border-pink-200 hover:bg-pink-100 transition-colors"
                    >
                      <FaInstagram className="text-xl" />
                      <span>Instagram</span>
                    </a>
                  )}
                  {shop.socialMedia?.linkedin && (
                    <a
                      href={shop.socialMedia.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-3 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors"
                    >
                      <FaLinkedin className="text-xl" />
                      <span>LinkedIn</span>
                    </a>
                  )}
                </div>
              )}
            </div>
          )}

          {helpText && (
            <div className="bg-blue-50 text-blue-800 p-3 rounded-lg mb-4 text-sm border border-blue-200">
              {helpText}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 mb-6 dark:bg-cardBGText">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2 dark:text-white">
              <FaPlus className="mr-2 text-blue-500" />
              Usluge
            </h2>
            <div className="text-sm text-gray-500">
              {editing ? "Režim izmena" : "Pregled usluga"}
            </div>
          </div>

          {/* Forma za dodavanje nove usluge */}
          {editing && (
            <div className="bg-gray-50 dark:bg-cardBGText p-4 rounded-lg mb-6">
              <h3 className="text-lg font-medium mb-3">Dodaj novu uslugu</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
                    Naziv usluge *
                  </label>
                  <input
                    type="text"
                    value={newService.name}
                    onChange={(e) =>
                      setNewService({ ...newService, name: e.target.value })
                    }
                    placeholder="npr. Selidbe, Transport robe, Međunarodni transport"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Opis usluge
                </label>
                <textarea
                  value={newService.description}
                  onChange={(e) =>
                    setNewService({
                      ...newService,
                      description: e.target.value,
                    })
                  }
                  placeholder="Detaljan opis usluge..."
                  rows="2"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleAddService}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
                >
                  <FaPlus className="mr-2" />
                  Dodaj uslugu
                </button>

                <button
                  onClick={() => setNewService({ name: "", description: "" })}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg"
                >
                  Poništi
                </button>
              </div>
            </div>
          )}

          {/* Lista usluga (DashboardCard stil: border-l-4 u random boji) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {shop.services && shop.services.length > 0 ? (
              (() => {
                // boje za border (stil, UI-only)
                const colors = [
                  "border-blue-500",
                  "border-green-500",
                  "border-yellow-500",
                  "border-purple-500",
                  "border-indigo-500",
                  "border-pink-500",
                  "border-red-500",
                ];

                return shop.services.map((service, index) => {
                  const color = colors[index % colors.length];
                  // izvući prvo slovo za mali avatar (vizuelni detalj, ne šalje se backendu)
                  const initial = (service.name || "U").charAt(0).toUpperCase();

                  return (
                    <div
                      key={service._id || index}
                      className={`bg-white rounded-xl shadow-md p-4 h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-l-4 ${color}`}
                    >
                      <div className="flex items-start gap-3">
                        {/* avatar inicijal u krugu */}
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${color.replace(
                            "border-",
                            "bg-"
                          )} bg-opacity-20 text-sm font-semibold`}
                          aria-hidden
                        >
                          {initial}
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-blue-600 text-base">
                              {service.name}
                            </h4>

                            {/* obriši (samo u edit modu) */}
                            {editing && (
                              <button
                                onClick={() => handleDeleteService(service._id)}
                                className="text-red-500 hover:text-red-700 p-2 rounded-md"
                                title="Obriši uslugu"
                              >
                                <FaTrash />
                              </button>
                            )}
                          </div>

                          {service.description ? (
                            <p className="text-gray-600 text-sm mt-1 leading-snug">
                              {service.description}
                            </p>
                          ) : (
                            <p className="text-gray-400 text-sm italic mt-1">
                              Nema opisa
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                });
              })()
            ) : (
              <div className="col-span-2 text-center py-8 text-gray-500">
                {editing ? "Dodajte prvu uslugu" : "Trenutno nema usluga"}
              </div>
            )}
          </div>
        </div>

        {/* Sekcija za Vozila */}
        {/* Vozila */}
        {!editing && (
          <div className="bg-white dark:bg-cardBGText rounded-xl shadow-md p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2 dark:text-white">
                <FaTruck className="text-green-500" />
                Vaša Vozila
              </h2>
              <Link
                to="/my-vehicles"
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center"
              >
                <FaEdit className="mr-2" />
                Izmeni vozila
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vehicles.map((vehicle) => (
                <div
                  key={vehicle._id}
                  className="border rounded-xl bg-white dark:bg-mainDarkBG shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col"
                >
                  {/* Slika vozila */}
                  {vehicle.image1 ? (
                    <div className="h-40 w-full bg-gray-100 dark:bg-cardBg dark:border-b flex items-center justify-center overflow-hidden">
                      <img
                        src={vehicle.image1}
                        alt={vehicle.type}
                        className="h-full w-auto object-contain"
                      />
                    </div>
                  ) : (
                    <div className="h-40 w-full bg-gray-100 flex items-center justify-center">
                      <FaTruck className="text-4xl text-gray-400" />
                    </div>
                  )}

                  {/* Podaci o vozilu */}
                  <div className="p-4 flex-1 flex flex-col">
                    <h4 className="font-semibold text-lg mb-3 flex items-center gap-2 text-gray-800 dark:text-white">
                      <FaTruck className="text-green-500" />
                      {vehicle.type}
                    </h4>

                    <div className="space-y-2 text-sm text-gray-700 dark:text-white">
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
                      <p className="text-gray-600 text-sm mt-3 pt-3 border-t border-gray-200 leading-snug">
                        {vehicle.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {vehicles.length === 0 && (
              <div className="text-center text-gray-500 py-6">
                Trenutno nemate dodata vozila.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopDashboard;
