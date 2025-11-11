// src/i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import srTranslation from "./translations/sr/global.json";
import enTranslation from "./translations/en/global.json";

const resources = {
  sr: {
    translation: srTranslation, // Koristite "translation" kao default
  },
  en: {
    translation: enTranslation, // Koristite "translation" kao default
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "sr",
  fallbackLng: "sr",
  debug: true,

  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
