import React, { useState } from "react";
import { Link } from "react-router-dom";

const Oglasi = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="w-full h-[200px] flex kamionBg flex-col items-center justify-center md:flex-row">
      {/* Leva strana - Tražim prevoz */}
      <Link
        to="/alltours"
        className={`w-full md:w-1/2 h-full md:h-full flex items-center justify-center text-white text-5xl font-bold cursor-pointer transition-all ease-in-out duration-500 
        ${isHovered ? "bg-blue-500" : "bg-blue-500 hover:bg-blue-600"}`}
        onMouseEnter={() => setIsHovered(false)} // Kada hoveruje na levoj strani, vrati originalnu boju
      >
        Tražim prevoz
      </Link>

      {/* Desna strana - Nudim prevoz */}
      <Link
        to="/alltours"
        className="w-full md:w-1/2 h-full md:h-full flex items-center justify-center bg-[#ffffff] hover:bg-[#6c6c6c4a] ease-in-out duration-500 text-black text-5xl font-bold cursor-pointer transition-all"
        onMouseEnter={() => setIsHovered(true)} // Kada hoveruje na desnoj strani, leva postaje bela
      >
        Nudim prevoz
      </Link>
    </div>
  );
};

export default Oglasi;
