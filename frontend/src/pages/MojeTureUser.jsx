import React from "react";
import { FaRoute, FaPlusCircle } from "react-icons/fa";
import { Link } from "react-router-dom";

const MojeTureUser = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-3xl font-bold text-gray-800 text-center mb-12 -mt-24">
        Upravljanje turama
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-4xl">
        {/* Moje Ture */}
        <Link
          to="/my-tours"
          className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center justify-center text-center 
                     hover:shadow-2xl transition-shadow duration-300 no-underline"
        >
          <FaRoute className="text-blue-600 text-5xl mb-4" />
          <h2 className="text-2xl font-bold text-gray-800">Moje Ture</h2>
          <p className="text-gray-500 mt-2">
            Pregled i upravljanje tvojim turama
          </p>
        </Link>

        {/* Dodaj Turu */}
        <Link
          to="/add-tour"
          className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center justify-center text-center 
                     hover:shadow-2xl transition-shadow duration-300 no-underline"
        >
          <FaPlusCircle className="text-green-600 text-5xl mb-4" />
          <h2 className="text-2xl font-bold text-gray-800">Dodaj Turu</h2>
          <p className="text-gray-500 mt-2">Kreiraj novu turu</p>
        </Link>
      </div>
    </div>
  );
};

export default MojeTureUser;
