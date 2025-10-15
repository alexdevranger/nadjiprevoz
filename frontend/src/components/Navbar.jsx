import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useGlobalState, setGlobalState } from "../helper/globalState";
import Lottie from "lottie-react";
import bellAnimation from "../animations/notifications.json";
import axios from "axios";
import {
  FaHome,
  FaMap,
  FaRoute,
  FaClipboardList,
  FaTachometerAlt,
  FaTruck,
  FaPlusCircle,
  FaComments,
  FaBell,
  FaUser,
  FaHistory,
  FaSignOutAlt,
  FaCog,
  FaStore,
} from "react-icons/fa";

export default function Navbar() {
  const [user] = useGlobalState("user");
  const [totalUnread] = useGlobalState("totalUnread");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [profileTimeout, setProfileTimeout] = useState(null);
  const [hasShop, setHasShop] = useState(false);
  const [shop, setShop] = useState(null);
  const [token] = useGlobalState("token");
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setGlobalState("user", null);
    setGlobalState("token", null);
    navigate("/login");
  }

  const handleProfileHover = (open) => {
    if (profileTimeout) {
      clearTimeout(profileTimeout);
      setProfileTimeout(null);
    }

    if (open) {
      setIsProfileOpen(true);
    } else {
      const timeout = setTimeout(() => {
        setIsProfileOpen(false);
      }, 300);
      setProfileTimeout(timeout);
    }
  };

  const handleProfileClick = (e) => {
    e.stopPropagation();
    setIsProfileOpen(!isProfileOpen);
  };

  // proveri shop
  useEffect(() => {
    const checkShop = async () => {
      try {
        const token = localStorage.getItem("token");

        // Proveri da li token postoji
        if (!token) {
          console.error("Token nije pronađen");
          // Redirect to login ili pokaži error
          return;
        }
        const shopRes = await axios.get("/api/shop", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Shop podaci:", shopRes.data);
        setHasShop(shopRes.data !== null);
        setShop(shopRes.data);
      } catch (err) {
        console.error("Greška pri proveri shopa:", err);
        setHasShop(false);
        setShop(null);
      }
    };

    if (token) {
      checkShop();
    }
  }, [token]);

  // Zatvori dropdown kada se klikne negde drugde
  useEffect(() => {
    const handleClickOutside = () => {
      setIsProfileOpen(false);
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center shadow-md">
      {/* Logo i javne navigacione stavke */}
      <div className="flex items-center space-x-6">
        <Link to="/" className="text-xl font-bold flex items-center">
          <FaTruck className="mr-2" /> Nadji prevoz
        </Link>

        {/* Javne stavke koje vide svi */}
        <div className="hidden md:flex items-center space-x-4">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center px-3 py-2 rounded-md transition-colors ${
                isActive ? "bg-blue-700" : "hover:bg-blue-700"
              }`
            }
          >
            <FaHome className="mr-1" /> Početna
          </NavLink>

          <NavLink
            to="/map"
            className={({ isActive }) =>
              `flex items-center px-3 py-2 rounded-md transition-colors ${
                isActive ? "bg-blue-700" : "hover:bg-blue-700"
              }`
            }
          >
            <FaMap className="mr-1" /> Mapa
          </NavLink>
          <NavLink
            to="/pitanja-i-odgovori"
            className={({ isActive }) =>
              `flex items-center px-3 py-2 rounded-md transition-colors ${
                isActive ? "bg-blue-700" : "hover:bg-blue-700"
              }`
            }
          >
            <FaMap className="mr-1" /> Pitanja i odgovori
          </NavLink>

          <NavLink
            to="/alltours"
            className={({ isActive }) =>
              `flex items-center px-3 py-2 rounded-md transition-colors ${
                isActive ? "bg-blue-700" : "hover:bg-blue-700"
              }`
            }
          >
            <FaRoute className="mr-1" /> Sve ture
          </NavLink>

          <NavLink
            to="/allshipments"
            className={({ isActive }) =>
              `flex items-center px-3 py-2 rounded-md transition-colors ${
                isActive ? "bg-blue-700" : "hover:bg-blue-700"
              }`
            }
          >
            <FaClipboardList className="mr-1" /> Zahtevi
          </NavLink>

          {/* Chat - vidljiv svima ali funkcionalan samo za ulogovane */}
          <NavLink
            to="/chat"
            className={({ isActive }) =>
              `flex items-center px-3 py-2 rounded-md transition-colors relative ${
                isActive ? "bg-blue-700" : "hover:bg-blue-700"
              }`
            }
          >
            <FaComments className="mr-1" /> Chat
            {user && totalUnread > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {totalUnread}
              </span>
            )}
          </NavLink>
        </div>
      </div>

      {/* Desna strana - korisnički deo */}
      <div className="flex items-center space-x-4">
        {user ? (
          <>
            {/* Notifikacije sa Lottie animacijom */}
            <div className="relative group">
              <button className="p-2 rounded-full hover:bg-blue-700 transition-colors">
                <div className="w-6 h-6 relative">
                  <FaBell className="text-lg" />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                    3
                  </span>
                </div>
              </button>

              {/* Animacija koja se pojavljuje na hover */}
              <div className="absolute -top-10 -right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Lottie
                  animationData={bellAnimation}
                  className="w-12 h-12"
                  loop={true}
                />
              </div>
            </div>

            {/* Profil dropdown sa svim privatnim opcijama */}
            <div
              className="relative"
              onMouseEnter={() => handleProfileHover(true)}
              onMouseLeave={() => handleProfileHover(false)}
            >
              <button
                onClick={handleProfileClick}
                className="flex items-center space-x-2 p-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                {user?.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt="Profil"
                    className="w-8 h-8 rounded-full object-cover border-2 border-white bg-white"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-blue-400 flex items-center justify-center text-white font-bold">
                    {user?.name?.charAt(0) ||
                      user?.companyName?.charAt(0) ||
                      user?.username?.charAt(0) ||
                      "K"}
                  </div>
                )}
                <span className="hidden md:block">
                  {user?.name ||
                    user?.companyName ||
                    user?.username ||
                    "Korisnik"}
                </span>
                <svg
                  className={`h-4 w-4 transition-transform ${
                    isProfileOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white text-gray-800 rounded-md shadow-lg py-1 z-50">
                  <div className="px-4 py-2 border-b">
                    <p className="text-sm font-medium">Prijavljeni ste kao</p>
                    <p className="text-sm">
                      {user?.hasCompany ? "Kompanija" : "Pojedinac"}
                    </p>
                  </div>

                  <Link
                    to="/dashboard"
                    className="flex items-center px-4 py-2 hover:bg-blue-50 transition-colors"
                  >
                    <FaTachometerAlt className="mr-2 text-blue-600" /> Kontrolna
                    tabla
                  </Link>

                  {hasShop && shop && (
                    <Link
                      to={`/shop/${shop.slug}`}
                      className="flex items-center px-4 py-3 mx-2 my-2 bg-purple-100 hover:bg-purple-200 
               rounded-lg shadow-sm border border-purple-300 transition-colors font-medium text-purple-800"
                    >
                      <FaStore className="mr-2 text-purple-700 text-lg" /> Moja
                      radnja
                    </Link>
                  )}
                  {/* Usluge - grupisane */}
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 border-t">
                    MOJE USLUGE
                  </div>

                  <Link
                    to="/add-vehicle"
                    className="flex items-center px-4 py-2 hover:bg-blue-50 transition-colors"
                  >
                    <FaPlusCircle className="mr-2 text-blue-600" /> Dodaj vozilo
                  </Link>
                  <Link
                    to="/my-vehicles"
                    className="flex items-center px-4 py-2 hover:bg-blue-50 transition-colors"
                  >
                    <FaTruck className="mr-2 text-blue-600" /> Moja vozila
                  </Link>
                  <Link
                    to="/add-tour"
                    className="flex items-center px-4 py-2 hover:bg-blue-50 transition-colors"
                  >
                    <FaPlusCircle className="mr-2 text-blue-600" /> Dodaj turu
                  </Link>
                  <Link
                    to="/my-tours"
                    className="flex items-center px-4 py-2 hover:bg-blue-50 transition-colors"
                  >
                    <FaRoute className="mr-2 text-blue-600" /> Moje ture
                  </Link>
                  <Link
                    to="/add-shipment"
                    className="flex items-center px-4 py-2 hover:bg-blue-50 transition-colors"
                  >
                    <FaPlusCircle className="mr-2 text-blue-600" /> Dodaj zahtev
                  </Link>
                  <Link
                    to="/my-shipments"
                    className="flex items-center px-4 py-2 hover:bg-blue-50 transition-colors"
                  >
                    <FaClipboardList className="mr-2 text-blue-600" /> Moji
                    zahtevi
                  </Link>

                  {/* Ostalo */}
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 border-t">
                    OSTALO
                  </div>

                  <Link
                    to="/istorija"
                    className="flex items-center px-4 py-2 hover:bg-blue-50 transition-colors"
                  >
                    <FaHistory className="mr-2 text-blue-600" /> Istorija
                    poslova
                  </Link>
                  <Link
                    to="/alltours"
                    className="flex items-center px-4 py-2 hover:bg-blue-50 transition-colors"
                  >
                    <FaClipboardList className="mr-2 text-blue-600" /> Ponudeni
                    poslovi
                  </Link>
                  <Link
                    to="/profile"
                    className="flex items-center px-4 py-2 hover:bg-blue-50 transition-colors"
                  >
                    <FaUser className="mr-2 text-blue-600" /> Moj profil
                  </Link>
                  <Link
                    to="/settings"
                    className="flex items-center px-4 py-2 hover:bg-blue-50 transition-colors"
                  >
                    <FaCog className="mr-2 text-blue-600" /> Podešavanja
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 hover:bg-blue-50 transition-colors text-left border-t"
                  >
                    <FaSignOutAlt className="mr-2 text-blue-600" /> Odjavi se
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex space-x-2">
            <NavLink
              to="/login"
              className="px-3 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Prijava
            </NavLink>
            <NavLink
              to="/register"
              className="px-3 py-2 rounded-md bg-blue-500 hover:bg-blue-700 transition-colors"
            >
              Registracija
            </NavLink>
          </div>
        )}
      </div>
    </nav>
  );
}
