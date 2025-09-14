// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import axios from "axios";
// import {
//   FaPhone,
//   FaEnvelope,
//   FaGlobe,
//   FaMapMarkerAlt,
//   FaTruck,
//   FaStar,
// } from "react-icons/fa";

// const ShopPage = () => {
//   const { slug } = useParams();
//   const [shop, setShop] = useState(null);
//   const [vehicles, setVehicles] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchShop = async () => {
//       try {
//         const res = await axios.get(`/api/shop/${slug}`);
//         setShop(res.data.shop);
//         // Koristi vozila koja dolaze iz API odgovora
//         setVehicles(res.data.shop.vehicles || []);
//       } catch (err) {
//         console.error("Greška pri učitavanju shopa:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchShop();
//   }, [slug]);

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

//   // Bezbedan pristup podacima
//   const contact = shop.contact || {};
//   const services = shop.services || [];
//   const specialization = shop.specialization || "";

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <div className="bg-white shadow-sm">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center">
//               {shop.logo ? (
//                 <div className="mr-4">
//                   <img
//                     src={shop.logo}
//                     alt={shop.name}
//                     className="h-16 w-auto max-w-xs object-contain" // Povećana visina, auto širina
//                     style={{ maxHeight: "80px" }} // Dodajemo maxHeight za sigurnost
//                   />
//                 </div>
//               ) : (
//                 <div className="h-16 w-16 bg-blue-500 rounded-lg flex items-center justify-center text-white text-2xl font-bold mr-4">
//                   {shop.companyName?.charAt(0) || shop.name?.charAt(0) || "S"}
//                 </div>
//               )}
//               <div>
//                 <h1 className="text-2xl font-bold text-gray-800">
//                   {shop.companyName || shop.name}
//                 </h1>
//                 {specialization && (
//                   <p className="text-gray-600 mt-1">{specialization}</p>
//                 )}
//               </div>
//             </div>

//             <div className="flex items-center gap-4">
//               {contact.phone && (
//                 <a
//                   href={`tel:${contact.phone}`}
//                   className="flex items-center text-gray-600 hover:text-blue-500 bg-gray-100 px-3 py-2 rounded-lg transition-colors"
//                 >
//                   <FaPhone className="mr-2" />
//                   {contact.phone}
//                 </a>
//               )}
//               {contact.email && (
//                 <a
//                   href={`mailto:${contact.email}`}
//                   className="flex items-center text-gray-600 hover:text-blue-500 bg-gray-100 px-3 py-2 rounded-lg transition-colors"
//                 >
//                   <FaEnvelope className="mr-2" />
//                   {contact.email}
//                 </a>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Hero Section */}
//       <div className="bg-blue-600 text-white">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
//           <h2 className="text-3xl font-bold mb-4">
//             Dobrodošli u <span className="uppercase">{shop.name}</span>
//           </h2>
//           {shop.description && (
//             <p className="text-xl opacity-90">{shop.description}</p>
//           )}
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Specijalnost */}
//         {specialization && (
//           <div className="bg-white rounded-xl shadow-md p-6 mb-8">
//             <h3 className="text-xl font-semibold mb-4 flex items-center">
//               <FaStar className="text-yellow-500 mr-2" />
//               Naša specijalnost
//             </h3>
//             <p className="text-gray-700">{specialization}</p>
//           </div>
//         )}

//         {/* Usluge */}
//         {services.length > 0 && (
//           <div className="bg-white rounded-xl shadow-md p-6 mb-8">
//             <h3 className="text-xl font-semibold mb-4">Usluge</h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//               {services.map((service, index) => (
//                 <div key={index} className="border rounded-lg p-4">
//                   <h4 className="font-semibold mb-2">{service.name}</h4>
//                   <p className="text-gray-600 text-sm">{service.description}</p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* Vozila */}
//         {vehicles.length > 0 && (
//           <div className="bg-white rounded-xl shadow-md p-6">
//             <h3 className="text-xl font-semibold mb-4 flex items-center">
//               <FaTruck className="text-blue-500 mr-2" />
//               Naša vozila ({vehicles.length})
//             </h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {vehicles.map((vehicle) => (
//                 <div
//                   key={vehicle._id}
//                   className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow bg-white"
//                 >
//                   {/* DVE SLIKE - FIKSNA VISINA, PROPORCIONALNA ŠIRINA */}
//                   {vehicle.image1 || vehicle.image2 ? (
//                     <div className="flex h-40 p-2 gap-2 bg-gray-50">
//                       {/* Prva slika */}
//                       {vehicle.image1 && (
//                         <div className="flex-1 flex items-center justify-center bg-white rounded-lg overflow-hidden p-1">
//                           <div className="w-full h-full flex items-center justify-center">
//                             <img
//                               src={vehicle.image1}
//                               alt={vehicle.type}
//                               className="h-full w-auto max-w-full"
//                             />
//                           </div>
//                         </div>
//                       )}
//                       {/* Druga slika */}
//                       {vehicle.image2 && (
//                         <div className="flex-1 flex items-center justify-center bg-white rounded-lg overflow-hidden p-1">
//                           <div className="w-full h-full flex items-center justify-center">
//                             <img
//                               src={vehicle.image2}
//                               alt={vehicle.type}
//                               className="h-full w-auto max-w-full"
//                             />
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   ) : (
//                     <div className="w-full h-40 bg-gray-100 flex items-center justify-center">
//                       <FaTruck className="text-3xl text-gray-400" />
//                     </div>
//                   )}

//                   <div className="p-4">
//                     <h4 className="font-semibold text-lg mb-2">
//                       {vehicle.type}
//                     </h4>
//                     <div className="space-y-1">
//                       <p className="text-gray-600 text-sm">
//                         <span className="font-medium">Registracija:</span>{" "}
//                         {vehicle.licensePlate}
//                       </p>
//                       <p className="text-gray-600 text-sm">
//                         <span className="font-medium">Kapacitet:</span>{" "}
//                         {vehicle.capacity} kg
//                       </p>
//                       {vehicle.dimensions && (
//                         <p className="text-gray-600 text-sm">
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
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  FaPhone,
  FaEnvelope,
  FaGlobe,
  FaMapMarkerAlt,
  FaTruck,
  FaStar,
  FaBox,
  FaWeightHanging,
  FaRulerCombined,
  FaIdCard,
} from "react-icons/fa";

// Random boje za kartice
const borderColors = [
  "border-l-blue-500 text-blue-500",
  "border-l-green-500 text-green-500",
  "border-l-red-500 text-red-500",
  "border-l-yellow-500 text-yellow-500",
  "border-l-purple-500 text-purple-500",
  "border-l-pink-500 text-pink-500",
];

const getRandomColor = (index) => borderColors[index % borderColors.length];

const ShopPage = () => {
  const { slug } = useParams();
  const [shop, setShop] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShop = async () => {
      try {
        const res = await axios.get(`/api/shop/${slug}`);
        setShop(res.data.shop);
        setVehicles(res.data.shop.vehicles || []);
      } catch (err) {
        console.error("Greška pri učitavanju shopa:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchShop();
  }, [slug]);

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
  const services = shop.services || [];
  const specialization = shop.specialization || "";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {shop.logo ? (
                <div className="mr-4">
                  <img
                    src={shop.logo}
                    alt={shop.name}
                    className="h-16 w-auto max-w-xs object-contain"
                    style={{ maxHeight: "80px" }}
                  />
                </div>
              ) : (
                <div className="h-16 w-16 bg-blue-500 rounded-lg flex items-center justify-center text-white text-2xl font-bold mr-4">
                  {shop.companyName?.charAt(0) || shop.name?.charAt(0) || "S"}
                </div>
              )}
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  {shop.companyName || shop.name}
                </h1>
                {specialization && (
                  <p className="text-gray-600 mt-1">{specialization}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4">
              {contact.phone && (
                <a
                  href={`tel:${contact.phone}`}
                  className="flex items-center text-gray-600 hover:text-blue-500 bg-gray-100 px-3 py-2 rounded-lg transition-colors"
                >
                  <FaPhone className="mr-2" />
                  {contact.phone}
                </a>
              )}
              {contact.email && (
                <a
                  href={`mailto:${contact.email}`}
                  className="flex items-center text-gray-600 hover:text-blue-500 bg-gray-100 px-3 py-2 rounded-lg transition-colors"
                >
                  <FaEnvelope className="mr-2" />
                  {contact.email}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-blue-600 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Dobrodošli u <span className="uppercase">{shop.name}</span>
          </h2>
          {shop.description && (
            <p className="text-xl opacity-90">{shop.description}</p>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Specijalnost */}
        {specialization && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-8 border-l-4 border-yellow-500">
            <h3 className="text-xl font-semibold mb-4 flex items-center text-yellow-500">
              <FaStar className="mr-2" />
              Naša specijalnost
            </h3>
            <p className="text-gray-700">{specialization}</p>
          </div>
        )}

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
                  {/* Slike */}
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

                  {/* Info */}
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
                        <FaWeightHanging className="text-green-500" />
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
