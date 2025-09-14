// import React, { useState } from "react";
// import axios from "axios";
// import { useGlobalState } from "../helper/globalState";
// import { useNavigate } from "react-router-dom";

// export default function AddVehicle() {
//   const navigate = useNavigate();
//   const [token] = useGlobalState("token");
//   const [formData, setFormData] = useState({
//     type: "",
//     capacity: "",
//     licensePlate: "",
//     year: "",
//     description: "",
//     pallets: "",
//     dimensions: { length: "", width: "", height: "" },
//   });

//   // const handleChange = (e) => {
//   //   setFormData({ ...formData, [e.target.name]: e.target.value });
//   // };
//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     // 👇 specijalan case za dimensions
//     if (["length", "width", "height"].includes(name)) {
//       setFormData({
//         ...formData,
//         dimensions: { ...formData.dimensions, [name]: value },
//       });
//     } else {
//       setFormData({ ...formData, [name]: value });
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await axios.post("/api/vehicles", formData, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       console.log("Dodato vozilo iz baze:", res.data);
//       alert("Vozilo dodato");
//       setTimeout(() => {
//         navigate("/my-vehicles");
//       }, 1000);
//     } catch (err) {
//       console.error(err);
//       alert("Greška pri dodavanju vozila");
//     }
//   };

//   return (
//     <div className="p-4 max-w-lg mx-auto">
//       <h1 className="text-xl font-bold mb-4">Dodaj vozilo</h1>
//       <form onSubmit={handleSubmit} className="space-y-3">
//         <select
//           name="type"
//           value={formData.type}
//           onChange={handleChange}
//           required
//           className="border p-2 w-full"
//         >
//           <option value="">Odaberi vrstu vozila</option>
//           <option value="Kamion">Kamion</option>
//           <option value="Kombi">Kombi</option>
//           <option value="Šleper">Šleper</option>
//         </select>
//         <input
//           name="capacity"
//           type="number"
//           placeholder="Nosivost (kg)"
//           value={formData.capacity}
//           onChange={handleChange}
//           required
//           className="border p-2 w-full"
//         />
//         <input
//           name="licensePlate"
//           placeholder="Registracija"
//           value={formData.licensePlate}
//           onChange={handleChange}
//           required
//           className="border p-2 w-full"
//         />
//         <input
//           name="year"
//           type="number"
//           placeholder="Godina proizvodnje"
//           value={formData.year}
//           onChange={handleChange}
//           className="border p-2 w-full"
//         />
//         <textarea
//           name="description"
//           placeholder="Opis"
//           value={formData.description}
//           onChange={handleChange}
//           className="border p-2 w-full"
//         />
//         <input
//           name="pallets"
//           type="number"
//           placeholder="Broj paletnih mesta"
//           value={formData.pallets}
//           onChange={handleChange}
//           className="border p-2 w-full"
//         />

//         {/* 👇 dodat unos za dimenzije */}
//         <div className="grid grid-cols-3 gap-2">
//           <input
//             name="length"
//             type="number"
//             placeholder="Dužina (cm)"
//             value={formData.dimensions.length}
//             onChange={handleChange}
//             className="border p-2 w-full"
//           />
//           <input
//             name="width"
//             type="number"
//             placeholder="Širina (cm)"
//             value={formData.dimensions.width}
//             onChange={handleChange}
//             className="border p-2 w-full"
//           />
//           <input
//             name="height"
//             type="number"
//             placeholder="Visina (cm)"
//             value={formData.dimensions.height}
//             onChange={handleChange}
//             className="border p-2 w-full"
//           />
//         </div>
//         <button className="bg-blue-500 text-white p-2 w-full">Dodaj</button>
//       </form>
//     </div>
//   );
// }

import React, { useState } from "react";
import axios from "axios";
import { useGlobalState } from "../helper/globalState";
import { useNavigate } from "react-router-dom";

import {
  FaCar,
  FaHashtag,
  FaWeight,
  FaCalendar,
  FaPallet,
  FaRuler,
  FaImage,
  FaTimes,
  FaPlus,
  FaInfo,
} from "react-icons/fa";

export default function AddVehicle() {
  const navigate = useNavigate();
  const [token] = useGlobalState("token");
  const [formData, setFormData] = useState({
    type: "",
    capacity: "",
    licensePlate: "",
    year: "",
    description: "",
    pallets: "",
    dimensions: { length: "", width: "", height: "" },
    image1: null,
    image2: null,
  });
  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (["length", "width", "height"].includes(name)) {
      setFormData({
        ...formData,
        dimensions: { ...formData.dimensions, [name]: value },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleImageChange = (e, imageField) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({
        ...formData,
        [imageField]: e.target.files[0],
      });
    }
  };

  const removeImage = (imageField) => {
    setFormData({
      ...formData,
      [imageField]: null,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      const data = new FormData();

      // Dodaj sve podatke u formData
      Object.keys(formData).forEach((key) => {
        if (key === "dimensions") {
          data.append("dimensions", JSON.stringify(formData.dimensions));
        } else if (key !== "image1" && key !== "image2") {
          data.append(key, formData[key]);
        }
      });

      // Dodaj slike ako postoje
      if (formData.image1) data.append("image1", formData.image1);
      if (formData.image2) data.append("image2", formData.image2);

      const res = await axios.post("/api/vehicles", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Dodato vozilo:", res.data);
      alert("Vozilo uspešno dodato!");
      navigate("/my-vehicles");
    } catch (err) {
      console.error(err);
      alert("Greška pri dodavanju vozila");
    } finally {
      setUploading(false);
    }
  };

  // return (
  //   <div className="min-h-screen bg-gray-50 py-8">
  //     <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
  //       <div className="bg-white rounded-xl shadow-md p-6">
  //         <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
  //           Dodaj novo vozilo
  //         </h1>

  //         <form onSubmit={handleSubmit} className="space-y-4">
  //           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  //             <div>
  //               <label className="block text-sm font-medium text-gray-700 mb-1">
  //                 Tip vozila *
  //               </label>
  //               <select
  //                 name="type"
  //                 value={formData.type}
  //                 onChange={handleChange}
  //                 required
  //                 className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
  //               >
  //                 <option value="">Odaberi vrstu vozila</option>
  //                 <option value="Kamion">Kamion</option>
  //                 <option value="Kombi">Kombi</option>
  //                 <option value="Šleper">Šleper</option>
  //                 <option value="Dostavno vozilo">Dostavno vozilo</option>
  //                 <option value="Hladnjača">Hladnjača</option>
  //               </select>
  //             </div>

  //             <div>
  //               <label className="block text-sm font-medium text-gray-700 mb-1">
  //                 Registarska oznaka *
  //               </label>
  //               <input
  //                 name="licensePlate"
  //                 placeholder="npr. BG123AB"
  //                 value={formData.licensePlate}
  //                 onChange={handleChange}
  //                 required
  //                 className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
  //               />
  //             </div>

  //             <div>
  //               <label className="block text-sm font-medium text-gray-700 mb-1">
  //                 Nosivost (kg) *
  //               </label>
  //               <input
  //                 name="capacity"
  //                 type="number"
  //                 placeholder="npr. 3500"
  //                 value={formData.capacity}
  //                 onChange={handleChange}
  //                 required
  //                 className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
  //               />
  //             </div>

  //             <div>
  //               <label className="block text-sm font-medium text-gray-700 mb-1">
  //                 Godina proizvodnje
  //               </label>
  //               <input
  //                 name="year"
  //                 type="number"
  //                 placeholder="npr. 2020"
  //                 value={formData.year}
  //                 onChange={handleChange}
  //                 className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
  //               />
  //             </div>

  //             <div>
  //               <label className="block text-sm font-medium text-gray-700 mb-1">
  //                 Broj paletnih mesta
  //               </label>
  //               <input
  //                 name="pallets"
  //                 type="number"
  //                 placeholder="npr. 10"
  //                 value={formData.pallets}
  //                 onChange={handleChange}
  //                 className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
  //               />
  //             </div>

  //             <div className="space-y-2">
  //               <label className="block text-sm font-medium text-gray-700 mb-1">
  //                 Dimenzije (cm)
  //               </label>
  //               <div className="grid grid-cols-3 gap-2">
  //                 <input
  //                   name="length"
  //                   type="number"
  //                   placeholder="Dužina"
  //                   value={formData.dimensions.length}
  //                   onChange={handleChange}
  //                   className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
  //                 />
  //                 <input
  //                   name="width"
  //                   type="number"
  //                   placeholder="Širina"
  //                   value={formData.dimensions.width}
  //                   onChange={handleChange}
  //                   className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
  //                 />
  //                 <input
  //                   name="height"
  //                   type="number"
  //                   placeholder="Visina"
  //                   value={formData.dimensions.height}
  //                   onChange={handleChange}
  //                   className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
  //                 />
  //               </div>
  //             </div>

  //             {/* Upload slika */}
  //             <div>
  //               <label className="block text-sm font-medium text-gray-700 mb-1">
  //                 Slika 1
  //               </label>
  //               {formData.image1 ? (
  //                 <div className="relative">
  //                   <img
  //                     src={URL.createObjectURL(formData.image1)}
  //                     alt="Preview"
  //                     className="h-32 w-full object-cover rounded-lg"
  //                   />
  //                   <button
  //                     type="button"
  //                     onClick={() => removeImage("image1")}
  //                     className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
  //                   >
  //                     <FaTimes size={12} />
  //                   </button>
  //                 </div>
  //               ) : (
  //                 <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 h-32">
  //                   <label className="cursor-pointer text-center">
  //                     <FaImage className="mx-auto text-gray-400 text-2xl mb-2" />
  //                     <span className="text-sm text-gray-600">Dodaj sliku</span>
  //                     <input
  //                       type="file"
  //                       accept="image/*"
  //                       onChange={(e) => handleImageChange(e, "image1")}
  //                       className="hidden"
  //                     />
  //                   </label>
  //                 </div>
  //               )}
  //             </div>

  //             <div>
  //               <label className="block text-sm font-medium text-gray-700 mb-1">
  //                 Slika 2
  //               </label>
  //               {formData.image2 ? (
  //                 <div className="relative">
  //                   <img
  //                     src={URL.createObjectURL(formData.image2)}
  //                     alt="Preview"
  //                     className="h-32 w-full object-cover rounded-lg"
  //                   />
  //                   <button
  //                     type="button"
  //                     onClick={() => removeImage("image2")}
  //                     className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
  //                   >
  //                     <FaTimes size={12} />
  //                   </button>
  //                 </div>
  //               ) : (
  //                 <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 h-32">
  //                   <label className="cursor-pointer text-center">
  //                     <FaImage className="mx-auto text-gray-400 text-2xl mb-2" />
  //                     <span className="text-sm text-gray-600">Dodaj sliku</span>
  //                     <input
  //                       type="file"
  //                       accept="image/*"
  //                       onChange={(e) => handleImageChange(e, "image2")}
  //                       className="hidden"
  //                     />
  //                   </label>
  //                 </div>
  //               )}
  //             </div>
  //           </div>

  //           <div>
  //             <label className="block text-sm font-medium text-gray-700 mb-1">
  //               Opis vozila
  //             </label>
  //             <textarea
  //               name="description"
  //               placeholder="Opis vozila i dodatne specifikacije..."
  //               value={formData.description}
  //               onChange={handleChange}
  //               rows="3"
  //               className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
  //             />
  //           </div>

  //           <button
  //             type="submit"
  //             disabled={uploading}
  //             className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center justify-center w-full disabled:opacity-50"
  //           >
  //             {uploading ? (
  //               <>Dodavanje...</>
  //             ) : (
  //               <>
  //                 <FaPlus className="mr-2" />
  //                 Dodaj vozilo
  //               </>
  //             )}
  //           </button>
  //         </form>
  //       </div>
  //     </div>
  //   </div>
  // );
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
            Dodaj novo vozilo
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <div className="flex items-center">
                    <FaCar className="mr-2 text-blue-500" />
                    Tip vozila *
                  </div>
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
                >
                  <option value="">Odaberi vrstu vozila</option>
                  <option value="Kamion">Kamion</option>
                  <option value="Kombi">Kombi</option>
                  <option value="Šleper">Šleper</option>
                  <option value="Dostavno vozilo">Dostavno vozilo</option>
                  <option value="Hladnjača">Hladnjača</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <div className="flex items-center">
                    <FaHashtag className="mr-2 text-purple-500" />
                    Registarska oznaka *
                  </div>
                </label>
                <input
                  name="licensePlate"
                  placeholder="npr. BG123AB"
                  value={formData.licensePlate}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <div className="flex items-center">
                    <FaWeight className="mr-2 text-green-500" />
                    Nosivost (kg) *
                  </div>
                </label>
                <input
                  name="capacity"
                  type="number"
                  placeholder="npr. 3500"
                  value={formData.capacity}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <div className="flex items-center">
                    <FaCalendar className="mr-2 text-[#ff6dd8]" />
                    Godina proizvodnje
                  </div>
                </label>
                <input
                  name="year"
                  type="number"
                  placeholder="npr. 2020"
                  value={formData.year}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <div className="flex items-center">
                    <FaPallet className="mr-2 text-indigo-500" />
                    Broj paletnih mesta
                  </div>
                </label>
                <input
                  name="pallets"
                  type="number"
                  placeholder="npr. 10"
                  value={formData.pallets}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <div className="flex items-center">
                    <FaRuler className="mr-2 text-yellow-400" />
                    Dimenzije (cm)
                  </div>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    name="length"
                    type="number"
                    placeholder="Dužina"
                    value={formData.dimensions.length}
                    onChange={handleChange}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
                  />
                  <input
                    name="width"
                    type="number"
                    placeholder="Širina"
                    value={formData.dimensions.width}
                    onChange={handleChange}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
                  />
                  <input
                    name="height"
                    type="number"
                    placeholder="Visina"
                    value={formData.dimensions.height}
                    onChange={handleChange}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
                  />
                </div>
              </div>

              {/* Upload slika */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <div className="flex items-center">
                    <FaImage className="mr-2 text-[#BA68C8]" />
                    Slika 1
                  </div>
                </label>
                {formData.image1 ? (
                  <div className="relative">
                    <img
                      src={URL.createObjectURL(formData.image1)}
                      alt="Preview"
                      className="h-32 w-full object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage("image1")}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 transition-colors duration-300 hover:bg-red-600"
                    >
                      <FaTimes size={12} />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 h-32 transition-colors duration-300 hover:border-blue-400">
                    <label className="cursor-pointer text-center">
                      <FaImage className="mx-auto text-gray-400 text-2xl mb-2 transition-colors duration-300 hover:text-blue-500" />
                      <span className="text-sm text-gray-600 transition-colors duration-300 hover:text-blue-500">
                        Dodaj sliku
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageChange(e, "image1")}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}
              </div>

              {/* <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <div className="flex items-center">
                    <FaImage className="mr-2 text-[#accbcf]" />
                    Slika 2
                  </div>
                </label>
                {formData.image2 ? (
                  <div className="relative">
                    <img
                      src={URL.createObjectURL(formData.image2)}
                      alt="Preview"
                      className="h-32 w-full object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage("image2")}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 transition-colors duration-300 hover:bg-red-600"
                    >
                      <FaTimes size={12} />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 h-32 transition-colors duration-300 hover:border-blue-400">
                    <label className="cursor-pointer text-center">
                      <FaImage className="mx-auto text-gray-400 text-2xl mb-2 transition-colors duration-300 hover:text-blue-500" />
                      <span className="text-sm text-gray-600 transition-colors duration-300 hover:text-blue-500">
                        Dodaj sliku
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageChange(e, "image2")}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}
              </div> */}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <div className="flex items-center">
                  <FaInfo className="mr-2 text-gray-500" />
                  Opis vozila
                </div>
              </label>
              <textarea
                name="description"
                placeholder="Opis vozila i dodatne specifikacije..."
                value={formData.description}
                onChange={handleChange}
                rows="3"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
              />
            </div>

            <button
              type="submit"
              disabled={uploading}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center justify-center w-full disabled:opacity-50 transition-colors duration-300"
            >
              {uploading ? (
                <>Dodavanje...</>
              ) : (
                <>
                  <FaPlus className="mr-2" />
                  Dodaj vozilo
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
