// src/components/SidebarSettings.jsx
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import ThemeSwitch from "./ThemeSwitch";

const languages = [
  { code: "sr", label: "Srpski", flag: "🇷🇸" },
  { code: "en", label: "Engleski", flag: "🇺🇸" },
  { code: "ba", label: "Bosanski", flag: "🇧🇦" },
  { code: "mk", label: "Makedonski", flag: "🇲🇰" },
];

const SidebarSettings = () => {
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Koristimo useTranslation hook
  const { i18n } = useTranslation();

  const selectedLang = i18n.language;
  const selectedLanguage =
    languages.find((l) => l.code === selectedLang) || languages[0];

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed top-1/2 left-0 -translate-y-1/2 bg-blueBg dark:bg-darkText dark:text-black text-white p-2 rounded-r-xl shadow-lg z-50"
        >
          <ChevronRight size={20} />
        </button>
      )}

      <div
        className={`fixed top-0 left-0 h-full w-56 bg-white dark:bg-cardBGText shadow-xl border-r border-gray-200 dark:border-gray-700 z-40 transform transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            Podešavanje
          </h2>
          <button
            onClick={() => setOpen(false)}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white transition"
          >
            <ChevronLeft size={24} />
          </button>
        </div>

        <div className="p-4 dark:text-white">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-white mb-2">
            Jezik
          </h3>
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-full flex items-center justify-between bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-lg text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            >
              <span className="flex items-center gap-2">
                <span>{selectedLanguage.flag}</span>
                {selectedLanguage.label}
              </span>
              <ChevronDown
                className={`transition-transform ${
                  dropdownOpen ? "rotate-180" : ""
                }`}
                size={16}
              />
            </button>

            {dropdownOpen && (
              <ul className="absolute mt-2 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 max-h-60 overflow-auto">
                {languages.map((lang) => (
                  <li
                    key={lang.code}
                    onClick={() => {
                      changeLanguage(lang.code);
                      setDropdownOpen(false);
                    }}
                    className="px-3 py-2 flex items-center gap-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200"
                  >
                    <span>{lang.flag}</span>
                    {lang.label}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700 mt-4">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Tema
          </h3>
          <ThemeSwitch />
        </div>
      </div>
    </>
  );
};

export default SidebarSettings;
