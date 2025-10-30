// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useParams, useNavigate } from "react-router-dom";
// import {
//   FaArrowLeft,
//   FaFilter,
//   FaEnvelope,
//   FaPhone,
//   FaUser,
//   FaBriefcase,
//   FaTools,
//   FaCalendarAlt,
//   FaMapMarkerAlt,
//   FaChevronDown,
//   FaChevronUp,
//   FaExternalLinkAlt,
//   FaUserTie,
//   FaTruck,
// } from "react-icons/fa";

// export default function JobApplicationsPage() {
//   const { jobId } = useParams();
//   const navigate = useNavigate();
//   const [job, setJob] = useState(null);
//   const [applications, setApplications] = useState([]);
//   const [filter, setFilter] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [expandedCards, setExpandedCards] = useState({});

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const [jobRes, appRes] = await Promise.all([
//           axios.get(`/api/jobs/${jobId}`, {
//             headers: { Authorization: `Bearer ${token}` },
//           }),
//           axios.get(`/api/job-applications/oglas/${jobId}`, {
//             headers: { Authorization: `Bearer ${token}` },
//           }),
//         ]);
//         setJob(jobRes.data);
//         setApplications(appRes.data);
//         console.log("Applications fetched:", appRes.data);
//       } catch (err) {
//         console.error("Greška pri učitavanju:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, [jobId]);

//   const filteredApps = filter
//     ? applications.filter((a) => a.status === filter)
//     : applications;

//   const toggleExpand = (id) => {
//     setExpandedCards((prev) => ({
//       ...prev,
//       [id]: !prev[id],
//     }));
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="bg-white rounded-xl shadow-md p-6 mb-6">
//           <button
//             onClick={() => navigate(-1)}
//             className="text-gray-600 hover:text-gray-800 flex items-center text-sm font-medium mb-4"
//           >
//             <FaArrowLeft className="mr-2" /> Nazad
//           </button>

//           {loading ? (
//             <div className="text-center py-10">
//               <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto mb-4"></div>
//               <p className="text-gray-600">Učitavanje kandidata...</p>
//             </div>
//           ) : (
//             <>
//               <div className="mb-6">
//                 <h1 className="text-2xl font-bold text-gray-800 mb-1">
//                   {job?.title}
//                 </h1>
//                 <p className="text-sm text-gray-500 mb-2">
//                   Objavljeno:{" "}
//                   {new Date(job?.createdAt).toLocaleDateString("sr-RS")}{" "}
//                   {new Date(job?.createdAt).toLocaleTimeString("sr-RS")}
//                 </p>
//                 <span className="px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 font-medium border border-blue-200">
//                   {job?.status}
//                 </span>
//               </div>

//               {/* Filter po statusu */}
//               <div className="bg-gray-50 border rounded-xl p-4 mb-6">
//                 <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
//                   <FaFilter className="text-blue-500 mr-2" /> Filter po statusu
//                 </h2>
//                 <div className="flex flex-wrap gap-2">
//                   {["na čekanju", "u užem izboru", "prihvaćen", "odbijen"].map(
//                     (s) => (
//                       <button
//                         key={s}
//                         onClick={() => setFilter(s)}
//                         className={`px-3 py-1 rounded-full text-sm border transition-colors ${
//                           filter === s
//                             ? "bg-blue-100 text-blue-700 border-blue-300"
//                             : "hover:bg-gray-100 border-gray-300 text-gray-600"
//                         }`}
//                       >
//                         {s}
//                       </button>
//                     )
//                   )}
//                   <button
//                     onClick={() => setFilter("")}
//                     className="px-3 py-1 rounded-full text-sm border border-gray-300 text-gray-600 hover:bg-gray-100"
//                   >
//                     Sve
//                   </button>
//                 </div>
//               </div>

//               {/* Lista kandidata */}
//               {filteredApps.length === 0 ? (
//                 <div className="text-center py-10 text-gray-500">
//                   <FaUserTie className="text-4xl mx-auto mb-3 opacity-50" />
//                   <p>Nema kandidata za ovaj filter.</p>
//                 </div>
//               ) : (
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   {filteredApps.map((app) => {
//                     const hasPortfolio = app.applicantData?.portfolioData;
//                     const expanded = expandedCards[app._id];

//                     return (
//                       <div
//                         key={app._id}
//                         className="border-l-4 border-blue-500 bg-white rounded-xl shadow-md p-5 transition-all hover:shadow-lg hover:translate-y-[-2px]"
//                       >
//                         {/* Osnovni deo */}
//                         <div className="flex justify-between items-start">
//                           <div>
//                             <h3 className="font-semibold text-gray-900 text-lg mb-1">
//                               {app.applicantData?.name ||
//                                 app.applicantId?.name ||
//                                 "Nepoznato ime"}
//                             </h3>
//                             {/* <p className="text-sm text-gray-600 mb-2">
//                               Status:{" "}
//                               <span className="font-medium">
//                                 {app.status || "—"}
//                               </span>
//                             </p> */}
//                             <div className="mt-2">
//                               <label className="text-sm text-gray-600 mr-2">
//                                 Status:
//                               </label>
//                               <select
//                                 value={app.status}
//                                 onChange={async (e) => {
//                                   const newStatus = e.target.value;
//                                   try {
//                                     const token = localStorage.getItem("token");
//                                     await axios.patch(
//                                       `/api/job-applications/${app._id}/status`,
//                                       { status: newStatus },
//                                       {
//                                         headers: {
//                                           Authorization: `Bearer ${token}`,
//                                         },
//                                       }
//                                     );
//                                     setApplications((prev) =>
//                                       prev.map((a) =>
//                                         a._id === app._id
//                                           ? { ...a, status: newStatus }
//                                           : a
//                                       )
//                                     );
//                                   } catch (err) {
//                                     console.error(
//                                       "Greška pri promeni statusa:",
//                                       err
//                                     );
//                                   }
//                                 }}
//                                 className="border rounded-lg px-2 py-1 text-sm text-gray-700"
//                               >
//                                 {[
//                                   "na čekanju",
//                                   "u užem izboru",
//                                   "prihvaćen",
//                                   "odbijen",
//                                 ].map((opt) => (
//                                   <option key={opt} value={opt}>
//                                     {opt}
//                                   </option>
//                                 ))}
//                               </select>
//                             </div>

//                             <p className="text-gray-700 text-sm italic line-clamp-3">
//                               {app.message || "Nema poruke."}
//                             </p>
//                           </div>

//                           <button
//                             onClick={() => toggleExpand(app._id)}
//                             className="text-gray-500 hover:text-gray-700 transition-colors"
//                           >
//                             {expanded ? <FaChevronUp /> : <FaChevronDown />}
//                           </button>
//                         </div>

//                         {/* Prošireni deo */}
//                         {expanded && (
//                           <div className="mt-4 border-t pt-4 text-sm text-gray-700 animate-fadeIn">
//                             {hasPortfolio ? (
//                               <>
//                                 <div className="mb-3">
//                                   <div className="flex items-center text-gray-700 mb-1">
//                                     <FaBriefcase className="text-blue-500 mr-2" />
//                                     <span className="font-medium">
//                                       Iskustvo:
//                                     </span>
//                                     <span className="ml-2">
//                                       {app.applicantData.yearsOfExperience || 0}{" "}
//                                       god.
//                                     </span>
//                                   </div>

//                                   {app.applicantData.previousExperience
//                                     ?.length > 0 && (
//                                     <ul className="ml-6 list-disc text-gray-600 mb-2">
//                                       {app.applicantData.previousExperience.map(
//                                         (exp, i) => (
//                                           <li key={i}>
//                                             {exp.companyName} – {exp.position} (
//                                             {exp.duration})
//                                           </li>
//                                         )
//                                       )}
//                                     </ul>
//                                   )}
//                                 </div>

//                                 {app.applicantData.skills?.length > 0 && (
//                                   <div className="mb-3">
//                                     <h4 className="font-medium text-gray-800 mb-1 flex items-center">
//                                       <FaTools className="text-green-500 mr-2" />{" "}
//                                       Veštine:
//                                     </h4>
//                                     <div className="flex flex-wrap gap-2">
//                                       {app.applicantData.skills.map(
//                                         (skill, idx) => (
//                                           <span
//                                             key={idx}
//                                             className="px-2 py-1 bg-gray-100 border border-gray-200 rounded-full text-xs text-gray-700"
//                                           >
//                                             {skill}
//                                           </span>
//                                         )
//                                       )}
//                                     </div>
//                                   </div>
//                                 )}
//                                 {app.applicantData.availability && (
//                                   <div className="mt-4 border-t pt-3">
//                                     <h4 className="font-medium text-gray-800 mb-1">
//                                       Dostupnost:
//                                     </h4>
//                                     <p className="text-sm text-gray-700 capitalize">
//                                       {app.applicantData.availability}
//                                     </p>
//                                   </div>
//                                 )}

//                                 {app.applicantData.expectedSalary && (
//                                   <div className="mt-3">
//                                     <h4 className="font-medium text-gray-800 mb-1">
//                                       Očekivana plata:
//                                     </h4>
//                                     <p className="text-sm text-gray-700">
//                                       {app.applicantData.expectedSalary}
//                                     </p>
//                                   </div>
//                                 )}

//                                 {app.applicantData.driverLicenses?.length >
//                                   0 && (
//                                   <div className="mt-3">
//                                     <h4 className="font-medium text-gray-800 mb-1">
//                                       Kategorije vozačke dozvole:
//                                     </h4>
//                                     <div className="flex flex-wrap gap-2">
//                                       {app.applicantData.driverLicenses.map(
//                                         (lic, idx) => (
//                                           <span
//                                             key={idx}
//                                             className="px-2 py-1 bg-blue-50 border border-blue-200 rounded-full text-xs text-blue-700 font-medium"
//                                           >
//                                             {lic}
//                                           </span>
//                                         )
//                                       )}
//                                     </div>
//                                   </div>
//                                 )}

//                                 {app.applicantData.vehicles?.length > 0 && (
//                                   <div className="mt-4 border-t pt-3">
//                                     <h4 className="font-medium text-gray-800 mb-2 flex items-center">
//                                       <FaTruck className="text-orange-500 mr-2" />{" "}
//                                       Vozila:
//                                     </h4>
//                                     {app.applicantData.vehicles.map(
//                                       (v, idx) => (
//                                         <div
//                                           key={idx}
//                                           className="mb-3 bg-gray-50 rounded-lg p-3 shadow-inner"
//                                         >
//                                           <p className="text-sm font-medium text-gray-700">
//                                             {v.type}
//                                           </p>
//                                           <p className="text-xs text-gray-600">
//                                             Nosivost: {v.capacity}kg | Godište:{" "}
//                                             {v.year} | Reg. oznaka:{" "}
//                                             {v.licensePlate}
//                                           </p>
//                                           {v.image1 && (
//                                             <img
//                                               src={v.image1}
//                                               alt="vozilo"
//                                               className="mt-2 w-full h-40 object-cover rounded-lg border"
//                                             />
//                                           )}
//                                         </div>
//                                       )
//                                     )}
//                                   </div>
//                                 )}

//                                 <div className="mt-4 border-t pt-3">
//                                   <h4 className="font-medium mb-1 flex items-center">
//                                     <FaEnvelope className="text-purple-500 mr-2" />{" "}
//                                     Kontakt:
//                                   </h4>
//                                   <p>Email: {app.applicantData.email}</p>
//                                   {app.applicantData.phone && (
//                                     <p>Telefon: {app.applicantData.phone}</p>
//                                   )}
//                                 </div>

//                                 <div className="mt-3">
//                                   <button
//                                     onClick={async () => {
//                                       try {
//                                         const res = await axios.get(
//                                           `/api/portfolio/by-user/${app.applicantId._id}`
//                                         );
//                                         if (res.data.success && res.data.slug) {
//                                           window.open(
//                                             `/#/driver/${res.data.slug}`,
//                                             "_blank"
//                                           );
//                                         } else {
//                                           alert(
//                                             "Portfolio nije pronađen za ovog kandidata."
//                                           );
//                                         }
//                                       } catch (err) {
//                                         console.error(
//                                           "Greška pri otvaranju portfolija:",
//                                           err
//                                         );
//                                       }
//                                     }}
//                                     className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
//                                   >
//                                     <FaExternalLinkAlt className="mr-1" />
//                                     Otvori portfolio
//                                   </button>
//                                 </div>
//                               </>
//                             ) : (
//                               <div>
//                                 <p className="italic text-gray-600">
//                                   Kandidat nije dodao portfolio.
//                                 </p>
//                                 {app.applicantId?.email && (
//                                   <p className="mt-2 flex items-center text-sm">
//                                     <FaEnvelope className="mr-2 text-purple-500" />{" "}
//                                     {app.applicantId.email}
//                                   </p>
//                                 )}
//                               </div>
//                             )}
//                           </div>
//                         )}
//                       </div>
//                     );
//                   })}
//                 </div>
//               )}
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaFilter,
  FaEnvelope,
  FaPhone,
  FaUser,
  FaBriefcase,
  FaTools,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaChevronDown,
  FaChevronUp,
  FaExternalLinkAlt,
  FaUserTie,
  FaTruck,
  FaStar,
  FaCertificate,
  FaCar,
  FaIdCard,
  FaEuroSign,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaEye,
  FaListAlt,
} from "react-icons/fa";

export default function JobApplicationsPage() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [expandedCards, setExpandedCards] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const [jobRes, appRes] = await Promise.all([
          axios.get(`/api/jobs/${jobId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`/api/job-applications/oglas/${jobId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setJob(jobRes.data);
        setApplications(appRes.data);
        console.log("Applications fetched:", appRes.data);
      } catch (err) {
        console.error("Greška pri učitavanju:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [jobId]);

  const filteredApps = filter
    ? applications.filter((a) => a.status === filter)
    : applications;

  const toggleExpand = (id) => {
    setExpandedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Funkcija za boje statusa
  const getStatusColor = (status) => {
    switch (status) {
      case "prihvaćen":
        return "bg-green-100 text-green-800 border-green-200";
      case "u užem izboru":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "odbijen":
        return "bg-red-100 text-red-800 border-red-200";
      case "aktivan":
        return "bg-green-100 text-green-800 border-green-200";
      case "pauziran":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "arhiviran":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
    }
  };

  // Funkcija za ikonice statusa
  const getStatusIcon = (status) => {
    switch (status) {
      case "prihvaćen":
        return <FaCheckCircle className="text-green-500 mr-1" />;
      case "u užem izboru":
        return <FaStar className="text-blue-500 mr-1" />;
      case "odbijen":
        return <FaTimesCircle className="text-red-500 mr-1" />;
      case "aktivan":
        return <FaCheckCircle className="text-green-500" />;
      case "pauziran":
        return <FaPauseCircle className="text-yellow-500" />;
      case "arhiviran":
        return <FaArchive className="text-gray-500" />;
      default:
        return <FaClock className="text-yellow-500 mr-1" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-600 hover:text-gray-800 flex items-center text-sm font-medium mb-4 transition-colors duration-200"
          >
            <FaArrowLeft className="mr-2" /> Nazad na poslove
          </button>

          {loading ? (
            <div className="text-center py-10">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Učitavanje kandidata...</p>
            </div>
          ) : (
            <>
              {/* Header oglasa */}
              <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h1 className="text-2xl font-bold text-gray-800 mb-1 flex items-center">
                      <FaBriefcase className="text-blue-600 mr-3" />
                      {job?.title}
                    </h1>
                    <p className="text-sm text-gray-600 mb-2 flex items-center">
                      <FaCalendarAlt className="text-purple-500 mr-2" />
                      Objavljeno:{" "}
                      {new Date(job?.createdAt).toLocaleDateString(
                        "sr-RS"
                      )} •{" "}
                      {new Date(job?.createdAt).toLocaleTimeString("sr-RS", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    {job?.location && (
                      <p className="text-sm text-gray-600 flex items-center">
                        <FaMapMarkerAlt className="text-red-500 mr-2" />
                        Lokacija: {job.location.join(", ")}
                      </p>
                    )}
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium border flex items-center ${getStatusColor(
                      job?.status
                    )}`}
                  >
                    {getStatusIcon(job?.status)}
                    {job?.status}
                  </span>
                </div>
              </div>

              {/* Filter po statusu */}
              <div className="bg-gray-50 border rounded-xl p-4 mb-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                  <FaFilter className="text-blue-500 mr-2" /> Filter kandidata
                </h2>
                <div className="flex flex-wrap gap-2">
                  {[
                    { value: "na čekanju", icon: FaClock, color: "yellow" },
                    { value: "u užem izboru", icon: FaStar, color: "blue" },
                    { value: "prihvaćen", icon: FaCheckCircle, color: "green" },
                    { value: "odbijen", icon: FaTimesCircle, color: "red" },
                  ].map(({ value, icon: Icon, color }) => (
                    <button
                      key={value}
                      onClick={() => setFilter(value)}
                      className={`px-4 py-2 rounded-lg text-sm border transition-all duration-200 flex items-center ${
                        filter === value
                          ? `bg-${color}-100 text-${color}-700 border-${color}-300 shadow-sm`
                          : "hover:bg-gray-100 border-gray-300 text-gray-600 hover:shadow-sm"
                      }`}
                    >
                      <Icon className={`mr-2 text-${color}-500`} />
                      {value}
                    </button>
                  ))}
                  <button
                    onClick={() => setFilter("")}
                    className="px-4 py-2 rounded-lg text-sm border border-gray-300 text-gray-600 hover:bg-gray-100 hover:shadow-sm transition-all duration-200 flex items-center"
                  >
                    <FaListAlt className="mr-2 text-gray-500" />
                    Svi kandidati ({applications.length})
                  </button>
                </div>
              </div>

              {/* Lista kandidata */}
              {filteredApps.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                  <FaUserTie className="text-4xl mx-auto mb-3 opacity-50" />
                  <p className="text-lg">Nema kandidata za ovaj filter.</p>
                  <p className="text-sm mt-1">Pokušajte sa drugim filterom.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredApps.map((app) => {
                    const hasPortfolio = app.applicantData?.portfolioData;
                    const expanded = expandedCards[app._id];

                    return (
                      <div
                        key={app._id}
                        className="border-l-4 border-blue-500 bg-white rounded-xl shadow-md p-5 transition-all duration-300 hover:shadow-lg hover:translate-y-[-2px]"
                      >
                        {/* Osnovni deo */}
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="font-semibold text-gray-900 text-lg flex items-center">
                                <FaUser className="text-blue-500 mr-2" />
                                {app.applicantData?.name ||
                                  app.applicantId?.name ||
                                  "Nepoznato ime"}
                                {hasPortfolio && (
                                  <FaCertificate
                                    className="text-green-500 ml-2"
                                    title="Ima portfolio"
                                  />
                                )}
                              </h3>
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium border flex items-center ${getStatusColor(
                                  app.status
                                )}`}
                              >
                                {getStatusIcon(app.status)}
                                {app.status}
                              </span>
                            </div>

                            {/* Poruka kandidata */}
                            {app.message && (
                              <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 mb-3">
                                <p className="text-gray-700 text-sm italic line-clamp-3">
                                  "{app.message}"
                                </p>
                              </div>
                            )}

                            {/* Kontakt informacije */}
                            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                              {app.applicantData?.email && (
                                <span className="flex items-center">
                                  <FaEnvelope className="text-purple-500 mr-1" />
                                  {app.applicantData.email}
                                </span>
                              )}
                              {app.applicantData?.phone && (
                                <span className="flex items-center">
                                  <FaPhone className="text-green-500 mr-1" />
                                  {app.applicantData.phone}
                                </span>
                              )}
                            </div>
                          </div>

                          <button
                            onClick={() => toggleExpand(app._id)}
                            className="ml-3 text-gray-500 hover:text-blue-500 transition-colors duration-200 p-1 rounded-full hover:bg-blue-50"
                            title={
                              expanded ? "Sakrij detalje" : "Prikaži detalje"
                            }
                          >
                            {expanded ? <FaChevronUp /> : <FaChevronDown />}
                          </button>
                        </div>

                        {/* Status selector */}
                        <div className="mb-3">
                          <label className="text-sm text-gray-600 font-medium flex items-center mb-1">
                            <FaClock className="text-yellow-500 mr-2" />
                            Promeni status:
                          </label>
                          <select
                            value={app.status}
                            onChange={async (e) => {
                              const newStatus = e.target.value;
                              try {
                                const token = localStorage.getItem("token");
                                await axios.patch(
                                  `/api/job-applications/${app._id}/status`,
                                  { status: newStatus },
                                  {
                                    headers: {
                                      Authorization: `Bearer ${token}`,
                                    },
                                  }
                                );
                                setApplications((prev) =>
                                  prev.map((a) =>
                                    a._id === app._id
                                      ? { ...a, status: newStatus }
                                      : a
                                  )
                                );
                              } catch (err) {
                                console.error(
                                  "Greška pri promeni statusa:",
                                  err
                                );
                              }
                            }}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            {[
                              "na čekanju",
                              "u užem izboru",
                              "prihvaćen",
                              "odbijen",
                            ].map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Prošireni deo */}
                        {expanded && (
                          <div className="mt-4 border-t pt-4 text-sm text-gray-700 animate-fadeIn space-y-4">
                            {hasPortfolio ? (
                              <>
                                {/* Iskustvo */}
                                <div className="bg-gray-50 rounded-lg p-3">
                                  <h4 className="font-medium text-gray-800 mb-2 flex items-center">
                                    <FaBriefcase className="text-blue-600 mr-2" />
                                    Profesionalno iskustvo
                                  </h4>
                                  <div className="flex items-center text-gray-700 mb-2">
                                    <span className="font-medium">Staž:</span>
                                    <span className="ml-2 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                                      {app.applicantData.yearsOfExperience || 0}{" "}
                                      godina
                                    </span>
                                  </div>

                                  {app.applicantData.previousExperience
                                    ?.length > 0 && (
                                    <div>
                                      <h5 className="font-medium text-gray-700 mb-1">
                                        Prethodni poslovi:
                                      </h5>
                                      <ul className="space-y-2">
                                        {app.applicantData.previousExperience.map(
                                          (exp, i) => (
                                            <li
                                              key={i}
                                              className="border-l-2 border-green-500 pl-3 py-1"
                                            >
                                              <div className="font-medium">
                                                {exp.position}
                                              </div>
                                              <div className="text-gray-600 text-xs">
                                                {exp.companyName} •{" "}
                                                {exp.duration}
                                              </div>
                                            </li>
                                          )
                                        )}
                                      </ul>
                                    </div>
                                  )}
                                </div>

                                {/* Veštine */}
                                {app.applicantData.skills?.length > 0 && (
                                  <div className="bg-gray-50 rounded-lg p-3">
                                    <h4 className="font-medium text-gray-800 mb-2 flex items-center">
                                      <FaTools className="text-green-600 mr-2" />
                                      Veštine i kompetencije
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                      {app.applicantData.skills.map(
                                        (skill, idx) => (
                                          <span
                                            key={idx}
                                            className="px-3 py-1 bg-white border border-green-200 rounded-full text-xs text-green-700 font-medium shadow-sm"
                                          >
                                            {skill}
                                          </span>
                                        )
                                      )}
                                    </div>
                                  </div>
                                )}

                                {/* Vozačke dozvole */}
                                {app.applicantData.driverLicenses?.length >
                                  0 && (
                                  <div className="bg-gray-50 rounded-lg p-3">
                                    <h4 className="font-medium text-gray-800 mb-2 flex items-center">
                                      <FaIdCard className="text-orange-600 mr-2" />
                                      Kategorije vozačke dozvole
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                      {app.applicantData.driverLicenses.map(
                                        (lic, idx) => (
                                          <span
                                            key={idx}
                                            className="px-3 py-1 bg-orange-100 border border-orange-200 rounded-full text-xs text-orange-700 font-medium"
                                          >
                                            {lic}
                                          </span>
                                        )
                                      )}
                                    </div>
                                  </div>
                                )}

                                {/* Vozila */}
                                {app.applicantData.vehicles?.length > 0 && (
                                  <div className="bg-gray-50 rounded-lg p-3">
                                    <h4 className="font-medium text-gray-800 mb-3 flex items-center">
                                      <FaTruck className="text-purple-600 mr-2" />
                                      Vozila u posedu
                                    </h4>
                                    <div className="space-y-3">
                                      {app.applicantData.vehicles.map(
                                        (v, idx) => (
                                          <div
                                            key={idx}
                                            className="bg-white rounded-lg p-3 border border-gray-200"
                                          >
                                            <div className="flex items-start gap-3">
                                              {v.image1 && (
                                                <div className="flex-shrink-0">
                                                  <img
                                                    src={v.image1}
                                                    alt={v.type}
                                                    className="w-20 h-20 object-cover rounded-lg border shadow-sm"
                                                  />
                                                </div>
                                              )}
                                              <div className="flex-1">
                                                <p className="font-medium text-gray-800">
                                                  {v.type}
                                                </p>
                                                <div className="text-xs text-gray-600 space-y-1 mt-1">
                                                  <div className="flex items-center">
                                                    <FaCar className="text-gray-400 mr-1" />
                                                    Registracija:{" "}
                                                    {v.licensePlate}
                                                  </div>
                                                  <div className="flex items-center">
                                                    <FaBriefcase className="text-gray-400 mr-1" />
                                                    Nosivost: {v.capacity} kg
                                                  </div>
                                                  {v.year && (
                                                    <div className="flex items-center">
                                                      <FaCalendarAlt className="text-gray-400 mr-1" />
                                                      Godina: {v.year}
                                                    </div>
                                                  )}
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        )
                                      )}
                                    </div>
                                  </div>
                                )}

                                {/* Dodatne informacije */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  {app.applicantData.availability && (
                                    <div className="bg-white border border-blue-100 rounded-lg p-3">
                                      <h4 className="font-medium text-gray-800 mb-1 flex items-center text-sm">
                                        <FaClock className="text-blue-500 mr-2" />
                                        Dostupnost
                                      </h4>
                                      <p className="text-sm text-gray-700 capitalize">
                                        {app.applicantData.availability}
                                      </p>
                                    </div>
                                  )}

                                  {app.applicantData.expectedSalary && (
                                    <div className="bg-white border border-green-100 rounded-lg p-3">
                                      <h4 className="font-medium text-gray-800 mb-1 flex items-center text-sm">
                                        <FaEuroSign className="text-green-500 mr-2" />
                                        Očekivana plata
                                      </h4>
                                      <p className="text-sm text-gray-700">
                                        {app.applicantData.expectedSalary}
                                      </p>
                                    </div>
                                  )}
                                </div>

                                {/* Portfolio link */}
                                <div className="flex justify-center pt-2">
                                  <button
                                    onClick={async () => {
                                      try {
                                        const res = await axios.get(
                                          `/api/portfolio/by-user/${app.applicantId._id}`
                                        );
                                        if (res.data.success && res.data.slug) {
                                          window.open(
                                            `/#/driver/${res.data.slug}`,
                                            "_blank"
                                          );
                                        } else {
                                          alert(
                                            "Portfolio nije pronađen za ovog kandidata."
                                          );
                                        }
                                      } catch (err) {
                                        console.error(
                                          "Greška pri otvaranju portfolija:",
                                          err
                                        );
                                      }
                                    }}
                                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg transition-all duration-200 flex items-center shadow-sm hover:shadow-md"
                                  >
                                    <FaExternalLinkAlt className="mr-2" />
                                    Pogledaj kompletan portfolio
                                  </button>
                                </div>
                              </>
                            ) : (
                              <div className="text-center py-4 bg-yellow-50 rounded-lg border border-yellow-200">
                                <FaUserTie className="text-3xl text-yellow-500 mx-auto mb-2" />
                                <p className="text-gray-700 font-medium">
                                  Kandidat nije kreirao portfolio
                                </p>
                                <p className="text-sm text-gray-600 mt-1">
                                  Kontaktirajte kandidata putem emaila ili
                                  telefona
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
