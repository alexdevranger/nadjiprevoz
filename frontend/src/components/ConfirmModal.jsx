// import React from "react";
// import {
//   FaExclamationTriangle,
//   FaCheck,
//   FaTimes,
//   FaInfoCircle,
//   FaQuestion,
// } from "react-icons/fa";

// const ConfirmModal = ({
//   isOpen,
//   onClose,
//   onConfirm,
//   title,
//   message,
//   confirmText = "Da",
//   cancelText = "Ne",
//   type = "warning",
//   isLoading = false,
// }) => {
//   if (!isOpen) return null;

//   const getIconAndColor = () => {
//     switch (type) {
//       case "danger":
//         return {
//           icon: <FaExclamationTriangle className="text-xl" />,
//           bgColor: "bg-red-100",
//           iconColor: "text-red-600",
//           buttonColor: "bg-red-600 hover:bg-red-700",
//           borderColor: "border-red-200",
//         };
//       case "success":
//         return {
//           icon: <FaCheck className="text-xl" />,
//           bgColor: "bg-green-100",
//           iconColor: "text-green-600",
//           buttonColor: "bg-green-600 hover:bg-green-700",
//           borderColor: "border-green-200",
//         };
//       case "info":
//         return {
//           icon: <FaInfoCircle className="text-xl" />,
//           bgColor: "bg-blue-100",
//           iconColor: "text-blue-600",
//           buttonColor: "bg-blue-600 hover:bg-blue-700",
//           borderColor: "border-blue-200",
//         };
//       case "warning":
//       default:
//         return {
//           icon: <FaQuestion className="text-xl" />,
//           bgColor: "bg-yellow-100",
//           iconColor: "text-yellow-600",
//           buttonColor: "bg-yellow-600 hover:bg-yellow-700",
//           borderColor: "border-yellow-200",
//         };
//     }
//   };

//   const { icon, bgColor, iconColor, buttonColor, borderColor } =
//     getIconAndColor();

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div
//         className={`bg-white rounded-xl max-w-md w-full mx-auto border-l-4 ${borderColor}`}
//       >
//         {/* Header */}
//         <div className={`${bgColor} p-4 rounded-t-xl`}>
//           <div className="flex items-center">
//             <div
//               className={`p-3 rounded-full ${iconColor} bg-white bg-opacity-90 mr-4`}
//             >
//               {icon}
//             </div>
//             <div>
//               <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
//               <p className="text-gray-600 text-sm mt-1">{message}</p>
//             </div>
//           </div>
//         </div>

//         {/* Action Buttons */}
//         <div className="p-6">
//           <div className="flex gap-3">
//             <button
//               onClick={onConfirm}
//               disabled={isLoading}
//               className={`flex-1 ${buttonColor} text-white py-3 rounded-lg transition-colors flex items-center justify-center font-medium disabled:opacity-50 disabled:cursor-not-allowed`}
//             >
//               {isLoading ? (
//                 <>
//                   <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
//                   Obrada...
//                 </>
//               ) : (
//                 confirmText
//               )}
//             </button>
//             <button
//               onClick={onClose}
//               disabled={isLoading}
//               className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {cancelText}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ConfirmModal;
import React from "react";
import {
  FaExclamationTriangle,
  FaCheck,
  FaTimes,
  FaInfoCircle,
  FaQuestion,
  FaCrown,
  FaTrash,
  FaEdit,
} from "react-icons/fa";

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Da",
  cancelText = "Ne",
  type = "warning",
  isLoading = false,
}) => {
  if (!isOpen) return null;

  const getIconAndColor = () => {
    switch (type) {
      case "danger":
        return {
          icon: <FaTrash className="text-lg" />,
          bgGradient: "bg-gradient-to-br from-purple-50 to-pink-50",
          headerBg: "bg-gradient-to-r from-purple-600 to-pink-600",
          iconBg: "bg-gradient-to-br from-purple-500 to-pink-500",
          iconColor: "text-white",
          buttonColor:
            "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700",
          borderColor: "border-purple-200",
        };
      case "success":
        return {
          icon: <FaCheck className="text-lg" />,
          bgGradient: "bg-gradient-to-br from-green-50 to-emerald-50",
          headerBg: "bg-gradient-to-r from-green-600 to-emerald-600",
          iconBg: "bg-gradient-to-br from-green-500 to-emerald-500",
          iconColor: "text-white",
          buttonColor:
            "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700",
          borderColor: "border-green-200",
        };
      case "info":
        return {
          icon: <FaInfoCircle className="text-lg" />,
          bgGradient: "bg-gradient-to-br from-blue-50 to-cyan-50",
          headerBg: "bg-gradient-to-r from-blue-600 to-cyan-600",
          iconBg: "bg-gradient-to-br from-blue-500 to-cyan-500",
          iconColor: "text-white",
          buttonColor:
            "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700",
          borderColor: "border-blue-200",
        };
      case "premium":
        return {
          icon: <FaCrown className="text-lg" />,
          bgGradient: "bg-gradient-to-br from-yellow-50 to-amber-50",
          headerBg: "bg-gradient-to-r from-yellow-600 to-amber-600",
          iconBg: "bg-gradient-to-br from-yellow-500 to-amber-500",
          iconColor: "text-white",
          buttonColor:
            "bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700",
          borderColor: "border-yellow-200",
        };
      case "warning":
      default:
        return {
          icon: <FaQuestion className="text-lg" />,
          bgGradient: "bg-gradient-to-br from-orange-50 to-amber-50",
          headerBg: "bg-gradient-to-r from-orange-600 to-amber-600",
          iconBg: "bg-gradient-to-br from-orange-500 to-amber-500",
          iconColor: "text-white",
          buttonColor:
            "bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700",
          borderColor: "border-orange-200",
        };
    }
  };

  const {
    icon,
    bgGradient,
    headerBg,
    iconBg,
    iconColor,
    buttonColor,
    borderColor,
  } = getIconAndColor();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        className={`bg-white rounded-2xl shadow-2xl max-w-md w-full mx-auto border ${borderColor} overflow-hidden transform transition-all duration-300 scale-100 hover:scale-[1.02]`}
      >
        {/* Header sa gradientom */}
        <div className={`${headerBg} text-white p-6`}>
          <div className="flex items-center space-x-4">
            <div className={`${iconBg} p-3 rounded-xl shadow-lg`}>{icon}</div>
            <div className="flex-1">
              <h3 className="text-xl font-bold">{title}</h3>
              <p className="text-white/90 text-sm mt-1">{message}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className={`${bgGradient} p-6`}>
          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className={`flex-1 ${buttonColor} text-white py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95`}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Obrada...
                </>
              ) : (
                confirmText
              )}
            </button>
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white py-3 px-6 rounded-xl transition-all duration-300 font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
            >
              {cancelText}
            </button>
          </div>

          {/* Additional Info */}
          <div className="mt-4 text-center">
            <div className="inline-flex items-center text-xs text-gray-500 bg-white/50 px-3 py-1 rounded-full">
              <svg
                className="w-3 h-3 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Akcija je nepovratna
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
