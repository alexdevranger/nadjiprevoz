// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { useGlobalState } from "../helper/globalState";
// import { useToast } from "../components/ToastContext";
// import {
//   FaUser,
//   FaCar,
//   FaBriefcase,
//   FaGraduationCap,
//   FaLanguage,
//   FaEdit,
//   FaSave,
//   FaTimes,
//   FaPlus,
//   FaTrash,
//   FaStar,
//   FaCheck,
//   FaEuroSign,
//   FaEye,
//   FaArrowLeft,
//   FaExternalLinkAlt,
// } from "react-icons/fa";

// export default function DriverPortfolioPage() {
//   const [token] = useGlobalState("token");
//   const [user] = useGlobalState("user");
//   const [portfolio, setPortfolio] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [editing, setEditing] = useState(false);
//   const [saving, setSaving] = useState(false);
//   const [viewMode, setViewMode] = useState(false);
//   const { success, error } = useToast();
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     yearsOfExperience: 0,
//     hasOwnVehicle: false,
//     vehicleType: "",
//     licenseCategories: [],
//     previousExperience: [],
//     skills: [],
//     languages: [],
//     availability: "dostupan",
//     preferredJobTypes: [],
//     salaryExpectation: "",
//     aboutMe: "",
//   });

//   const [newExperience, setNewExperience] = useState({
//     companyName: "",
//     position: "",
//     startDate: "",
//     endDate: "",
//     description: "",
//     current: false,
//   });

//   const [newLanguage, setNewLanguage] = useState({
//     language: "",
//     level: "srednji",
//   });

//   const [newSkill, setNewSkill] = useState("");

//   const licenseOptions = ["B", "C", "C1", "C+E", "D", "D1"];
//   const vehicleTypes = [
//     "kamion",
//     "dostavno_vozilo",
//     "teretno_vozilo",
//     "ostalo",
//   ];
//   const languageLevels = ["osnovni", "srednji", "napredni", "maternji"];
//   const availabilityOptions = [
//     { value: "dostupan", label: "Dostupan" },
//     { value: "zauzet", label: "Zauzet" },
//     { value: "uskoro_dostupan", label: "Uskoro dostupan" },
//   ];

//   useEffect(() => {
//     fetchPortfolio();
//   }, []);

//   const fetchPortfolio = async () => {
//     try {
//       const response = await axios.get("/api/portfolio/my-portfolio", {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (response.data.success) {
//         if (response.data.portfolio) {
//           setPortfolio(response.data.portfolio);
//           setFormData(response.data.portfolio);
//         } else {
//           // Portfolio ne postoji - inicijalizuj prazan formular
//           setPortfolio(null);
//           setFormData({
//             yearsOfExperience: 0,
//             hasOwnVehicle: false,
//             vehicleType: "",
//             licenseCategories: [],
//             previousExperience: [],
//             skills: [],
//             languages: [],
//             availability: "dostupan",
//             preferredJobTypes: [],
//             salaryExpectation: "",
//             aboutMe: "",
//           });
//         }
//       }
//     } catch (err) {
//       console.error("Greška pri učitavanju portfolija:", err);

//       // Inicijalizuj prazan formular i prikaži grešku samo ako nije "portfolio ne postoji"
//       if (err.response?.status !== 404) {
//         error("Greška pri učitavanju portfolija");
//       }

//       setPortfolio(null);
//       setFormData({
//         yearsOfExperience: 0,
//         hasOwnVehicle: false,
//         vehicleType: "",
//         licenseCategories: [],
//         previousExperience: [],
//         skills: [],
//         languages: [],
//         availability: "dostupan",
//         preferredJobTypes: [],
//         salaryExpectation: "",
//         aboutMe: "",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSave = async () => {
//     setSaving(true);
//     try {
//       const response = await axios.post("/api/portfolio", formData, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (response.data.success) {
//         setPortfolio(response.data.portfolio);
//         setEditing(false);
//         setViewMode(false);
//         success("Portfolio uspešno sačuvan!");
//         fetchPortfolio(); // Refresh data
//       }
//     } catch (err) {
//       console.error("Greška pri čuvanju portfolija:", err);
//       error("Greška pri čuvanju portfolija");
//     } finally {
//       setSaving(false);
//     }
//   };

//   const addExperience = () => {
//     if (!newExperience.companyName || !newExperience.position) {
//       error("Popunite obavezna polja (kompanija i pozicija)");
//       return;
//     }

//     setFormData({
//       ...formData,
//       previousExperience: [
//         ...formData.previousExperience,
//         { ...newExperience },
//       ],
//     });

//     setNewExperience({
//       companyName: "",
//       position: "",
//       startDate: "",
//       endDate: "",
//       description: "",
//       current: false,
//     });
//   };

//   const removeExperience = (index) => {
//     const updatedExperiences = formData.previousExperience.filter(
//       (_, i) => i !== index
//     );
//     setFormData({ ...formData, previousExperience: updatedExperiences });
//   };

//   const addLanguage = () => {
//     if (!newLanguage.language) {
//       error("Unesite jezik");
//       return;
//     }

//     setFormData({
//       ...formData,
//       languages: [...formData.languages, { ...newLanguage }],
//     });

//     setNewLanguage({ language: "", level: "srednji" });
//   };

//   const removeLanguage = (index) => {
//     const updatedLanguages = formData.languages.filter((_, i) => i !== index);
//     setFormData({ ...formData, languages: updatedLanguages });
//   };

//   const addSkill = () => {
//     const skill = newSkill.trim();
//     if (skill && !formData.skills.includes(skill)) {
//       setFormData({
//         ...formData,
//         skills: [...formData.skills, skill],
//       });
//       setNewSkill("");
//     }
//   };

//   const removeSkill = (skillToRemove) => {
//     setFormData({
//       ...formData,
//       skills: formData.skills.filter((skill) => skill !== skillToRemove),
//     });
//   };

//   const handleLicenseToggle = (license) => {
//     const updatedLicenses = formData.licenseCategories.includes(license)
//       ? formData.licenseCategories.filter((l) => l !== license)
//       : [...formData.licenseCategories, license];

//     setFormData({ ...formData, licenseCategories: updatedLicenses });
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return "";
//     const date = new Date(dateString);
//     return date.toLocaleDateString("sr-RS");
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Header */}
//         <div className="bg-white rounded-xl shadow-md p-6 mb-6">
//           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//             <div className="flex items-center">
//               <button
//                 onClick={() => navigate("/dashboard")}
//                 className="mr-4 text-gray-600 hover:text-gray-800 p-2 rounded-lg hover:bg-gray-100"
//               >
//                 <FaArrowLeft size={20} />
//               </button>
//               <div>
//                 <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
//                   {viewMode ? "Pregled Portfolija" : "Moj Portfolio Vozača"}
//                 </h1>
//                 <p className="text-gray-600 mt-2">
//                   {viewMode
//                     ? "Ovako će vaš portfolio izgledati poslodavcima"
//                     : portfolio
//                     ? "Upravljajte vašim profesionalnim portfolioom"
//                     : "Kreirajte profesionalni portfolio kako biste se istakli pred poslodavcima"}
//                 </p>
//               </div>
//             </div>

//             <div className="flex flex-wrap gap-3">
//               {!viewMode ? (
//                 <>
//                   {!editing ? (
//                     <>
//                       <button
//                         onClick={() => setEditing(true)}
//                         className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
//                       >
//                         <FaEdit className="mr-2" />{" "}
//                         {portfolio ? "Izmeni" : "Kreiraj"} Portfolio
//                       </button>
//                       {portfolio && (
//                         <button
//                           onClick={() => setViewMode(true)}
//                           className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center"
//                         >
//                           <FaEye className="mr-2" /> Pregledaj
//                         </button>
//                       )}
//                       <button
//                         onClick={() => navigate("/dashboard")}
//                         className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
//                       >
//                         Nazad
//                       </button>
//                     </>
//                   ) : (
//                     <>
//                       <button
//                         onClick={handleSave}
//                         disabled={saving}
//                         className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center disabled:opacity-50"
//                       >
//                         <FaSave className="mr-2" />
//                         {saving ? "Čuvanje..." : "Sačuvaj"}
//                       </button>
//                       <button
//                         onClick={() => {
//                           setEditing(false);
//                           setFormData(portfolio || formData);
//                         }}
//                         className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center"
//                       >
//                         <FaTimes className="mr-2" /> Otkaži
//                       </button>
//                     </>
//                   )}
//                 </>
//               ) : (
//                 <>
//                   <button
//                     onClick={() => setViewMode(false)}
//                     className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
//                   >
//                     <FaEdit className="mr-2" /> Nastavi sa Izmenama
//                   </button>
//                   <button
//                     onClick={() => navigate("/dashboard")}
//                     className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
//                   >
//                     Zatvori
//                   </button>
//                 </>
//               )}
//             </div>
//           </div>

//           {/* Status Badges */}
//           <div className="flex flex-wrap gap-3 mt-4">
//             {portfolio?.hasPaidPortfolio && (
//               <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-4 py-2 rounded-lg inline-flex items-center">
//                 <FaStar className="mr-2" /> Premium Portfolio
//               </div>
//             )}
//             <div
//               className={`px-4 py-2 rounded-lg inline-flex items-center ${
//                 portfolio
//                   ? "bg-green-100 text-green-800"
//                   : "bg-yellow-100 text-yellow-800"
//               }`}
//             >
//               <FaCheck className="mr-2" />
//               {portfolio ? "Portfolio Aktivan" : "Portfolio Nije Kreiran"}
//             </div>
//           </div>
//         </div>

//         {/* Main Content */}
//         <div
//           className={`space-y-6 ${
//             viewMode ? "pointer-events-none opacity-95" : ""
//           }`}
//         >
//           {/* Osnovne Informacije */}
//           <div className="bg-white rounded-xl shadow-md p-6">
//             <div className="flex items-center mb-6">
//               <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-3">
//                 <FaUser className="text-2xl" />
//               </div>
//               <h2 className="text-xl font-semibold">Osnovne Informacije</h2>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Godine iskustva {editing && "*"}
//                 </label>
//                 {editing ? (
//                   <input
//                     type="number"
//                     min="0"
//                     max="50"
//                     value={formData.yearsOfExperience}
//                     onChange={(e) =>
//                       setFormData({
//                         ...formData,
//                         yearsOfExperience: parseInt(e.target.value) || 0,
//                       })
//                     }
//                     className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 ) : (
//                   <p className="text-lg font-medium">
//                     {formData.yearsOfExperience || 0}{" "}
//                     {formData.yearsOfExperience === 1 ? "godina" : "godine"}
//                   </p>
//                 )}
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Vozilo
//                 </label>
//                 {editing ? (
//                   <div className="space-y-3">
//                     <div className="flex items-center">
//                       <input
//                         type="checkbox"
//                         checked={formData.hasOwnVehicle}
//                         onChange={(e) =>
//                           setFormData({
//                             ...formData,
//                             hasOwnVehicle: e.target.checked,
//                           })
//                         }
//                         className="mr-2"
//                       />
//                       <span>Imam sopstveno vozilo</span>
//                     </div>

//                     {formData.hasOwnVehicle && (
//                       <select
//                         value={formData.vehicleType}
//                         onChange={(e) =>
//                           setFormData({
//                             ...formData,
//                             vehicleType: e.target.value,
//                           })
//                         }
//                         className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       >
//                         <option value="">Izaberite vrstu vozila</option>
//                         {vehicleTypes.map((type) => (
//                           <option key={type} value={type}>
//                             {type.replace("_", " ").toUpperCase()}
//                           </option>
//                         ))}
//                       </select>
//                     )}
//                   </div>
//                 ) : (
//                   <p className="text-lg font-medium">
//                     {formData.hasOwnVehicle
//                       ? `Da (${
//                           formData.vehicleType
//                             ?.replace("_", " ")
//                             .toUpperCase() || "Nepoznato"
//                         })`
//                       : "Ne"}
//                   </p>
//                 )}
//               </div>

//               <div className="md:col-span-2">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Kategorije vozačke dozvole
//                 </label>
//                 {editing ? (
//                   <div className="flex flex-wrap gap-2">
//                     {licenseOptions.map((license) => (
//                       <label
//                         key={license}
//                         className="flex items-center space-x-2 bg-gray-100 px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-200"
//                       >
//                         <input
//                           type="checkbox"
//                           checked={formData.licenseCategories.includes(license)}
//                           onChange={() => handleLicenseToggle(license)}
//                           className="rounded"
//                         />
//                         <span>{license}</span>
//                       </label>
//                     ))}
//                   </div>
//                 ) : (
//                   <div className="flex flex-wrap gap-2">
//                     {formData.licenseCategories?.map((license) => (
//                       <span
//                         key={license}
//                         className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
//                       >
//                         {license}
//                       </span>
//                     ))}
//                     {(!formData.licenseCategories ||
//                       formData.licenseCategories.length === 0) && (
//                       <span className="text-gray-500">
//                         Nema unetih kategorija
//                       </span>
//                     )}
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Prethodno Iskustvo */}
//           <div className="bg-white rounded-xl shadow-md p-6">
//             <div className="flex items-center mb-6">
//               <div className="p-3 rounded-full bg-green-100 text-green-600 mr-3">
//                 <FaBriefcase className="text-2xl" />
//               </div>
//               <h2 className="text-xl font-semibold">Prethodno Iskustvo</h2>
//             </div>

//             {editing && (
//               <div className="mb-6 p-4 bg-gray-50 rounded-lg">
//                 <h3 className="font-medium mb-3">Dodaj novo iskustvo</h3>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
//                   <input
//                     type="text"
//                     placeholder="Naziv kompanije *"
//                     value={newExperience.companyName}
//                     onChange={(e) =>
//                       setNewExperience({
//                         ...newExperience,
//                         companyName: e.target.value,
//                       })
//                     }
//                     className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                   <input
//                     type="text"
//                     placeholder="Pozicija *"
//                     value={newExperience.position}
//                     onChange={(e) =>
//                       setNewExperience({
//                         ...newExperience,
//                         position: e.target.value,
//                       })
//                     }
//                     className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                   <input
//                     type="month"
//                     placeholder="Početak"
//                     value={newExperience.startDate}
//                     onChange={(e) =>
//                       setNewExperience({
//                         ...newExperience,
//                         startDate: e.target.value,
//                       })
//                     }
//                     className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                   <div className="flex items-center space-x-3">
//                     <input
//                       type="month"
//                       placeholder="Kraj"
//                       value={newExperience.endDate}
//                       onChange={(e) =>
//                         setNewExperience({
//                           ...newExperience,
//                           endDate: e.target.value,
//                         })
//                       }
//                       disabled={newExperience.current}
//                       className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
//                     />
//                     <label className="flex items-center">
//                       <input
//                         type="checkbox"
//                         checked={newExperience.current}
//                         onChange={(e) =>
//                           setNewExperience({
//                             ...newExperience,
//                             current: e.target.checked,
//                             endDate: e.target.checked
//                               ? ""
//                               : newExperience.endDate,
//                           })
//                         }
//                         className="mr-2"
//                       />
//                       <span className="text-sm">Trenutno</span>
//                     </label>
//                   </div>
//                 </div>
//                 <textarea
//                   placeholder="Opis posla (opciono)"
//                   value={newExperience.description}
//                   onChange={(e) =>
//                     setNewExperience({
//                       ...newExperience,
//                       description: e.target.value,
//                     })
//                   }
//                   rows="2"
//                   className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
//                 />
//                 <button
//                   onClick={addExperience}
//                   className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
//                 >
//                   <FaPlus className="mr-2" /> Dodaj Iskustvo
//                 </button>
//               </div>
//             )}

//             <div className="space-y-4">
//               {formData.previousExperience.map((exp, index) => (
//                 <div
//                   key={index}
//                   className="border-l-4 border-blue-500 pl-4 py-2 bg-gray-50 rounded-r-lg"
//                 >
//                   <div className="flex justify-between items-start">
//                     <div className="flex-1">
//                       <h3 className="font-semibold text-lg">{exp.position}</h3>
//                       <p className="text-gray-600 font-medium">
//                         {exp.companyName}
//                       </p>
//                       <p className="text-sm text-gray-500">
//                         {formatDate(exp.startDate)} -{" "}
//                         {exp.current ? "Sada" : formatDate(exp.endDate)}
//                       </p>
//                       {exp.description && (
//                         <p className="text-gray-700 mt-2 text-sm">
//                           {exp.description}
//                         </p>
//                       )}
//                     </div>
//                     {editing && (
//                       <button
//                         onClick={() => removeExperience(index)}
//                         className="text-red-500 hover:text-red-700 ml-4 p-2"
//                         title="Obriši iskustvo"
//                       >
//                         <FaTrash />
//                       </button>
//                     )}
//                   </div>
//                 </div>
//               ))}

//               {formData.previousExperience.length === 0 && (
//                 <p className="text-gray-500 text-center py-4">
//                   {editing
//                     ? "Dodajte svoje prvo radno iskustvo"
//                     : "Nema unetog radnog iskustva"}
//                 </p>
//               )}
//             </div>
//           </div>

//           {/* Veštine i Jezici */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {/* Veštine */}
//             <div className="bg-white rounded-xl shadow-md p-6">
//               <div className="flex items-center mb-6">
//                 <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-3">
//                   <FaGraduationCap className="text-2xl" />
//                 </div>
//                 <h2 className="text-xl font-semibold">Veštine</h2>
//               </div>

//               {editing ? (
//                 <div>
//                   <div className="flex mb-3">
//                     <input
//                       type="text"
//                       placeholder="Dodaj novu veštinu"
//                       value={newSkill}
//                       onChange={(e) => setNewSkill(e.target.value)}
//                       onKeyPress={(e) => {
//                         if (e.key === "Enter" && newSkill.trim()) {
//                           addSkill();
//                         }
//                       }}
//                       className="flex-1 border border-gray-300 rounded-l-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     />
//                     <button
//                       onClick={addSkill}
//                       disabled={!newSkill.trim()}
//                       className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r-lg disabled:opacity-50 disabled:cursor-not-allowed"
//                     >
//                       <FaPlus />
//                     </button>
//                   </div>
//                   <div className="flex flex-wrap gap-2">
//                     {formData.skills.map((skill, index) => (
//                       <span
//                         key={index}
//                         className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center"
//                       >
//                         {skill}
//                         <button
//                           onClick={() => removeSkill(skill)}
//                           className="ml-2 text-red-500 hover:text-red-700"
//                         >
//                           <FaTimes size={12} />
//                         </button>
//                       </span>
//                     ))}
//                   </div>
//                 </div>
//               ) : (
//                 <div className="flex flex-wrap gap-2">
//                   {formData.skills.map((skill, index) => (
//                     <span
//                       key={index}
//                       className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
//                     >
//                       {skill}
//                     </span>
//                   ))}
//                   {formData.skills.length === 0 && (
//                     <span className="text-gray-500">Nema unetih veština</span>
//                   )}
//                 </div>
//               )}
//             </div>

//             {/* Jezici */}
//             <div className="bg-white rounded-xl shadow-md p-6">
//               <div className="flex items-center mb-6">
//                 <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-3">
//                   <FaLanguage className="text-2xl" />
//                 </div>
//                 <h2 className="text-xl font-semibold">Jezici</h2>
//               </div>

//               {editing ? (
//                 <div>
//                   <div className="flex mb-3 gap-2">
//                     <input
//                       type="text"
//                       placeholder="Jezik"
//                       value={newLanguage.language}
//                       onChange={(e) =>
//                         setNewLanguage({
//                           ...newLanguage,
//                           language: e.target.value,
//                         })
//                       }
//                       className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     />
//                     <select
//                       value={newLanguage.level}
//                       onChange={(e) =>
//                         setNewLanguage({
//                           ...newLanguage,
//                           level: e.target.value,
//                         })
//                       }
//                       className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     >
//                       {languageLevels.map((level) => (
//                         <option key={level} value={level}>
//                           {level.charAt(0).toUpperCase() + level.slice(1)}
//                         </option>
//                       ))}
//                     </select>
//                     <button
//                       onClick={addLanguage}
//                       disabled={!newLanguage.language.trim()}
//                       className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
//                     >
//                       <FaPlus />
//                     </button>
//                   </div>
//                   <div className="space-y-2">
//                     {formData.languages.map((lang, index) => (
//                       <div
//                         key={index}
//                         className="flex justify-between items-center bg-gray-50 px-3 py-2 rounded-lg"
//                       >
//                         <span className="font-medium capitalize">
//                           {lang.language}
//                         </span>
//                         <div className="flex items-center space-x-2">
//                           <span className="text-sm text-gray-600 capitalize">
//                             {lang.level}
//                           </span>
//                           <button
//                             onClick={() => removeLanguage(index)}
//                             className="text-red-500 hover:text-red-700 p-1"
//                             title="Obriši jezik"
//                           >
//                             <FaTrash size={14} />
//                           </button>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               ) : (
//                 <div className="space-y-2">
//                   {formData.languages.map((lang, index) => (
//                     <div
//                       key={index}
//                       className="flex justify-between items-center bg-gray-50 px-3 py-2 rounded-lg"
//                     >
//                       <span className="font-medium capitalize">
//                         {lang.language}
//                       </span>
//                       <span className="text-sm text-gray-600 capitalize">
//                         {lang.level}
//                       </span>
//                     </div>
//                   ))}
//                   {formData.languages.length === 0 && (
//                     <span className="text-gray-500">Nema unetih jezika</span>
//                   )}
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Dodatne Informacije */}
//           <div className="bg-white rounded-xl shadow-md p-6">
//             <div className="flex items-center mb-6">
//               <div className="p-3 rounded-full bg-indigo-100 text-indigo-600 mr-3">
//                 <FaEuroSign className="text-2xl" />
//               </div>
//               <h2 className="text-xl font-semibold">Dodatne Informacije</h2>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Dostupnost
//                 </label>
//                 {editing ? (
//                   <select
//                     value={formData.availability}
//                     onChange={(e) =>
//                       setFormData({ ...formData, availability: e.target.value })
//                     }
//                     className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   >
//                     {availabilityOptions.map((option) => (
//                       <option key={option.value} value={option.value}>
//                         {option.label}
//                       </option>
//                     ))}
//                   </select>
//                 ) : (
//                   <p className="text-lg font-medium capitalize">
//                     {availabilityOptions.find(
//                       (opt) => opt.value === formData.availability
//                     )?.label || formData.availability}
//                   </p>
//                 )}
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Očekivana plata (€)
//                 </label>
//                 {editing ? (
//                   <input
//                     type="number"
//                     value={formData.salaryExpectation}
//                     onChange={(e) =>
//                       setFormData({
//                         ...formData,
//                         salaryExpectation: e.target.value,
//                       })
//                     }
//                     className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     placeholder="Unesite izraz želje"
//                   />
//                 ) : (
//                   <p className="text-lg font-medium">
//                     {formData.salaryExpectation
//                       ? `${formData.salaryExpectation} €`
//                       : "Nije navedeno"}
//                   </p>
//                 )}
//               </div>

//               <div className="md:col-span-2">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   O meni
//                 </label>
//                 {editing ? (
//                   <textarea
//                     value={formData.aboutMe}
//                     onChange={(e) =>
//                       setFormData({ ...formData, aboutMe: e.target.value })
//                     }
//                     rows="4"
//                     placeholder="Opisite sebe, vaše profesionalne ciljeve i šta vas čini dobrim vozačem..."
//                     className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     maxLength="1000"
//                   />
//                 ) : (
//                   <p className="text-gray-700 whitespace-pre-wrap">
//                     {formData.aboutMe || "Nema unetog opisa."}
//                   </p>
//                 )}
//                 {editing && (
//                   <p className="text-xs text-gray-500 mt-1">
//                     {formData.aboutMe.length}/1000 karaktera
//                   </p>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Call to Action za Premium */}
//         {!portfolio?.hasPaidPortfolio && !viewMode && portfolio && (
//           <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl shadow-lg p-6 text-white text-center mt-8">
//             <FaStar className="text-3xl mx-auto mb-4" />
//             <h3 className="text-xl font-bold mb-2">
//               Nadogradite na Premium Portfolio!
//             </h3>
//             <p className="mb-4 opacity-90">
//               Dobijte više pregleda, istaknuti prikaz i direktne kontakte
//               poslodavaca
//             </p>
//             <button className="bg-white text-purple-600 font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors">
//               Nadogradi na Premium - 9.99€/mesečno
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

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
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
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

  const fetchPortfolio = async () => {
    try {
      const response = await axios.get("/api/portfolio/my-portfolio", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Portfolio fetch response:", response.data);

      if (response.data.success) {
        if (response.data.portfolio) {
          setPortfolio(response.data.portfolio);
          setFormData({
            ...response.data.portfolio,
            contactInfo: response.data.portfolio.contactInfo || {
              phone: "",
              email: "",
            },
            slug:
              response.data.portfolio.slug || generateSlug(user?.name || ""),
          });
        } else {
          // Portfolio ne postoji - inicijalizuj prazan formular
          setPortfolio(null);
          setFormData({
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
      const response = await axios.post("/api/portfolio", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setPortfolio(response.data.portfolio);
        setEditing(false);
        setViewMode(false);
        success("Portfolio uspešno sačuvan!");
        fetchPortfolio(); // Refresh data
      }
    } catch (err) {
      console.error("Greška pri čuvanju portfolija:", err);
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
    const updatedVehicles = formData.vehicles.includes(vehicleId)
      ? formData.vehicles.filter((id) => id !== vehicleId)
      : [...formData.vehicles, vehicleId];

    setFormData({ ...formData, vehicles: updatedVehicles });
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center">
              <button
                onClick={() => navigate("/dashboard")}
                className="mr-4 text-gray-600 hover:text-gray-800 p-2 rounded-lg hover:bg-gray-100"
              >
                <FaArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                  {viewMode ? "Pregled Portfolija" : "Moj Portfolio Vozača"}
                </h1>
                <p className="text-gray-600 mt-2">
                  {viewMode
                    ? "Ovako će vaš portfolio izgledati poslodavcima"
                    : portfolio
                    ? "Upravljajte vašim profesionalnim portfolioom"
                    : "Kreirajte profesionalni portfolio kako biste se istakli pred poslodavcima"}
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
                        {portfolio ? "Izmeni" : "Kreiraj"} Portfolio
                      </button>
                      {portfolio && (
                        <>
                          <button
                            onClick={() => setViewMode(true)}
                            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center"
                          >
                            <FaEye className="mr-2" /> Pregledaj
                          </button>
                          <a
                            href={`/driver/${portfolio.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center"
                          >
                            <FaExternalLinkAlt className="mr-2" /> Javni Pogled
                          </a>
                        </>
                      )}
                      <button
                        onClick={() => navigate("/dashboard")}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
                      >
                        Nazad
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
                        {saving ? "Čuvanje..." : "Sačuvaj"}
                      </button>
                      <button
                        onClick={() => {
                          setEditing(false);
                          setFormData(portfolio || formData);
                        }}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center"
                      >
                        <FaTimes className="mr-2" /> Otkaži
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
                    <FaEdit className="mr-2" /> Nastavi sa Izmenama
                  </button>
                  <button
                    onClick={() => navigate("/dashboard")}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
                  >
                    Zatvori
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Status Badges */}
          <div className="flex flex-wrap gap-3 mt-4">
            {portfolio?.hasPaidPortfolio && (
              <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-4 py-2 rounded-lg inline-flex items-center">
                <FaStar className="mr-2" /> Premium Portfolio
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
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center mb-6">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-3">
                <FaUser className="text-2xl" />
              </div>
              <h2 className="text-xl font-semibold">Kontakt Informacije</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ime i prezime
                </label>
                <p className="text-lg font-medium bg-gray-50 p-3 rounded-lg">
                  {user?.name || "Nije postavljeno"}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
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
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-lg font-medium bg-gray-50 p-3 rounded-lg">
                    {formData.contactInfo.email || "Nije postavljeno"}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telefon
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
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-lg font-medium bg-gray-50 p-3 rounded-lg">
                    {formData.contactInfo.phone || "Nije postavljeno"}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL Portfolija
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
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="vas-ime-prezime"
                    />
                    {slugAvailable !== null && (
                      <p
                        className={`text-sm mt-1 ${
                          slugAvailable ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {slugAvailable
                          ? "✓ URL je dostupan"
                          : "✗ URL je zauzet"}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      Vaš portfolio će biti dostupan na: /driver/{formData.slug}
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <p className="text-lg font-medium bg-gray-50 p-3 rounded-lg flex-1">
                      /driver/{formData.slug}
                    </p>
                    {portfolio && (
                      <a
                        href={`/driver/${formData.slug}`}
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
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center mb-6">
              <div className="p-3 rounded-full bg-green-100 text-green-600 mr-3">
                <FaBriefcase className="text-2xl" />
              </div>
              <h2 className="text-xl font-semibold">Osnovne Informacije</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Godine iskustva {editing && "*"}
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
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-lg font-medium bg-gray-50 p-3 rounded-lg">
                    {formData.yearsOfExperience || 0}{" "}
                    {formData.yearsOfExperience === 1 ? "godina" : "godine"}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kategorije vozačke dozvole
                </label>
                {editing ? (
                  <div className="flex flex-wrap gap-2">
                    {licenseOptions.map((license) => (
                      <label
                        key={license}
                        className="flex items-center space-x-2 bg-gray-100 px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-200"
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
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                      >
                        {license}
                      </span>
                    ))}
                    {(!formData.licenseCategories ||
                      formData.licenseCategories.length === 0) && (
                      <span className="text-gray-500 bg-gray-50 p-3 rounded-lg">
                        Nema unetih kategorija
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Moja Vozila */}
          {userVehicles.length > 0 && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center mb-6">
                <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-3">
                  <FaCar className="text-2xl" />
                </div>
                <h2 className="text-xl font-semibold">Moja Vozila</h2>
              </div>

              {editing ? (
                <div className="space-y-3">
                  <p className="text-sm text-gray-600 mb-4">
                    Odaberite vozila iz vaše liste koja želite da prikažete u
                    portfolio-u:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {userVehicles.map((vehicle) => (
                      <label
                        key={vehicle._id}
                        className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={formData.vehicles.includes(vehicle._id)}
                          onChange={() => handleVehicleToggle(vehicle._id)}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="font-medium">{vehicle.type}</div>
                          <div className="text-sm text-gray-600">
                            {vehicle.licensePlate} • {vehicle.capacity}kg
                            {vehicle.brand && ` • ${vehicle.brand}`}
                            {vehicle.model && ` ${vehicle.model}`}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {userVehicles
                    .filter((vehicle) =>
                      formData.vehicles.includes(vehicle._id)
                    )
                    .map((vehicle) => (
                      <div
                        key={vehicle._id}
                        className="border rounded-lg p-4 bg-gray-50"
                      >
                        <div className="font-medium">{vehicle.type}</div>
                        <div className="text-sm text-gray-600">
                          {vehicle.licensePlate} • {vehicle.capacity}kg
                          {vehicle.brand && ` • ${vehicle.brand}`}
                          {vehicle.model && ` ${vehicle.model}`}
                        </div>
                      </div>
                    ))}
                  {userVehicles.filter((vehicle) =>
                    formData.vehicles.includes(vehicle._id)
                  ).length === 0 && (
                    <div className="col-span-2 text-center text-gray-500 py-4">
                      Nema odabranih vozila za prikaz
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Prethodno Iskustvo, Veštine, Jezici i Dodatne Informacije ostaju iste kao u prethodnoj komponenti */}
          {/* ... (ostale sekcije) ... */}
          {/* Prethodno Iskustvo */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center mb-6">
              <div className="p-3 rounded-full bg-green-100 text-green-600 mr-3">
                <FaBriefcase className="text-2xl" />
              </div>
              <h2 className="text-xl font-semibold">Prethodno Iskustvo</h2>
            </div>

            {editing && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium mb-3">Dodaj novo iskustvo</h3>
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
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
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
                      <span className="text-sm">Trenutno</span>
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
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
                />
                <button
                  onClick={addExperience}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
                >
                  <FaPlus className="mr-2" /> Dodaj Iskustvo
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
                        title="Obriši iskustvo"
                      >
                        <FaTrash />
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {formData.previousExperience.length === 0 && (
                <p className="text-gray-500 text-center py-4">
                  {editing
                    ? "Dodajte svoje prvo radno iskustvo"
                    : "Nema unetog radnog iskustva"}
                </p>
              )}
            </div>
          </div>

          {/* Veštine i Jezici */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Veštine */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center mb-6">
                <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-3">
                  <FaGraduationCap className="text-2xl" />
                </div>
                <h2 className="text-xl font-semibold">Veštine</h2>
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
                      className="flex-1 border border-gray-300 rounded-l-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center"
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
                    <span className="text-gray-500">Nema unetih veština</span>
                  )}
                </div>
              )}
            </div>

            {/* Jezici */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center mb-6">
                <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-3">
                  <FaLanguage className="text-2xl" />
                </div>
                <h2 className="text-xl font-semibold">Jezici</h2>
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
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <select
                      value={newLanguage.level}
                      onChange={(e) =>
                        setNewLanguage({
                          ...newLanguage,
                          level: e.target.value,
                        })
                      }
                      className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                        className="flex justify-between items-center bg-gray-50 px-3 py-2 rounded-lg"
                      >
                        <span className="font-medium capitalize">
                          {lang.language}
                        </span>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600 capitalize">
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
                    <span className="text-gray-500">Nema unetih jezika</span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Dodatne Informacije */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center mb-6">
              <div className="p-3 rounded-full bg-indigo-100 text-indigo-600 mr-3">
                <FaEuroSign className="text-2xl" />
              </div>
              <h2 className="text-xl font-semibold">Dodatne Informacije</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dostupnost
                </label>
                {editing ? (
                  <select
                    value={formData.availability}
                    onChange={(e) =>
                      setFormData({ ...formData, availability: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {availabilityOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="text-lg font-medium capitalize">
                    {availabilityOptions.find(
                      (opt) => opt.value === formData.availability
                    )?.label || formData.availability}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Očekivana plata (€)
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
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Unesite izraz želje"
                  />
                ) : (
                  <p className="text-lg font-medium">
                    {formData.salaryExpectation
                      ? `${formData.salaryExpectation} €`
                      : "Nije navedeno"}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  O meni
                </label>
                {editing ? (
                  <textarea
                    value={formData.aboutMe}
                    onChange={(e) =>
                      setFormData({ ...formData, aboutMe: e.target.value })
                    }
                    rows="4"
                    placeholder="Opisite sebe, vaše profesionalne ciljeve i šta vas čini dobrim vozačem..."
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    maxLength="1000"
                  />
                ) : (
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {formData.aboutMe || "Nema unetog opisa."}
                  </p>
                )}
                {editing && (
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.aboutMe.length}/1000 karaktera
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action za Premium */}
        {!portfolio?.hasPaidPortfolio && !viewMode && portfolio && (
          <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl shadow-lg p-6 text-white text-center mt-8">
            <FaStar className="text-3xl mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">
              Nadogradite na Premium Portfolio!
            </h3>
            <p className="mb-4 opacity-90">
              Dobijte više pregleda, istaknuti prikaz i direktne kontakte
              poslodavaca
            </p>
            <button className="bg-white text-purple-600 font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors">
              Nadogradi na Premium - 9.99€/mesečno
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
