// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { Link } from "react-router-dom";
// import {
//   FaBriefcase,
//   FaMapMarkerAlt,
//   FaMoneyBillWave,
//   FaUserTie,
//   FaEnvelope,
//   FaPhone,
//   FaUser,
//   FaBuilding,
//   FaFilter,
//   FaSearch,
//   FaSyncAlt,
//   FaEye,
//   FaAlignLeft,
//   FaPaperPlane,
// } from "react-icons/fa";

// export default function AllJobs() {
//   const [jobs, setJobs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [filteredJobs, setFilteredJobs] = useState([]);
//   const [filters, setFilters] = useState({
//     search: "",
//     employmentType: "",
//     location: "",
//   });

//   const fetchJobs = async () => {
//     try {
//       const res = await axios.get("/api/jobs");
//       console.log("Oglasi:", res.data);
//       const activeJobs = res.data.filter(
//         (job) => job.isActive && job.status === "aktivan"
//       );
//       setJobs(activeJobs);
//       setFilteredJobs(activeJobs);
//     } catch (err) {
//       console.error("Greška pri učitavanju oglasa:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchJobs();
//   }, []);

//   // Aplikuj filtere
//   useEffect(() => {
//     let result = jobs;

//     if (filters.search) {
//       const searchLower = filters.search.toLowerCase();
//       result = result.filter(
//         (job) =>
//           job.title.toLowerCase().includes(searchLower) ||
//           job.position.toLowerCase().includes(searchLower) ||
//           job.description.toLowerCase().includes(searchLower) ||
//           (job.company?.companyName &&
//             job.company.companyName.toLowerCase().includes(searchLower))
//       );
//     }

//     if (filters.employmentType) {
//       result = result.filter(
//         (job) => job.employmentType === filters.employmentType
//       );
//     }

//     if (filters.location) {
//       result = result.filter((job) =>
//         job.location.some((loc) =>
//           loc.toLowerCase().includes(filters.location.toLowerCase())
//         )
//       );
//     }

//     setFilteredJobs(result);
//   }, [filters, jobs]);

//   const handleFilterChange = (key, value) => {
//     setFilters((prev) => ({
//       ...prev,
//       [key]: value,
//     }));
//   };

//   const resetFilters = () => {
//     setFilters({
//       search: "",
//       employmentType: "",
//       location: "",
//     });
//   };

//   // Jedinstvene vrednosti za filtere
//   const employmentTypes = [...new Set(jobs.map((job) => job.employmentType))];
//   const allLocations = [...new Set(jobs.flatMap((job) => job.location))];

//   // Funkcija za generisanje nasumične boje za border
//   const getRandomBorderColor = (index) => {
//     const colors = [
//       "border-blue-500",
//       "border-green-500",
//       "border-purple-500",
//       "border-yellow-500",
//       "border-indigo-500",
//       "border-pink-500",
//       "border-orange-500",
//     ];
//     return colors[index % colors.length];
//   };

//   const formatContactInfo = (contact) => {
//     if (!contact) return null;

//     const { person, email, phone } = contact;
//     if (!person && !email && !phone) return null;

//     return (
//       <div className="border-t pt-3 mt-3">
//         <h4 className="font-medium text-gray-800 mb-2 text-sm">
//           Kontakt informacije:
//         </h4>
//         <div className="space-y-1 text-sm">
//           {person && (
//             <div className="flex items-center text-gray-600">
//               <FaUser className="text-blue-500 mr-2 text-xs" />
//               {person}
//             </div>
//           )}
//           {phone && (
//             <div className="flex items-center text-gray-600">
//               <FaPhone className="text-green-500 mr-2 text-xs" />
//               {phone}
//             </div>
//           )}
//           {email && (
//             <div className="flex items-center text-gray-600">
//               <FaEnvelope className="text-purple-500 mr-2 text-xs" />
//               {email}
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Header */}
//         <div className="bg-white rounded-xl shadow-md p-6 mb-6">
//           <div className="flex flex-col md:flex-row md:items-center justify-between">
//             <div>
//               <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center">
//                 Svi Oglasi za Posao
//                 <span className="ml-3 text-lg font-medium text-blue-400 border-l-2 border-gray-300 pl-3">
//                   {jobs.length} {jobs.length === 1 ? "oglas" : "oglasa"}
//                 </span>
//               </h1>
//               <p className="text-gray-600 mt-2">
//                 Pronađite savršen posao za vas medju našim oglasima
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Filteri */}
//         <div className="bg-white rounded-xl shadow-md p-6 mb-6">
//           <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
//             <FaFilter className="text-blue-500 mr-2" />
//             Pretraga i filteri
//           </h2>

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//             {/* Pretraga */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
//                 <FaSearch className="text-blue-500 mr-2" />
//                 Pretraži oglase
//               </label>
//               <input
//                 type="text"
//                 value={filters.search}
//                 onChange={(e) => handleFilterChange("search", e.target.value)}
//                 placeholder="Naslov, pozicija, kompanija..."
//                 className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>

//             {/* Tip zaposlenja */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
//                 <FaUserTie className="text-purple-500 mr-2" />
//                 Tip zaposlenja
//               </label>
//               <select
//                 value={filters.employmentType}
//                 onChange={(e) =>
//                   handleFilterChange("employmentType", e.target.value)
//                 }
//                 className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               >
//                 <option value="">Svi tipovi</option>
//                 {employmentTypes.map((type) => (
//                   <option key={type} value={type}>
//                     {type}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Lokacija */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
//                 <FaMapMarkerAlt className="text-red-500 mr-2" />
//                 Lokacija
//               </label>
//               <select
//                 value={filters.location}
//                 onChange={(e) => handleFilterChange("location", e.target.value)}
//                 className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               >
//                 <option value="">Sve lokacije</option>
//                 {allLocations.map((location) => (
//                   <option key={location} value={location}>
//                     {location}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Reset filtera */}
//             <div className="flex items-end">
//               <button
//                 onClick={resetFilters}
//                 className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center transition-colors w-full h-[42px] text-base"
//               >
//                 <FaSyncAlt className="mr-2" />
//                 Reset filtera
//               </button>
//             </div>
//           </div>

//           {/* Broj pronađenih oglasa */}
//           <div className="mt-4 text-sm text-gray-600">
//             Pronađeno: <strong>{filteredJobs.length}</strong> od{" "}
//             <strong>{jobs.length}</strong> oglasa
//           </div>
//         </div>

//         {/* Lista oglasa */}
//         <div className="bg-white rounded-xl shadow-md overflow-hidden">
//           {loading ? (
//             <div className="p-8 text-center">
//               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
//               <p className="text-gray-600 mt-4">Učitavanje oglasa...</p>
//             </div>
//           ) : filteredJobs.length === 0 ? (
//             <div className="p-8 text-center">
//               <FaBriefcase className="text-4xl text-gray-400 mx-auto mb-4" />
//               <p className="text-gray-600 text-lg">
//                 {filters.search || filters.employmentType || filters.location
//                   ? "Nema oglasa koji odgovaraju vašim filterima."
//                   : "Trenutno nema dostupnih oglasa za posao."}
//               </p>
//               {filters.search || filters.employmentType || filters.location ? (
//                 <button
//                   onClick={resetFilters}
//                   className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
//                 >
//                   Resetuj filtere
//                 </button>
//               ) : null}
//             </div>
//           ) : (
//             <div className="p-6 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
//               {filteredJobs.map((job, index) => (
//                 <div
//                   key={job._id}
//                   className={`relative border-l-4 ${getRandomBorderColor(
//                     index
//                   )} rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg hover:translate-y-[-2px] bg-white flex flex-col justify-between min-h-[500px]`}
//                 >
//                   {/* Gornji deo kartice - sve informacije */}
//                   <div className="flex-1 flex flex-col overflow-hidden">
//                     <div className="flex justify-between items-start mb-4">
//                       <div className="flex-1">
//                         <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
//                           {job.title}
//                         </h3>
//                         <div className="flex items-center mb-2">
//                           <FaUserTie className="text-blue-500 mr-2" />
//                           <span className="text-gray-700 font-medium">
//                             {job.position}
//                           </span>
//                         </div>
//                       </div>
//                       {job.company && (
//                         <div className="flex flex-col items-end">
//                           {job.company.logo && (
//                             <img
//                               src={job.company.logo}
//                               alt={job.company.companyName}
//                               className="h-8 w-8 object-contain rounded mb-1"
//                             />
//                           )}
//                           <div className="flex items-center text-sm text-gray-600">
//                             <FaBuilding className="mr-1" />
//                             <span className="text-xs">
//                               {job.company.companyName}
//                             </span>
//                           </div>
//                         </div>
//                       )}
//                     </div>

//                     {/* Osnovne informacije */}
//                     <div className="space-y-3 mb-4">
//                       <div className="flex items-center text-sm text-gray-600">
//                         <FaMapMarkerAlt className="text-red-500 mr-2" />
//                         <span className="font-medium">Lokacije:</span>
//                         <span className="ml-2">{job.location.join(", ")}</span>
//                       </div>

//                       {job.salary && (
//                         <div className="flex items-center text-sm text-gray-600">
//                           <FaMoneyBillWave className="text-green-500 mr-2" />
//                           <span className="font-medium">Plata:</span>
//                           <span className="ml-2">{job.salary}</span>
//                         </div>
//                       )}

//                       <div className="flex items-center text-sm text-gray-600">
//                         <FaBriefcase className="text-purple-500 mr-2" />
//                         <span className="font-medium">Tip zaposlenja:</span>
//                         <span className="ml-2">{job.employmentType}</span>
//                       </div>
//                     </div>

//                     {/* Opis posla */}
//                     <div className="border-t pt-4">
//                       <p className="text-gray-700 text-sm mb-4 line-clamp-4">
//                         {job.description}
//                       </p>

//                       {job.requirements && job.requirements.length > 0 && (
//                         <div className="mb-4">
//                           <h4 className="font-medium text-gray-800 mb-2 text-sm">
//                             Uslovi:
//                           </h4>
//                           <ul className="text-sm text-gray-600 space-y-1">
//                             {job.requirements.slice(0, 4).map((req, idx) => (
//                               <li key={idx} className="flex items-start">
//                                 <span className="text-green-500 mr-2">•</span>
//                                 <span className="line-clamp-2">{req}</span>
//                               </li>
//                             ))}
//                             {job.requirements.length > 4 && (
//                               <li className="text-blue-500 text-sm">
//                                 +{job.requirements.length - 4} još uslova
//                               </li>
//                             )}
//                           </ul>
//                         </div>
//                       )}
//                     </div>

//                     {/* Kontakt informacije */}
//                     {formatContactInfo(job.contact)}
//                   </div>

//                   {/* Dugmići - zalepljeni za dno */}
//                   <div className="mt-auto pt-4 border-t border-gray-200">
//                     <div className="flex gap-2">
//                       <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition-colors flex items-center justify-center text-sm">
//                         <FaEye className="mr-1" />
//                         Pogledaj detalje
//                       </button>
//                       {(job.contact?.email || job.contact?.phone) && (
//                         <button className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg transition-colors flex items-center justify-center text-sm">
//                           <FaEnvelope className="mr-1" />
//                           Kontakt
//                         </button>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useGlobalState } from "../helper/globalState";
import { useToast } from "../components/ToastContext";
import {
  FaBriefcase,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaUserTie,
  FaEnvelope,
  FaPhone,
  FaUser,
  FaBuilding,
  FaFilter,
  FaSearch,
  FaSyncAlt,
  FaEye,
  FaAlignLeft,
  FaPaperPlane,
} from "react-icons/fa";

export default function AllJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    employmentType: "",
    location: "",
  });
  const [token] = useGlobalState("token");
  const [user] = useGlobalState("user");
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applyForm, setApplyForm] = useState({
    message: "",
    cvUrl: "",
  });
  const [applying, setApplying] = useState(false);
  const [hasPortfolio, setHasPortfolio] = useState(false);
  const { success, error } = useToast();

  const fetchJobs = async () => {
    try {
      const res = await axios.get("/api/jobs");
      console.log("Oglasi:", res.data);
      const activeJobs = res.data.filter(
        (job) => job.isActive && job.status === "aktivan"
      );
      setJobs(activeJobs);
      setFilteredJobs(activeJobs);
    } catch (err) {
      console.error("Greška pri učitavanju oglasa:", err);
    } finally {
      setLoading(false);
    }
  };

  // Proveri da li korisnik ima portfolio
  const checkPortfolio = async () => {
    if (!token) return;

    try {
      const portfolioRes = await axios.get("/api/portfolio/my-portfolio", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHasPortfolio(
        portfolioRes.data.success && portfolioRes.data.portfolio !== null
      );
    } catch (err) {
      console.error("Greška pri proveri portfolija:", err);
      setHasPortfolio(false);
    }
  };

  useEffect(() => {
    fetchJobs();
    checkPortfolio();
  }, []);

  // Aplikuj filtere
  useEffect(() => {
    let result = jobs;

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (job) =>
          job.title.toLowerCase().includes(searchLower) ||
          job.position.toLowerCase().includes(searchLower) ||
          job.description.toLowerCase().includes(searchLower) ||
          (job.company?.companyName &&
            job.company.companyName.toLowerCase().includes(searchLower))
      );
    }

    if (filters.employmentType) {
      result = result.filter(
        (job) => job.employmentType === filters.employmentType
      );
    }

    if (filters.location) {
      result = result.filter((job) =>
        job.location.some((loc) =>
          loc.toLowerCase().includes(filters.location.toLowerCase())
        )
      );
    }

    setFilteredJobs(result);
  }, [filters, jobs]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const resetFilters = () => {
    setFilters({
      search: "",
      employmentType: "",
      location: "",
    });
  };

  // Apply funkcije
  const handleApplyClick = (job) => {
    if (!token) {
      error("Morate biti prijavljeni da biste aplicirali na posao");
      return;
    }
    setSelectedJob(job);
    setShowApplyModal(true);
  };

  const handleApplyWithPortfolio = async () => {
    if (!selectedJob) return;

    setApplying(true);
    try {
      const response = await axios.post(
        "/api/job-applications/apply-with-portfolio",
        {
          jobId: selectedJob._id,
          message: applyForm.message,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        success("Uspešno ste aplicirali na posao sa vašim portfolio podacima!");
        setShowApplyModal(false);
        setApplyForm({ message: "", cvUrl: "" });
      }
    } catch (err) {
      console.error("Greška pri apliciranju:", err);
      error(err.response?.data?.message || "Greška pri apliciranju na posao");
    } finally {
      setApplying(false);
    }
  };

  const handleApplyWithoutPortfolio = async () => {
    if (!selectedJob) return;

    setApplying(true);
    try {
      const response = await axios.post(
        "/api/job-applications",
        {
          jobId: selectedJob._id,
          message: applyForm.message,
          cvUrl: applyForm.cvUrl,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data) {
        success("Uspešno ste aplicirali na posao!");
        setShowApplyModal(false);
        setApplyForm({ message: "", cvUrl: "" });
      }
    } catch (err) {
      console.error("Greška pri apliciranju:", err);
      error(err.response?.data?.message || "Greška pri apliciranju na posao");
    } finally {
      setApplying(false);
    }
  };

  // Jedinstvene vrednosti za filtere
  const employmentTypes = [...new Set(jobs.map((job) => job.employmentType))];
  const allLocations = [...new Set(jobs.flatMap((job) => job.location))];

  // Funkcija za generisanje nasumične boje za border
  const getRandomBorderColor = (index) => {
    const colors = [
      "border-blue-500",
      "border-green-500",
      "border-purple-500",
      "border-yellow-500",
      "border-indigo-500",
      "border-pink-500",
      "border-orange-500",
    ];
    return colors[index % colors.length];
  };

  const formatContactInfo = (contact) => {
    if (!contact) return null;

    const { person, email, phone } = contact;
    if (!person && !email && !phone) return null;

    return (
      <div className="border-t pt-3 mt-3">
        <h4 className="font-medium text-gray-800 dark:text-white mb-2 text-sm">
          Kontakt informacije:
        </h4>
        <div className="space-y-1 text-sm">
          {person && (
            <div className="flex items-center text-gray-600 dark:text-white">
              <FaUser className="text-blue-500 mr-2 text-xs" />
              {person}
            </div>
          )}
          {phone && (
            <div className="flex items-center text-gray-600 dark:text-white">
              <FaPhone className="text-green-500 mr-2 text-xs" />
              {phone}
            </div>
          )}
          {email && (
            <div className="flex items-center text-gray-600 dark:text-white pb-3">
              <FaEnvelope className="text-purple-500 mr-2 text-xs" />
              {email}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-mainDarkBG py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white dark:bg-cardBGText rounded-xl shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white flex items-center">
                Svi Oglasi za Posao
                <span className="ml-3 text-lg font-medium text-blue-400 border-l-2 border-gray-300 pl-3">
                  {jobs.length} {jobs.length === 1 ? "oglas" : "oglasa"}
                </span>
              </h1>
              <p className="text-gray-600 dark:text-darkText mt-2">
                Pronađite savršen posao za vas medju našim oglasima
              </p>
            </div>
          </div>
        </div>

        {/* Filteri */}
        <div className="bg-white dark:bg-cardBGText rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
            <FaFilter className="text-blue-500 mr-2" />
            Pretraga i filteri
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Pretraga */}
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-darkText mb-2 flex items-center">
                <FaSearch className="text-blue-500 mr-2" />
                Pretraži oglase
              </label>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                placeholder="Naslov, pozicija, kompanija..."
                className="dark:bg-mainDarkBG dark:text-white w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Tip zaposlenja */}
            <div>
              <label className="dark:text-darkText text-sm font-medium text-gray-700 mb-2 flex items-center">
                <FaUserTie className="text-purple-500 mr-2" />
                Tip zaposlenja
              </label>
              <select
                value={filters.employmentType}
                onChange={(e) =>
                  handleFilterChange("employmentType", e.target.value)
                }
                className="dark:bg-mainDarkBG dark:text-white w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Svi tipovi</option>
                {employmentTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Lokacija */}
            <div>
              <label className="dark:text-darkText text-sm font-medium text-gray-700 mb-2 flex items-center">
                <FaMapMarkerAlt className="text-red-500 mr-2" />
                Lokacija
              </label>
              <select
                value={filters.location}
                onChange={(e) => handleFilterChange("location", e.target.value)}
                className="dark:bg-mainDarkBG dark:text-white w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Sve lokacije</option>
                {allLocations.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </div>

            {/* Reset filtera */}
            <div className="flex items-end">
              <button
                onClick={resetFilters}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-blueBg dark:text-white px-4 py-2 rounded-lg flex items-center transition-colors w-full h-[42px] text-base"
              >
                <FaSyncAlt className="mr-2" />
                Reset filtera
              </button>
            </div>
          </div>

          {/* Broj pronađenih oglasa */}
          <div className="mt-4 text-sm text-gray-600 dark:text-darkText">
            Pronađeno: <strong>{filteredJobs.length}</strong> od{" "}
            <strong>{jobs.length}</strong> oglasa
          </div>
        </div>

        {/* Lista oglasa */}
        <div className="bg-white dark:bg-cardBGText rounded-xl shadow-md overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className="text-gray-600 dark:text-darkText mt-4">
                Učitavanje oglasa...
              </p>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="p-8 text-center">
              <FaBriefcase className="text-4xl text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-darkText text-lg">
                {filters.search || filters.employmentType || filters.location
                  ? "Nema oglasa koji odgovaraju vašim filterima."
                  : "Trenutno nema dostupnih oglasa za posao."}
              </p>
              {filters.search || filters.employmentType || filters.location ? (
                <button
                  onClick={resetFilters}
                  className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Resetuj filtere
                </button>
              ) : null}
            </div>
          ) : (
            <div className="p-6 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredJobs.map((job, index) => (
                <div
                  key={job._id}
                  className={`relative border-l-4 ${getRandomBorderColor(
                    index
                  )} rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg hover:translate-y-[-2px] bg-white dark:bg-mainDarkBG flex flex-col justify-between min-h-[500px]`}
                >
                  {/* Gornji deo kartice - sve informacije */}
                  <div className="flex-1 flex flex-col overflow-hidden">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                          {job.title}
                        </h3>
                        <div className="flex items-center mb-2">
                          <FaUserTie className="text-blue-500 mr-2" />
                          <span className="text-gray-700 font-medium dark:text-darkText">
                            {job.position}
                          </span>
                        </div>
                      </div>
                      {job.company && (
                        <div className="flex flex-col items-end">
                          {job.company.logo && (
                            <img
                              src={job.company.logo}
                              alt={job.company.companyName}
                              className="h-8 w-8 object-contain rounded mb-1"
                            />
                          )}
                          <div className="flex items-center text-sm text-gray-600 dark:text-white">
                            <FaBuilding className="mr-1" />
                            <span className="text-xs">
                              {job.company.companyName}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Osnovne informacije */}
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center text-sm text-gray-600 dark:text-white">
                        <FaMapMarkerAlt className="text-red-500 mr-2" />
                        <span className="font-medium">Lokacije:</span>
                        <span className="ml-2">{job.location.join(", ")}</span>
                      </div>

                      {job.salary && (
                        <div className="flex items-center text-sm text-gray-600 dark:text-white">
                          <FaMoneyBillWave className="text-green-500 mr-2" />
                          <span className="font-medium">Plata:</span>
                          <span className="ml-2">{job.salary}</span>
                        </div>
                      )}

                      <div className="flex items-center text-sm text-gray-600 dark:text-white">
                        <FaBriefcase className="text-purple-500 mr-2" />
                        <span className="font-medium">Tip zaposlenja:</span>
                        <span className="ml-2">{job.employmentType}</span>
                      </div>
                    </div>

                    {/* Opis posla */}
                    <div className="border-t pt-4">
                      <p className="text-gray-700 text-sm mb-4 line-clamp-4 dark:text-darkText">
                        {job.description}
                      </p>

                      {job.requirements && job.requirements.length > 0 && (
                        <div className="mb-4">
                          <h4 className="font-medium text-gray-800 mb-2 text-sm dark:text-white">
                            Uslovi:
                          </h4>
                          <ul className="text-sm text-gray-600 space-y-1 dark:text-white">
                            {job.requirements.slice(0, 4).map((req, idx) => (
                              <li key={idx} className="flex items-start">
                                <span className="text-green-500 mr-2">•</span>
                                <span className="line-clamp-2">{req}</span>
                              </li>
                            ))}
                            {job.requirements.length > 4 && (
                              <li className="text-blue-500 text-sm">
                                +{job.requirements.length - 4} još uslova
                              </li>
                            )}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Kontakt informacije */}
                    {formatContactInfo(job.contact)}
                  </div>

                  {/* Dugmići - zalepljeni za dno */}
                  <div className="mt-auto pt-4 border-t border-gray-200">
                    <div className="flex gap-2">
                      <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition-colors flex items-center justify-center text-sm">
                        <FaEye className="mr-1" />
                        Pogledaj detalje
                      </button>
                      <button
                        onClick={() => handleApplyClick(job)}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg transition-colors flex items-center justify-center text-sm"
                      >
                        <FaPaperPlane className="mr-1" />
                        Konkuriši
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Apply Modal */}
      {showApplyModal && selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Apliciraj za posao</h2>

            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">
                {selectedJob.title}
              </h3>
              <p className="text-gray-600">{selectedJob.position}</p>
              <p className="text-sm text-gray-500">
                {selectedJob.company?.companyName}
              </p>
            </div>

            {hasPortfolio ? (
              <div className="mb-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center mb-2">
                    <FaUserTie className="text-green-500 mr-2" />
                    <span className="font-semibold text-green-800">
                      Koristiće se podaci iz vašeg portfolija
                    </span>
                  </div>
                  <p className="text-sm text-green-700">
                    Vaši podaci iz portfolija će automatski biti poslati
                    poslodavcu.
                  </p>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Poruka poslodavcu (opciono)
                  </label>
                  <textarea
                    value={applyForm.message}
                    onChange={(e) =>
                      setApplyForm({ ...applyForm, message: e.target.value })
                    }
                    rows="3"
                    placeholder="Dodatna poruka ili napomena..."
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleApplyWithPortfolio}
                    disabled={applying}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg disabled:opacity-50 flex items-center justify-center"
                  >
                    {applying ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Apliciranje...
                      </>
                    ) : (
                      <>
                        <FaPaperPlane className="mr-2" />
                        Apliciraj sa Portfolio podacima
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => setShowApplyModal(false)}
                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
                  >
                    Otkaži
                  </button>
                </div>
              </div>
            ) : (
              <div className="mb-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center mb-2">
                    <FaUserTie className="text-blue-500 mr-2" />
                    <span className="font-semibold text-blue-800">
                      Popunite prijavu ručno
                    </span>
                  </div>
                  <p className="text-sm text-blue-700">
                    Nemate portfolio. Molimo popunite sledeća polja.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Poruka poslodavcu *
                    </label>
                    <textarea
                      value={applyForm.message}
                      onChange={(e) =>
                        setApplyForm({ ...applyForm, message: e.target.value })
                      }
                      rows="3"
                      placeholder="Predstavite se i navedite zašto ste pravi kandidat..."
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Link ka CV-u (opciono)
                    </label>
                    <input
                      type="url"
                      value={applyForm.cvUrl}
                      onChange={(e) =>
                        setApplyForm({ ...applyForm, cvUrl: e.target.value })
                      }
                      placeholder="https://..."
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-4">
                  <button
                    onClick={handleApplyWithoutPortfolio}
                    disabled={applying || !applyForm.message.trim()}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg disabled:opacity-50 flex items-center justify-center"
                  >
                    {applying ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Apliciranje...
                      </>
                    ) : (
                      <>
                        <FaPaperPlane className="mr-2" />
                        Pošalji prijavu
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => setShowApplyModal(false)}
                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
                  >
                    Otkaži
                  </button>
                </div>
              </div>
            )}

            {!hasPortfolio && (
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600">
                  Želite da brže aplicirate?{" "}
                  <Link
                    to="/driver-portfolio"
                    className="text-blue-600 hover:text-blue-800 font-medium"
                    onClick={() => setShowApplyModal(false)}
                  >
                    Kreirajte portfolio
                  </Link>
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
