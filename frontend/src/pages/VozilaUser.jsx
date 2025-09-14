import React from "react";
import { Link } from "react-router-dom";
import { FaTruck, FaPlusCircle } from "react-icons/fa";

const VozilaUser = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl w-full">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-12 -mt-24">
          Upravljanje vozilima
        </h1>

        {/* Grid sa 2 boxa */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Moja vozila */}
          <Link
            to="/my-vehicles"
            className="block w-full h-full text-white no-underline"
          >
            <div
              className="flex flex-col items-center justify-center p-8 bg-white rounded-xl shadow-xl 
              hover:shadow-2xl transform hover:-translate-y-2 transition duration-300 
              h-full border border-transparent hover:border-blue-500 relative"
            >
              <FaTruck className="text-blue-600 text-6xl mb-6" />
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Moja Vozila
              </h3>
              <p className="text-gray-600 text-center">
                Pregledaj i upravljaj vozilima koja su već dodata.
              </p>
            </div>
          </Link>

          {/* Dodaj vozilo */}
          <Link
            to="/add-vehicle"
            className="block w-full h-full text-white no-underline"
          >
            <div
              className="flex flex-col items-center justify-center p-8 bg-white rounded-xl shadow-xl 
              hover:shadow-2xl transform hover:-translate-y-2 transition duration-300 
              h-full border border-transparent hover:border-green-500 relative"
            >
              <FaPlusCircle className="text-green-600 text-6xl mb-6" />
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Dodaj Vozilo
              </h3>
              <p className="text-gray-600 text-center">
                Unesi podatke i dodaj novo vozilo u svoj profil.
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VozilaUser;
