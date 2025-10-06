// import React from "react";
// import { FaCrown, FaTimes } from "react-icons/fa";
// // import QRCode from "react-qr-code";

// export default function PaymentModal({
//   open,
//   data,
//   onClose,
//   copyToClipboard,
//   copyAllPaymentData,
// }) {
//   if (!open || !data) return null;

//   // ✅ Generisanje IPS QR koda (NBS format)
//   const generateIpsQr = (accountNumber, amount, referenceNumber) => {
//     // Račun mora biti bez crtica (npr. "160-1234567890123-10" -> "160123456789012310")
//     const cleanedAccount = accountNumber.replace(/-/g, "");

//     // IPS standard za QR (po NBS specifikaciji)
//     // Primer formata (za RSD): "K:PR|V:01|C:1|R:160123456789012310|N:Premium Uplata|I:12345|P:1000.00"
//     const qrData = `K:PR|V:01|C:1|R:${cleanedAccount}|N:Premium Uplata|I:${referenceNumber}|P:${Number(
//       amount
//     ).toFixed(2)}`;
//     return qrData;
//   };

//   const qrValue = generateIpsQr(
//     data.accountNumber,
//     data.amount,
//     data.referenceNumber
//   );

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-xl max-w-md w-full mx-auto">
//         {/* Header */}
//         <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-xl">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center">
//               <div className="bg-white bg-opacity-20 p-2 rounded-lg mr-3">
//                 <FaCrown className="text-xl" />
//               </div>
//               <div>
//                 <h3 className="text-xl font-bold">Premium Uplata</h3>
//                 <p className="text-blue-100 text-sm mt-1">
//                   Podaci za uplatu premium paketa
//                 </p>
//               </div>
//             </div>
//             <button
//               onClick={onClose}
//               className="text-white hover:text-blue-200 transition-colors"
//             >
//               <FaTimes className="text-xl" />
//             </button>
//           </div>
//         </div>

//         {/* Content */}
//         <div className="p-6">
//           {/* IPS Banner */}
//           <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4 mb-6">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center">
//                 <div className="bg-green-600 text-white p-2 rounded-lg mr-3">
//                   <svg
//                     className="w-6 h-6"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M13 10V3L4 14h7v7l9-11h-7z"
//                     />
//                   </svg>
//                 </div>
//                 <div>
//                   <h4 className="font-semibold text-green-800">
//                     Instant Payments Serbia
//                   </h4>
//                   <p className="text-green-600 text-sm">NBS IPS QR Code</p>
//                 </div>
//               </div>
//               <div className="text-right">
//                 <div className="text-xs text-gray-500">Supported by</div>
//                 <div className="font-semibold text-blue-700">
//                   National Bank of Serbia
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Payment Details */}
//           <div className="space-y-4">
//             <div className="bg-gray-50 rounded-lg p-4">
//               <div className="flex justify-between items-center mb-2">
//                 <span className="text-sm font-medium text-gray-600">
//                   Iznos:
//                 </span>
//                 <button
//                   onClick={() => copyToClipboard(data.amount.toString())}
//                   className="text-blue-600 hover:text-blue-800 transition-colors"
//                   title="Kopiraj iznos"
//                 >
//                   📋
//                 </button>
//               </div>
//               <p className="text-2xl font-bold text-gray-800">
//                 {data.amount} RSD
//               </p>
//             </div>

//             <div className="bg-gray-50 rounded-lg p-4">
//               <div className="flex justify-between items-center mb-2">
//                 <span className="text-sm font-medium text-gray-600">
//                   Broj računa:
//                 </span>
//                 <button
//                   onClick={() => copyToClipboard(data.accountNumber)}
//                   className="text-blue-600 hover:text-blue-800 transition-colors"
//                   title="Kopiraj broj računa"
//                 >
//                   📋
//                 </button>
//               </div>
//               <p className="text-lg font-mono text-gray-800">
//                 {data.accountNumber}
//               </p>
//             </div>

//             <div className="bg-gray-50 rounded-lg p-4">
//               <div className="flex justify-between items-center mb-2">
//                 <span className="text-sm font-medium text-gray-600">
//                   Poziv na broj:
//                 </span>
//                 <button
//                   onClick={() => copyToClipboard(data.referenceNumber)}
//                   className="text-blue-600 hover:text-blue-800 transition-colors"
//                   title="Kopiraj poziv na broj"
//                 >
//                   📋
//                 </button>
//               </div>
//               <p className="text-lg font-mono text-gray-800">
//                 {data.referenceNumber}
//               </p>
//             </div>
//           </div>

//           {/* ✅ QR Kod */}
//           <div className="mt-6 flex flex-col items-center justify-center">
//             <div className="bg-white border border-gray-300 p-4 rounded-lg shadow-sm">
//               <QRCode value={qrValue} size={180} />
//             </div>
//             <p className="text-sm text-gray-600 mt-3">
//               Skenirajte za brzu uplatu
//             </p>
//           </div>

//           {/* Action Buttons */}
//           <div className="flex gap-3 mt-6">
//             <button
//               onClick={copyAllPaymentData}
//               className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition-colors font-medium"
//             >
//               Kopiraj sve
//             </button>
//             <button
//               onClick={onClose}
//               className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-lg transition-colors font-medium"
//             >
//               Zatvori
//             </button>
//           </div>

//           <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
//             <p className="text-sm text-yellow-800 text-center">
//               📋 Nakon uplate, premium status će biti aktiviran u roku od 24h
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// import React, { useState } from "react";
// import axios from "axios";
// import { FaCrown, FaTimes, FaQrcode, FaMapMarkerAlt } from "react-icons/fa";

// export default function PaymentModal({
//   open,
//   data,
//   onClose,
//   copyToClipboard,
//   copyAllPaymentData,
// }) {
//   const [qrImage, setQrImage] = useState(null);
//   const [payerName, setPayerName] = useState("");
//   const [payerCity, setPayerCity] = useState("");
//   const [showInput, setShowInput] = useState(false);
//   const [loading, setLoading] = useState(false);

//   if (!open || !data) return null;

//   const handleGenerateQr = async () => {
//     if (!payerName.trim()) {
//       alert("Unesite ime i prezime za generisanje QR koda");
//       return;
//     }

//     setLoading(true);
//     console.log("Podaci za QR:", data);

//     const paymentObj = {
//       creditorAccount: data.accountNumber,
//       creditorName: "ID PROTECT DOO",
//       amount: data.amount,
//       currency: "RSD",
//       debtorName: payerName.trim(),
//       debtorCity: payerCity.trim(),
//       purposeCode: "221",
//       paymentPurpose: "Uplata za Premium oglas",
//       referenceNumber: data.referenceNumber,
//       size: 300,
//     };

//     console.log("Payment objekat za backend:", paymentObj);

//     try {
//       const response = await axios.post("/api/ips/generate-qr", paymentObj);

//       if (response.data.success) {
//         console.log("QR uspešno generisan");
//         setQrImage(response.data.qrBase64);
//       } else {
//         alert(`Greška: ${response.data.message}`);
//         console.error("Backend greška:", response.data);
//       }
//     } catch (err) {
//       console.error("Detaljna greška:", err.response?.data);
//       alert(
//         `Greška pri generisanju QR koda: ${
//           err.response?.data?.message || err.message
//         }`
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-xl max-w-md w-full mx-auto shadow-2xl">
//         {/* Header sa gradientom */}
//         <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-xl">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center">
//               <div className="bg-white bg-opacity-20 p-2 rounded-lg mr-3">
//                 <FaCrown className="text-xl" />
//               </div>
//               <div>
//                 <h3 className="text-xl font-bold">Premium Uplata</h3>
//                 <p className="text-blue-100 text-sm mt-1">
//                   Podaci za uplatu premium paketa
//                 </p>
//               </div>
//             </div>
//             <button
//               onClick={onClose}
//               className="text-white hover:text-blue-200 transition-colors"
//             >
//               <FaTimes className="text-xl" />
//             </button>
//           </div>
//         </div>

//         {/* Content */}
//         <div className="p-6">
//           {/* IPS Banner */}
//           <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4 mb-6">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center">
//                 <div className="bg-green-600 text-white p-2 rounded-lg mr-3">
//                   <svg
//                     className="w-6 h-6"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M13 10V3L4 14h7v7l9-11h-7z"
//                     />
//                   </svg>
//                 </div>
//                 <div>
//                   <h4 className="font-semibold text-green-800">
//                     Instant Payments Serbia
//                   </h4>
//                   <p className="text-green-600 text-sm">NBS IPS QR Code</p>
//                 </div>
//               </div>
//               <div className="text-right">
//                 <div className="text-xs text-gray-500">Supported by</div>
//                 <div className="font-semibold text-blue-700">
//                   National Bank of Serbia
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Payment Details */}
//           <div className="space-y-4 mb-6">
//             <div className="bg-gray-50 rounded-lg p-4">
//               <div className="flex justify-between items-center mb-2">
//                 <span className="text-sm font-medium text-gray-600">
//                   Iznos:
//                 </span>
//                 <button
//                   onClick={() => copyToClipboard(data.amount.toString())}
//                   className="text-blue-600 hover:text-blue-800 transition-colors"
//                   title="Kopiraj iznos"
//                 >
//                   <svg
//                     className="w-4 h-4"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
//                     />
//                   </svg>
//                 </button>
//               </div>
//               <p className="text-2xl font-bold text-gray-800">
//                 {data.amount} RSD
//               </p>
//             </div>

//             <div className="bg-gray-50 rounded-lg p-4">
//               <div className="flex justify-between items-center mb-2">
//                 <span className="text-sm font-medium text-gray-600">
//                   Broj računa:
//                 </span>
//                 <button
//                   onClick={() => copyToClipboard(data.accountNumber)}
//                   className="text-blue-600 hover:text-blue-800 transition-colors"
//                   title="Kopiraj broj računa"
//                 >
//                   <svg
//                     className="w-4 h-4"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
//                     />
//                   </svg>
//                 </button>
//               </div>
//               <p className="text-lg font-mono text-gray-800">
//                 {data.accountNumber}
//               </p>
//             </div>

//             <div className="bg-gray-50 rounded-lg p-4">
//               <div className="flex justify-between items-center mb-2">
//                 <span className="text-sm font-medium text-gray-600">
//                   Poziv na broj:
//                 </span>
//                 <button
//                   onClick={() => copyToClipboard(data.referenceNumber)}
//                   className="text-blue-600 hover:text-blue-800 transition-colors"
//                   title="Kopiraj poziv na broj"
//                 >
//                   <svg
//                     className="w-4 h-4"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
//                     />
//                   </svg>
//                 </button>
//               </div>
//               <p className="text-lg font-mono text-gray-800">
//                 {data.referenceNumber}
//               </p>
//             </div>
//           </div>

//           {/* QR Code Section */}
//           {!showInput ? (
//             <div
//               onClick={() => setShowInput(true)}
//               className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors mb-6"
//             >
//               <div className="text-gray-400 flex flex-col items-center">
//                 <FaQrcode size={48} className="mb-3" />
//                 <span className="text-center text-lg font-medium">
//                   Kliknite za generisanje
//                 </span>
//                 <span className="text-center text-sm mt-1">IPS QR koda</span>
//               </div>
//             </div>
//           ) : (
//             <div className="space-y-4 mb-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Ime i prezime uplatioca *
//                 </label>
//                 <input
//                   type="text"
//                   placeholder="Unesite ime i prezime"
//                   className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   value={payerName}
//                   onChange={(e) => setPayerName(e.target.value)}
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
//                   <FaMapMarkerAlt className="mr-2 text-red-500" />
//                   Grad (opciono)
//                 </label>
//                 <input
//                   type="text"
//                   placeholder="Unesite grad"
//                   className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   value={payerCity}
//                   onChange={(e) => setPayerCity(e.target.value)}
//                 />
//               </div>

//               <button
//                 onClick={handleGenerateQr}
//                 disabled={!payerName.trim() || loading}
//                 className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-3 px-6 rounded-lg transition-all duration-300 font-semibold shadow-lg hover:shadow-xl disabled:cursor-not-allowed flex items-center justify-center"
//               >
//                 {loading ? (
//                   <>
//                     <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
//                     Generiše se...
//                   </>
//                 ) : (
//                   <>
//                     <FaQrcode className="mr-2" />
//                     Generiši QR kod
//                   </>
//                 )}
//               </button>
//             </div>
//           )}

//           {/* Generated QR Code */}
//           {qrImage && (
//             <div className="space-y-4">
//               <div className="flex justify-center">
//                 <img
//                   src={`data:image/png;base64,${qrImage}`}
//                   alt="IPS QR Code"
//                   className="border-2 border-gray-200 rounded-lg shadow-lg"
//                 />
//               </div>

//               <div className="flex gap-3">
//                 <button
//                   onClick={copyAllPaymentData}
//                   className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-3 rounded-lg transition-all duration-300 font-medium shadow-lg hover:shadow-xl flex items-center justify-center"
//                 >
//                   <svg
//                     className="w-5 h-5 mr-2"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
//                     />
//                   </svg>
//                   Kopiraj sve
//                 </button>
//               </div>
//             </div>
//           )}

//           {/* Instructions */}
//           <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
//             <p className="text-sm text-yellow-800 text-center">
//               📋 Nakon uplate, premium status će biti aktiviran u roku od 24h
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useState } from "react";
import axios from "axios";
import { useToast } from "../components/ToastContext";
import {
  FaCrown,
  FaTimes,
  FaQrcode,
  FaMapMarkerAlt,
  FaUser,
  FaMoneyBillWave,
  FaHashtag,
  FaCreditCard,
  FaFileInvoice,
  FaArrowLeft,
} from "react-icons/fa";

export default function PaymentModal({
  open,
  data,
  onClose,
  copyToClipboard,
  copyAllPaymentData,
}) {
  const [qrImage, setQrImage] = useState(null);
  const [payerName, setPayerName] = useState("");
  const [payerCity, setPayerCity] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const { success, error, warning, info } = useToast();

  if (!open || !data) return null;

  const handleGenerateQr = async () => {
    if (!payerName.trim()) {
      success("Unesite ime i prezime za generisanje QR koda");
      return;
    }

    setLoading(true);

    const paymentObj = {
      creditorAccount: data.accountNumber,
      creditorName: "ID PROTECT DOO",
      amount: data.amount,
      currency: "RSD",
      debtorName: payerName.trim(),
      debtorCity: payerCity.trim(),
      purposeCode: "221",
      paymentPurpose: "Uplata za Premium oglas",
      referenceNumber: data.referenceNumber,
      size: 250,
    };

    try {
      const response = await axios.post("/api/ips/generate-qr", paymentObj);

      if (response.data.success) {
        setQrImage(response.data.qrBase64);
      } else {
        error(`Greška: ${response.data.message}`);
      }
    } catch (err) {
      error(
        `Greška pri generisanju QR koda: ${
          err.response?.data?.message || err.message
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancelInput = () => {
    setShowInput(false);
    setPayerName("");
    setPayerCity("");
    setQrImage(null);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        className="bg-white rounded-xl max-w-md w-full mx-auto shadow-2xl flex flex-col"
        style={{ maxHeight: "90vh" }}
      >
        {/* Header sa gradientom - FIKSNO */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-t-xl flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-white bg-opacity-20 p-2 rounded-lg mr-3">
                <FaCrown className="text-lg" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Premium Uplata</h3>
                <p className="text-blue-100 text-xs mt-1">
                  Podaci za uplatu premium paketa
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-blue-200 transition-colors"
            >
              <FaTimes className="text-lg" />
            </button>
          </div>
        </div>

        {/* Content - SCROLLABLE */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* IPS Banner - SMANJEN */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-3 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-green-600 text-white p-1 rounded mr-2">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-green-800 text-sm">
                    Instant Payments Serbia
                  </h4>
                  <p className="text-green-600 text-xs">NBS IPS QR Code</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-500">Supported by</div>
                <div className="font-semibold text-blue-700 text-xs">
                  National Bank of Serbia
                </div>
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="space-y-3 mb-4">
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <FaMoneyBillWave className="text-green-600 mr-2 text-sm" />
                  <span className="text-sm font-medium text-gray-600">
                    Iznos:
                  </span>
                </div>
                <button
                  onClick={() => copyToClipboard(data.amount.toString())}
                  className="text-blue-600 hover:text-blue-800 transition-colors text-xs"
                  title="Kopiraj iznos"
                >
                  Kopiraj
                </button>
              </div>
              <p className="text-lg font-bold text-gray-800">
                {data.amount} RSD
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <FaCreditCard className="text-blue-600 mr-2 text-sm" />
                  <span className="text-sm font-medium text-gray-600">
                    Ime firme:
                  </span>
                </div>
                <button
                  onClick={() => copyToClipboard("ID PROTECT DOO")}
                  className="text-blue-600 hover:text-blue-800 transition-colors text-xs"
                  title="Kopiraj ime firme"
                >
                  Kopiraj
                </button>
              </div>
              <p className="text-sm text-gray-800">
                ID PROTECT DOO Aranđelovac
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <FaCreditCard className="text-blue-600 mr-2 text-sm" />
                  <span className="text-sm font-medium text-gray-600">
                    Broj računa:
                  </span>
                </div>
                <button
                  onClick={() => copyToClipboard(data.accountNumber)}
                  className="text-blue-600 hover:text-blue-800 transition-colors text-xs"
                  title="Kopiraj broj računa"
                >
                  Kopiraj
                </button>
              </div>
              <p className="text-sm font-mono text-gray-800">
                {data.accountNumber}
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <FaHashtag className="text-purple-600 mr-2 text-sm" />
                  <span className="text-sm font-medium text-gray-600">
                    Poziv na broj:
                  </span>
                </div>
                <button
                  onClick={() => copyToClipboard(data.referenceNumber)}
                  className="text-blue-600 hover:text-blue-800 transition-colors text-xs"
                  title="Kopiraj poziv na broj"
                >
                  Kopiraj
                </button>
              </div>
              <p className="text-sm font-mono text-gray-800">
                {data.referenceNumber}
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <FaFileInvoice className="text-orange-600 mr-2 text-sm" />
                  <span className="text-sm font-medium text-gray-600">
                    Svrha uplate:
                  </span>
                </div>
                <button
                  onClick={() => copyToClipboard("Uplata za Premium oglas")}
                  className="text-blue-600 hover:text-blue-800 transition-colors text-xs"
                  title="Kopiraj svrhu uplate"
                >
                  Kopiraj
                </button>
              </div>
              <p className="text-sm text-gray-800">Uplata za Premium oglas</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center mb-1">
                <FaHashtag className="text-red-600 mr-2 text-sm" />
                <span className="text-sm font-medium text-gray-600">
                  Šifra plaćanja:
                </span>
              </div>
              <p className="text-xs text-gray-700">221 - Ostale usluge</p>
            </div>
          </div>

          {/* QR Code Section */}
          {!showInput ? (
            <div
              onClick={() => setShowInput(true)}
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors mb-4"
            >
              <div className="text-gray-400 flex flex-col items-center">
                <FaQrcode size={32} className="mb-2" />
                <span className="text-center text-sm font-medium">
                  Generiši IPS QR kod
                </span>
                <span className="text-center text-xs mt-1 text-gray-500">
                  Kliknite za unos podataka
                </span>
              </div>
            </div>
          ) : (
            <div className="space-y-3 mb-4">
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <FaUser className="text-blue-600 mr-2 text-sm" />
                  Ime i prezime uplatioca *
                </label>
                <input
                  type="text"
                  placeholder="Unesite ime i prezime"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={payerName}
                  onChange={(e) => setPayerName(e.target.value)}
                />
              </div>

              {/* <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <FaMapMarkerAlt className="text-red-500 mr-2 text-sm" />
                  Grad (opciono)
                </label>
                <input
                  type="text"
                  placeholder="Unesite grad"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={payerCity}
                  onChange={(e) => setPayerCity(e.target.value)}
                />
              </div> */}

              <div className="flex gap-2">
                <button
                  onClick={handleGenerateQr}
                  disabled={!payerName.trim() || loading}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-2 px-4 rounded-lg transition-all duration-300 font-medium text-sm disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2"></div>
                      Generiše se...
                    </>
                  ) : (
                    <>
                      <FaQrcode className="mr-2 text-xs" />
                      Generiši QR kod
                    </>
                  )}
                </button>

                <button
                  onClick={handleCancelInput}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-all duration-300 font-medium text-sm flex items-center justify-center"
                >
                  <FaArrowLeft className="mr-2 text-xs" />
                  Odustani
                </button>
              </div>
            </div>
          )}

          {/* Generated QR Code */}
          {qrImage && (
            <div className="space-y-3">
              <div className="flex justify-center">
                <img
                  src={`data:image/png;base64,${qrImage}`}
                  alt="IPS QR Code"
                  className="border border-gray-200 rounded-lg max-w-[180px]"
                />
              </div>

              <button
                onClick={copyAllPaymentData}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-2 rounded-lg transition-all duration-300 font-medium text-sm flex items-center justify-center"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                Kopiraj sve podatke
              </button>
            </div>
          )}
        </div>

        {/* Footer - FIKSNO */}
        <div className="p-3 bg-yellow-50 border-t border-yellow-200 rounded-b-xl flex-shrink-0">
          <p className="text-xs text-yellow-800 text-center">
            📋 Nakon uplate, premium status će biti aktiviran u roku od 24h
          </p>
        </div>
      </div>
    </div>
  );
}
