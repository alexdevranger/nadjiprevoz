// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import {
//   FaPhone,
//   FaEnvelope,
//   FaTruck,
//   FaStar,
//   FaBox,
//   FaWeightHanging,
//   FaRulerCombined,
//   FaIdCard,
//   FaAward,
//   FaCheckCircle,
//   FaArrowLeft, // Dodajte ovu ikonu
// } from "react-icons/fa";

// const ShopPage = () => {
//   const { slug } = useParams();
//   const navigate = useNavigate(); // Dodajte navigate hook
//   const [shop, setShop] = useState(null);
//   const [vehicles, setVehicles] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Sakrij navbar kada se komponenta mount-uje
//   useEffect(() => {
//     // Sakrij navbar
//     const navbar = document.querySelector(
//       'nav, [class*="navbar"], [class*="header"]'
//     );
//     if (navbar) {
//       navbar.style.display = "none";
//     }

//     // Cleanup funkcija - vrati navbar kada se komponenta unmount-uje
//     return () => {
//       if (navbar) {
//         navbar.style.display = "";
//       }
//     };
//   }, []);

//   // Random boje za kartice
//   const borderColors = [
//     "border-l-blue-500 text-blue-500",
//     "border-l-green-500 text-green-500",
//     "border-l-red-500 text-red-500",
//     "border-l-yellow-500 text-yellow-500",
//     "border-l-purple-500 text-purple-500",
//     "border-l-pink-500 text-pink-500",
//   ];

//   const getRandomColor = (index) => borderColors[index % borderColors.length];

//   useEffect(() => {
//     const fetchShop = async () => {
//       try {
//         const res = await axios.get(`/api/shop/${slug}`);
//         setShop(res.data.shop);
//         setVehicles(res.data.shop.vehicles || []);
//       } catch (err) {
//         console.error("Greška pri učitavanju shopa:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchShop();
//   }, [slug]);

//   // Funkcija za povratak na prethodnu stranicu
//   const handleGoBack = () => {
//     navigate(-1);
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

//   const contact = shop.contact || {};
//   const services = shop.services || [];
//   const specialization = shop.specialization || "";

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Strelica za nazad - fiksirana u levom gornjem uglu */}
//       <button
//         onClick={handleGoBack}
//         className="fixed top-6 left-6 z-50 bg-black/20 hover:bg-black/30 text-white p-3 rounded-full backdrop-blur-sm transition-all duration-200 hover:scale-110"
//         title="Nazad na prethodnu stranu"
//       >
//         <FaArrowLeft className="text-xl" />
//       </button>

//       {/* Kombinovani Header/Hero Section */}
//       <div className="bg-gradient-to-br from-slate-800 via-blue-900 to-slate-900 text-white mb-8 pt-4">
//         {" "}
//         {/* Dodao sam pt-4 za dodatni padding na vrhu */}
//         <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//           <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
//             {/* Leva strana - Logo i osnovne informacije */}
//             <div className="flex-1 flex items-center gap-6">
//               {shop.logo ? (
//                 <div className="flex-shrink-0">
//                   <img
//                     src={shop.logo}
//                     alt={shop.name}
//                     className="h-24 w-24 object-contain rounded-lg bg-white/10 p-2"
//                   />
//                 </div>
//               ) : (
//                 <div className="h-24 w-24 bg-blue-500 rounded-lg flex items-center justify-center text-white text-3xl font-bold">
//                   {shop.companyName?.charAt(0) || shop.name?.charAt(0) || "S"}
//                 </div>
//               )}

//               <div className="flex-1">
//                 <div className="flex items-center gap-3 mb-2">
//                   <h1 className="text-3xl md:text-4xl font-bold">
//                     {shop.companyName || shop.name}
//                   </h1>
//                   <div className="flex items-center gap-1 bg-green-500/20 px-3 py-1 rounded-full border border-green-400/30">
//                     <FaCheckCircle className="text-green-400 text-sm" />
//                     <span className="text-green-300 text-sm font-medium">
//                       Verifikovano
//                     </span>
//                   </div>
//                 </div>

//                 {specialization && (
//                   <p className="text-yellow-400 text-lg font-medium mb-3 flex items-center">
//                     <FaStar className="mr-2" />
//                     {specialization}
//                   </p>
//                 )}

//                 {shop.description && (
//                   <p className="text-gray-300 leading-relaxed">
//                     {shop.description}
//                   </p>
//                 )}
//               </div>
//             </div>

//             {/* Desna strana - Kontakt i statistika */}
//             <div className="flex flex-col gap-4">
//               {/* Kontakt informacije */}
//               <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
//                 <h3 className="font-semibold mb-3 flex items-center gap-2">
//                   <FaAward className="text-yellow-400" />
//                   Kontaktirajte nas
//                 </h3>
//                 <div className="space-y-2">
//                   {contact.phone && (
//                     <a
//                       href={`tel:${contact.phone}`}
//                       className="flex items-center gap-3 hover:bg-white/5 p-2 rounded-lg transition-colors"
//                     >
//                       <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
//                         <FaPhone className="text-green-400" />
//                       </div>
//                       <span className="font-medium">{contact.phone}</span>
//                     </a>
//                   )}
//                   {contact.email && (
//                     <a
//                       href={`mailto:${contact.email}`}
//                       className="flex items-center gap-3 hover:bg-white/5 p-2 rounded-lg transition-colors"
//                     >
//                       <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
//                         <FaEnvelope className="text-blue-400" />
//                       </div>
//                       <span className="font-medium">{contact.email}</span>
//                     </a>
//                   )}
//                 </div>
//               </div>

//               {/* Statistika */}
//               <div className="grid grid-cols-2 gap-3">
//                 <div className="bg-white/10 rounded-lg p-3 text-center border border-white/10">
//                   <div className="text-2xl font-bold text-blue-400">
//                     {vehicles.length}
//                   </div>
//                   <div className="text-xs text-gray-300">Vozila</div>
//                 </div>
//                 <div className="bg-white/10 rounded-lg p-3 text-center border border-white/10">
//                   <div className="text-2xl font-bold text-green-400">
//                     {services.length}
//                   </div>
//                   <div className="text-xs text-gray-300">Usluge</div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Ostali deo koda ostaje isti */}
//       <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
//         {/* Specijalnost */}
//         {/* {specialization && (
//           <div className="bg-white rounded-xl shadow-md p-6 mb-8 border-l-4 border-yellow-500">
//             <h3 className="text-xl font-semibold mb-4 flex items-center text-yellow-500">
//               <FaStar className="mr-2" />
//               Naša specijalnost
//             </h3>
//             <p className="text-gray-700">{specialization}</p>
//           </div>
//         )} */}

//         {/* Usluge */}
//         {services.length > 0 && (
//           <div className="bg-white rounded-xl shadow-md p-6 mb-8">
//             <h3 className="text-xl font-semibold mb-4 flex items-center text-blue-500">
//               <FaBox className="mr-2" />
//               Usluge
//             </h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//               {services.map((service, index) => {
//                 const color = getRandomColor(index);
//                 return (
//                   <div
//                     key={index}
//                     className={`bg-white rounded-lg shadow p-4 border-l-4 ${
//                       color.split(" ")[0]
//                     } hover:shadow-md transition-all`}
//                   >
//                     <h4 className={`font-semibold mb-2 ${color.split(" ")[1]}`}>
//                       {service.name}
//                     </h4>
//                     {service.description && (
//                       <p className="text-gray-600 text-sm">
//                         {service.description}
//                       </p>
//                     )}
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         )}

//         {/* Vozila */}
//         {vehicles.length > 0 && (
//           <div className="bg-white rounded-xl shadow-md p-6">
//             <h3 className="text-xl font-semibold mb-4 flex items-center text-green-500">
//               <FaTruck className="mr-2" />
//               Naša vozila ({vehicles.length})
//             </h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {vehicles.map((vehicle) => (
//                 <div
//                   key={vehicle._id}
//                   className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow bg-white"
//                 >
//                   {/* Slike */}
//                   {vehicle.image1 ? (
//                     <div className="h-40 w-full bg-gray-50 flex items-center justify-center overflow-hidden">
//                       <img
//                         src={vehicle.image1}
//                         alt={vehicle.type}
//                         className="h-full w-auto object-contain"
//                       />
//                     </div>
//                   ) : (
//                     <div className="w-full h-40 bg-gray-100 flex items-center justify-center">
//                       <FaTruck className="text-3xl text-gray-400" />
//                     </div>
//                   )}

//                   {/* Info */}
//                   <div className="p-4">
//                     <h4 className="font-semibold text-lg mb-2 flex items-center gap-2">
//                       <FaTruck className="text-green-500" />
//                       {vehicle.type}
//                     </h4>
//                     <div className="space-y-1 text-sm text-gray-600">
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
//                       <p className="text-gray-600 text-sm mt-3 pt-2 border-t border-gray-100">
//                         {vehicle.description}
//                       </p>
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         {vehicles.length === 0 && (
//           <div className="bg-white rounded-xl shadow-md p-6 text-center">
//             <FaTruck className="text-4xl text-gray-400 mx-auto mb-4" />
//             <p className="text-gray-500">Trenutno nema dostupnih vozila.</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ShopPage;
// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import {
//   FaPhone,
//   FaEnvelope,
//   FaTruck,
//   FaStar,
//   FaBox,
//   FaWeightHanging,
//   FaRulerCombined,
//   FaIdCard,
//   FaAward,
//   FaCheckCircle,
//   FaArrowLeft,
//   FaGlobe,
//   FaFacebook,
//   FaInstagram,
//   FaLinkedin,
//   FaEye,
//   FaEyeSlash,
// } from "react-icons/fa";

// const ShopPage = () => {
//   const { slug } = useParams();
//   const navigate = useNavigate();
//   const [shop, setShop] = useState(null);
//   const [vehicles, setVehicles] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [editing, setEditing] = useState(false);
//   const [editData, setEditData] = useState({});

//   // Sakrij navbar kada se komponenta mount-uje
//   useEffect(() => {
//     const navbar = document.querySelector(
//       'nav, [class*="navbar"], [class*="header"]'
//     );
//     if (navbar) {
//       navbar.style.display = "none";
//     }

//     return () => {
//       if (navbar) {
//         navbar.style.display = "";
//       }
//     };
//   }, []);

//   const borderColors = [
//     "border-l-blue-500 text-blue-500",
//     "border-l-green-500 text-green-500",
//     "border-l-red-500 text-red-500",
//     "border-l-yellow-500 text-yellow-500",
//     "border-l-purple-500 text-purple-500",
//     "border-l-pink-500 text-pink-500",
//   ];

//   const getRandomColor = (index) => borderColors[index % borderColors.length];

//   useEffect(() => {
//     const fetchShop = async () => {
//       try {
//         const res = await axios.get(`/api/shop/${slug}`);
//         setShop(res.data.shop);
//         setEditData(res.data.shop);
//         setVehicles(res.data.shop.vehicles || []);
//       } catch (err) {
//         console.error("Greška pri učitavanju shopa:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchShop();
//   }, [slug]);

//   const handleSave = async () => {
//     try {
//       const res = await axios.put(`/api/shop/${shop._id}`, editData);
//       setShop(res.data.shop);
//       setEditing(false);
//       alert("Podaci uspešno sačuvani!");
//     } catch (err) {
//       console.error("Greška pri čuvanju podataka:", err);
//       alert("Greška pri čuvanju podataka");
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setEditData((prev) => ({
//       ...prev,
//       [name]: value,
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

//   const handleContactChange = (field, value) => {
//     setEditData((prev) => ({
//       ...prev,
//       contact: {
//         ...prev.contact,
//         [field]: value,
//       },
//     }));
//   };

//   const handleGoBack = () => {
//     navigate(-1);
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

//   const contact = shop.contact || {};
//   const socialMedia = shop.socialMedia || {};
//   const services = shop.services || [];
//   const specialization = shop.specialization || "";

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Strelica za nazad */}
//       <button
//         onClick={handleGoBack}
//         className="fixed top-6 left-6 z-50 bg-black/20 hover:bg-black/30 text-white p-3 rounded-full backdrop-blur-sm transition-all duration-200 hover:scale-110"
//         title="Nazad na prethodnu stranu"
//       >
//         <FaArrowLeft className="text-xl" />
//       </button>

//       {/* Edit dugme */}
//       <button
//         onClick={() => setEditing(!editing)}
//         className="fixed top-6 right-6 z-50 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
//       >
//         {editing ? <FaEyeSlash className="mr-2" /> : <FaEye className="mr-2" />}
//         {editing ? "Pregled" : "Izmeni"}
//       </button>

//       {/* Kombinovani Header/Hero Section */}
//       <div className="bg-gradient-to-br from-slate-800 via-blue-900 to-slate-900 text-white mb-8 pt-4">
//         <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//           <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
//             {/* Leva strana - Logo i osnovne informacije */}
//             <div className="flex-1 flex items-center gap-6">
//               {shop.logo ? (
//                 <div className="flex-shrink-0">
//                   <img
//                     src={shop.logo}
//                     alt={shop.name}
//                     className="h-24 w-24 object-contain rounded-lg bg-white/10 p-2"
//                   />
//                 </div>
//               ) : (
//                 <div className="h-24 w-24 bg-blue-500 rounded-lg flex items-center justify-center text-white text-3xl font-bold">
//                   {shop.companyName?.charAt(0) || shop.name?.charAt(0) || "S"}
//                 </div>
//               )}

//               <div className="flex-1">
//                 <div className="flex items-center gap-3 mb-2">
//                   <h1 className="text-3xl md:text-4xl font-bold">
//                     {editing ? (
//                       <input
//                         type="text"
//                         name="companyName"
//                         value={editData.companyName || ""}
//                         onChange={handleChange}
//                         className="bg-transparent border-b border-white/50 focus:border-white focus:outline-none"
//                       />
//                     ) : (
//                       shop.companyName || shop.name
//                     )}
//                   </h1>
//                   <div className="flex items-center gap-3">
//                     <div className="flex items-center gap-1 bg-green-500/20 px-3 py-1 rounded-full border border-green-400/30">
//                       <FaCheckCircle className="text-green-400 text-sm" />
//                       <span className="text-green-300 text-sm font-medium">
//                         Verifikovano
//                       </span>
//                     </div>
//                     {editing && (
//                       <label className="flex items-center gap-2 bg-blue-500/20 px-3 py-1 rounded-full border border-blue-400/30">
//                         <span className="text-blue-300 text-sm">Aktivno:</span>
//                         <input
//                           type="checkbox"
//                           checked={editData.isActive !== false}
//                           onChange={(e) =>
//                             setEditData((prev) => ({
//                               ...prev,
//                               isActive: e.target.checked,
//                             }))
//                           }
//                           className="w-4 h-4"
//                         />
//                       </label>
//                     )}
//                   </div>
//                 </div>

//                 {specialization && (
//                   <p className="text-yellow-400 text-lg font-medium mb-3 flex items-center">
//                     <FaStar className="mr-2" />
//                     {editing ? (
//                       <input
//                         type="text"
//                         name="specialization"
//                         value={editData.specialization || ""}
//                         onChange={handleChange}
//                         className="bg-transparent border-b border-white/50 focus:border-white focus:outline-none flex-1"
//                         placeholder="Specijalnost..."
//                       />
//                     ) : (
//                       specialization
//                     )}
//                   </p>
//                 )}

//                 {shop.description && (
//                   <div>
//                     {editing ? (
//                       <textarea
//                         name="description"
//                         value={editData.description || ""}
//                         onChange={handleChange}
//                         className="w-full bg-transparent border border-white/30 rounded-lg p-2 focus:outline-none focus:border-white"
//                         rows="3"
//                         placeholder="Opis shopa..."
//                       />
//                     ) : (
//                       <p className="text-gray-300 leading-relaxed">
//                         {shop.description}
//                       </p>
//                     )}
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Desna strana - Kontakt i statistika */}
//             <div className="flex flex-col gap-4">
//               {/* Kontakt informacije */}
//               <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
//                 <h3 className="font-semibold mb-3 flex items-center gap-2">
//                   <FaAward className="text-yellow-400" />
//                   Kontaktirajte nas
//                 </h3>
//                 <div className="space-y-2">
//                   {/* Telefon 1 */}
//                   <div className="flex items-center gap-3 hover:bg-white/5 p-2 rounded-lg transition-colors">
//                     <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
//                       <FaPhone className="text-green-400" />
//                     </div>
//                     {editing ? (
//                       <input
//                         type="text"
//                         value={editData.contact?.phone || ""}
//                         onChange={(e) =>
//                           handleContactChange("phone", e.target.value)
//                         }
//                         className="bg-transparent border-b border-white/50 focus:border-white focus:outline-none flex-1"
//                         placeholder="Telefon 1"
//                       />
//                     ) : (
//                       contact.phone && (
//                         <a
//                           href={`tel:${contact.phone}`}
//                           className="font-medium"
//                         >
//                           {contact.phone}
//                         </a>
//                       )
//                     )}
//                   </div>

//                   {/* Telefon 2 */}
//                   <div className="flex items-center gap-3 hover:bg-white/5 p-2 rounded-lg transition-colors">
//                     <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
//                       <FaPhone className="text-blue-400" />
//                     </div>
//                     {editing ? (
//                       <input
//                         type="text"
//                         value={editData.contact?.phone2 || ""}
//                         onChange={(e) =>
//                           handleContactChange("phone2", e.target.value)
//                         }
//                         className="bg-transparent border-b border-white/50 focus:border-white focus:outline-none flex-1"
//                         placeholder="Telefon 2"
//                       />
//                     ) : (
//                       contact.phone2 && (
//                         <a
//                           href={`tel:${contact.phone2}`}
//                           className="font-medium"
//                         >
//                           {contact.phone2}
//                         </a>
//                       )
//                     )}
//                   </div>

//                   {/* Email */}
//                   <div className="flex items-center gap-3 hover:bg-white/5 p-2 rounded-lg transition-colors">
//                     <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center">
//                       <FaEnvelope className="text-purple-400" />
//                     </div>
//                     {editing ? (
//                       <input
//                         type="email"
//                         value={editData.contact?.email || ""}
//                         onChange={(e) =>
//                           handleContactChange("email", e.target.value)
//                         }
//                         className="bg-transparent border-b border-white/50 focus:border-white focus:outline-none flex-1"
//                         placeholder="Email"
//                       />
//                     ) : (
//                       contact.email && (
//                         <a
//                           href={`mailto:${contact.email}`}
//                           className="font-medium"
//                         >
//                           {contact.email}
//                         </a>
//                       )
//                     )}
//                   </div>

//                   {/* Website */}
//                   <div className="flex items-center gap-3 hover:bg-white/5 p-2 rounded-lg transition-colors">
//                     <div className="w-8 h-8 bg-orange-500/20 rounded-full flex items-center justify-center">
//                       <FaGlobe className="text-orange-400" />
//                     </div>
//                     {editing ? (
//                       <input
//                         type="url"
//                         value={editData.website || ""}
//                         onChange={handleChange}
//                         name="website"
//                         className="bg-transparent border-b border-white/50 focus:border-white focus:outline-none flex-1"
//                         placeholder="Website"
//                       />
//                     ) : (
//                       shop.website && (
//                         <a
//                           href={shop.website}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="font-medium"
//                         >
//                           {shop.website}
//                         </a>
//                       )
//                     )}
//                   </div>
//                 </div>

//                 {/* Social Media - Edit Mode */}
//                 {editing && (
//                   <div className="mt-4 pt-4 border-t border-white/20">
//                     <h4 className="font-semibold mb-2 text-sm">
//                       Društvene mreže:
//                     </h4>
//                     <div className="space-y-2">
//                       <div className="flex items-center gap-2">
//                         <FaFacebook className="text-blue-400" />
//                         <input
//                           type="url"
//                           value={editData.socialMedia?.facebook || ""}
//                           onChange={(e) =>
//                             handleSocialMediaChange("facebook", e.target.value)
//                           }
//                           className="bg-transparent border-b border-white/50 focus:border-white focus:outline-none flex-1 text-sm"
//                           placeholder="Facebook URL"
//                         />
//                       </div>
//                       <div className="flex items-center gap-2">
//                         <FaInstagram className="text-pink-400" />
//                         <input
//                           type="url"
//                           value={editData.socialMedia?.instagram || ""}
//                           onChange={(e) =>
//                             handleSocialMediaChange("instagram", e.target.value)
//                           }
//                           className="bg-transparent border-b border-white/50 focus:border-white focus:outline-none flex-1 text-sm"
//                           placeholder="Instagram URL"
//                         />
//                       </div>
//                       <div className="flex items-center gap-2">
//                         <FaLinkedin className="text-blue-300" />
//                         <input
//                           type="url"
//                           value={editData.socialMedia?.linkedin || ""}
//                           onChange={(e) =>
//                             handleSocialMediaChange("linkedin", e.target.value)
//                           }
//                           className="bg-transparent border-b border-white/50 focus:border-white focus:outline-none flex-1 text-sm"
//                           placeholder="LinkedIn URL"
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 {/* Social Media - Display Mode */}
//                 {!editing &&
//                   (socialMedia.facebook ||
//                     socialMedia.instagram ||
//                     socialMedia.linkedin) && (
//                     <div className="mt-4 pt-4 border-t border-white/20">
//                       <h4 className="font-semibold mb-2 text-sm">
//                         Pratite nas:
//                       </h4>
//                       <div className="flex gap-3">
//                         {socialMedia.facebook && (
//                           <a
//                             href={socialMedia.facebook}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="text-white hover:text-blue-300"
//                           >
//                             <FaFacebook className="text-xl" />
//                           </a>
//                         )}
//                         {socialMedia.instagram && (
//                           <a
//                             href={socialMedia.instagram}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="text-white hover:text-pink-300"
//                           >
//                             <FaInstagram className="text-xl" />
//                           </a>
//                         )}
//                         {socialMedia.linkedin && (
//                           <a
//                             href={socialMedia.linkedin}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="text-white hover:text-blue-200"
//                           >
//                             <FaLinkedin className="text-xl" />
//                           </a>
//                         )}
//                       </div>
//                     </div>
//                   )}
//               </div>

//               {/* Dugmad za čuvanje u edit modu */}
//               {editing && (
//                 <div className="flex gap-2">
//                   <button
//                     onClick={() => setEditing(false)}
//                     className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-3 py-2 rounded-lg transition-colors"
//                   >
//                     Otkaži
//                   </button>
//                   <button
//                     onClick={handleSave}
//                     className="flex-1 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg transition-colors"
//                   >
//                     Sačuvaj
//                   </button>
//                 </div>
//               )}

//               {/* Statistika */}
//               <div className="grid grid-cols-2 gap-3">
//                 <div className="bg-white/10 rounded-lg p-3 text-center border border-white/10">
//                   <div className="text-2xl font-bold text-blue-400">
//                     {vehicles.length}
//                   </div>
//                   <div className="text-xs text-gray-300">Vozila</div>
//                 </div>
//                 <div className="bg-white/10 rounded-lg p-3 text-center border border-white/10">
//                   <div className="text-2xl font-bold text-green-400">
//                     {services.length}
//                   </div>
//                   <div className="text-xs text-gray-300">Usluge</div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Ostali sadržaj (Usluge i Vozila) ostaje isti */}
//       <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
//         {/* Usluge */}
//         {services.length > 0 && (
//           <div className="bg-white rounded-xl shadow-md p-6 mb-8">
//             <h3 className="text-xl font-semibold mb-4 flex items-center text-blue-500">
//               <FaBox className="mr-2" />
//               Usluge
//             </h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//               {services.map((service, index) => {
//                 const color = getRandomColor(index);
//                 return (
//                   <div
//                     key={index}
//                     className={`bg-white rounded-lg shadow p-4 border-l-4 ${
//                       color.split(" ")[0]
//                     } hover:shadow-md transition-all`}
//                   >
//                     <h4 className={`font-semibold mb-2 ${color.split(" ")[1]}`}>
//                       {service.name}
//                     </h4>
//                     {service.description && (
//                       <p className="text-gray-600 text-sm">
//                         {service.description}
//                       </p>
//                     )}
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         )}

//         {/* Vozila */}
//         {vehicles.length > 0 && (
//           <div className="bg-white rounded-xl shadow-md p-6">
//             <h3 className="text-xl font-semibold mb-4 flex items-center text-green-500">
//               <FaTruck className="mr-2" />
//               Naša vozila ({vehicles.length})
//             </h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {vehicles.map((vehicle) => (
//                 <div
//                   key={vehicle._id}
//                   className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow bg-white"
//                 >
//                   {vehicle.image1 ? (
//                     <div className="h-40 w-full bg-gray-50 flex items-center justify-center overflow-hidden">
//                       <img
//                         src={vehicle.image1}
//                         alt={vehicle.type}
//                         className="h-full w-auto object-contain"
//                       />
//                     </div>
//                   ) : (
//                     <div className="w-full h-40 bg-gray-100 flex items-center justify-center">
//                       <FaTruck className="text-3xl text-gray-400" />
//                     </div>
//                   )}
//                   <div className="p-4">
//                     <h4 className="font-semibold text-lg mb-2 flex items-center gap-2">
//                       <FaTruck className="text-green-500" />
//                       {vehicle.type}
//                     </h4>
//                     <div className="space-y-1 text-sm text-gray-600">
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
//                       <p className="text-gray-600 text-sm mt-3 pt-2 border-t border-gray-100">
//                         {vehicle.description}
//                       </p>
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         {vehicles.length === 0 && (
//           <div className="bg-white rounded-xl shadow-md p-6 text-center">
//             <FaTruck className="text-4xl text-gray-400 mx-auto mb-4" />
//             <p className="text-gray-500">Trenutno nema dostupnih vozila.</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ShopPage;
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaPhone,
  FaEnvelope,
  FaTruck,
  FaStar,
  FaBox,
  FaWeightHanging,
  FaRulerCombined,
  FaIdCard,
  FaAward,
  FaCheckCircle,
  FaArrowLeft,
  FaGlobe,
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaEdit,
} from "react-icons/fa";

const ShopPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [shop, setShop] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);

  // Sakrij navbar kada se komponenta mount-uje
  useEffect(() => {
    const navbar = document.querySelector(
      'nav, [class*="navbar"], [class*="header"]'
    );
    if (navbar) {
      navbar.style.display = "none";
    }

    return () => {
      if (navbar) {
        navbar.style.display = "";
      }
    };
  }, []);

  const borderColors = [
    "border-l-blue-500 text-blue-500",
    "border-l-green-500 text-green-500",
    "border-l-red-500 text-red-500",
    "border-l-yellow-500 text-yellow-500",
    "border-l-purple-500 text-purple-500",
    "border-l-pink-500 text-pink-500",
  ];

  const getRandomColor = (index) => borderColors[index % borderColors.length];

  useEffect(() => {
    const fetchShop = async () => {
      try {
        const res = await axios.get(`/api/shop/${slug}`);
        console.log(res.data);
        setShop(res.data.shop);
        setVehicles(res.data.shop.vehicles || []);

        // Provera da li je trenutni korisnik vlasnik radnje
        const userRes = await axios.get("/api/auth/me", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        console.log(userRes.data.user.id);
        console.log(res.data.shop.userId._id);

        if (userRes.data && userRes.data.user.id === res.data.shop.userId._id) {
          setIsOwner(true);
        }
      } catch (err) {
        console.error("Greška pri učitavanju shopa:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchShop();
  }, [slug]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleEdit = () => {
    navigate("/shop-dashboard");
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

  const contact = shop.contact || {};
  const socialMedia = shop.socialMedia || {};
  const services = shop.services || [];
  const specialization = shop.specialization || "";

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
          title="Izmeni podatke radnje"
        >
          <FaEdit className="mr-2" />
          Izmeni
        </button>
      )}

      {/* Kombinovani Header/Hero Section */}
      <div className="bg-gradient-to-br from-slate-800 via-blue-900 to-slate-900 text-white mb-8 pt-4">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            {/* Leva strana - Logo i osnovne informacije */}
            <div className="flex-1 flex items-center gap-6">
              {shop.logo ? (
                <div className="flex-shrink-0">
                  <img
                    src={shop.logo}
                    alt={shop.name}
                    className="h-24 w-24 object-contain rounded-lg bg-white/10 p-2"
                  />
                </div>
              ) : (
                <div className="h-24 w-24 bg-blue-500 rounded-lg flex items-center justify-center text-white text-3xl font-bold">
                  {shop.companyName?.charAt(0) || shop.name?.charAt(0) || "S"}
                </div>
              )}

              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl md:text-4xl font-bold">
                    {shop.companyName || shop.name}
                  </h1>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 bg-green-500/20 px-3 py-1 rounded-full border border-green-400/30">
                      <FaCheckCircle className="text-green-400 text-sm" />
                      <span className="text-green-300 text-sm font-medium">
                        Verifikovano
                      </span>
                    </div>
                    {shop.isActive === false && (
                      <div className="flex items-center gap-1 bg-red-500/20 px-3 py-1 rounded-full border border-red-400/30">
                        <span className="text-red-300 text-sm font-medium">
                          Neaktivno
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {specialization && (
                  <p className="text-yellow-400 text-lg font-medium mb-3 flex items-center">
                    <FaStar className="mr-2" />
                    {specialization}
                  </p>
                )}

                {shop.description && (
                  <p className="text-gray-300 leading-relaxed">
                    {shop.description}
                  </p>
                )}
                {/* Website */}
                {shop.contact.website && (
                  <a
                    href={shop.contact.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex border items-center gap-3 hover:bg-white/5 p-2 rounded-lg transition-colors mt-2"
                  >
                    <div className="w-8 h-8 bg-orange-500/20 rounded-full flex items-center justify-center">
                      <FaGlobe className="text-orange-400" />
                    </div>
                    <span className="font-medium">{shop.contact.website}</span>
                  </a>
                )}
              </div>
            </div>

            {/* Desna strana - Kontakt i statistika */}
            <div className="flex flex-col gap-4">
              {/* Kontakt informacije */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <FaAward className="text-yellow-400" />
                  Kontaktirajte nas
                </h3>
                <div className="space-y-2">
                  {/* Telefon 1 */}
                  {contact.phone && (
                    <a
                      href={`tel:${contact.phone}`}
                      className="flex items-center gap-3 hover:bg-white/5 p-2 rounded-lg transition-colors"
                    >
                      <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                        <FaPhone className="text-green-400" />
                      </div>
                      <span className="font-medium">{contact.phone}</span>
                    </a>
                  )}

                  {/* Telefon 2 */}
                  {contact.phone2 && (
                    <a
                      href={`tel:${contact.phone2}`}
                      className="flex items-center gap-3 hover:bg-white/5 p-2 rounded-lg transition-colors"
                    >
                      <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                        <FaPhone className="text-blue-400" />
                      </div>
                      <span className="font-medium">{contact.phone2}</span>
                    </a>
                  )}

                  {/* Email */}
                  {contact.email && (
                    <a
                      href={`mailto:${contact.email}`}
                      className="flex items-center gap-3 hover:bg-white/5 p-2 rounded-lg transition-colors"
                    >
                      <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center">
                        <FaEnvelope className="text-purple-400" />
                      </div>
                      <span className="font-medium">{contact.email}</span>
                    </a>
                  )}
                </div>

                {/* Social Media */}
                {(socialMedia.facebook ||
                  socialMedia.instagram ||
                  socialMedia.linkedin) && (
                  <div className="mt-4 pt-4 border-t border-white/20 flex">
                    <h4 className="font-semibold mb-2 text-sm mr-4">
                      Pratite nas:
                    </h4>
                    <div className="flex gap-3">
                      {socialMedia.facebook && (
                        <a
                          href={socialMedia.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white hover:text-blue-300 transition-colors"
                          title="Facebook"
                        >
                          <FaFacebook className="text-xl" />
                        </a>
                      )}
                      {socialMedia.instagram && (
                        <a
                          href={socialMedia.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white hover:text-pink-300 transition-colors"
                          title="Instagram"
                        >
                          <FaInstagram className="text-xl" />
                        </a>
                      )}
                      {socialMedia.linkedin && (
                        <a
                          href={socialMedia.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white hover:text-blue-200 transition-colors"
                          title="LinkedIn"
                        >
                          <FaLinkedin className="text-xl" />
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Statistika */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/10 rounded-lg p-3 text-center border border-white/10">
                  <div className="text-2xl font-bold text-blue-400">
                    {vehicles.length}
                  </div>
                  <div className="text-xs text-gray-300">Vozila</div>
                </div>
                <div className="bg-white/10 rounded-lg p-3 text-center border border-white/10">
                  <div className="text-2xl font-bold text-green-400">
                    {services.length}
                  </div>
                  <div className="text-xs text-gray-300">Usluge</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ostali sadržaj */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        {/* Usluge */}
        {services.length > 0 && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <h3 className="text-xl font-semibold mb-4 flex items-center text-blue-500">
              <FaBox className="mr-2" />
              Usluge
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {services.map((service, index) => {
                const color = getRandomColor(index);
                return (
                  <div
                    key={index}
                    className={`bg-white rounded-lg shadow p-4 border-l-4 ${
                      color.split(" ")[0]
                    } hover:shadow-md transition-all`}
                  >
                    <h4 className={`font-semibold mb-2 ${color.split(" ")[1]}`}>
                      {service.name}
                    </h4>
                    {service.description && (
                      <p className="text-gray-600 text-sm">
                        {service.description}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Vozila */}
        {vehicles.length > 0 && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center text-green-500">
              <FaTruck className="mr-2" />
              Naša vozila ({vehicles.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vehicles.map((vehicle) => (
                <div
                  key={vehicle._id}
                  className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow bg-white"
                >
                  {vehicle.image1 ? (
                    <div className="h-40 w-full bg-gray-50 flex items-center justify-center overflow-hidden">
                      <img
                        src={vehicle.image1}
                        alt={vehicle.type}
                        className="h-full w-auto object-contain"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-40 bg-gray-100 flex items-center justify-center">
                      <FaTruck className="text-3xl text-gray-400" />
                    </div>
                  )}
                  <div className="p-4">
                    <h4 className="font-semibold text-lg mb-2 flex items-center gap-2">
                      <FaTruck className="text-green-500" />
                      {vehicle.type}
                    </h4>
                    <div className="space-y-1 text-sm text-gray-600">
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
                      <p className="text-gray-600 text-sm mt-3 pt-2 border-t border-gray-100">
                        {vehicle.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {vehicles.length === 0 && (
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <FaTruck className="text-4xl text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Trenutno nema dostupnih vozila.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopPage;
