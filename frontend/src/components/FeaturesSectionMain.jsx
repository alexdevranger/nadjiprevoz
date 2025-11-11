import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Truck, Users, Search, ShieldCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const FeaturesSectionMain = () => {
  const { t, i18n } = useTranslation();
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.setAttribute(
      "dir",
      i18n.language === "ar" ? "rtl" : "ltr"
    );
  }, [i18n.language]);

  // Definišite features unutar komponente da biste mogli koristiti t() funkciju
  const features = [
    {
      icon: <Truck className="w-10 h-10 text-blue-600" />,
      title: t("Quick connection"),
      description: t(
        "Our app currently connects transporters and transport seekers without unnecessary waiting."
      ),
    },
    {
      icon: <Users className="w-10 h-10 text-green-600" />,
      title: t("Wide network"),
      description: t(
        "Access a large network of verified users and clients across the country."
      ),
    },
    {
      icon: <Search className="w-10 h-10 text-purple-600" />,
      title: t("Simple search"),
      description: t(
        "Smart filters and algorithms help you quickly find suitable partners."
      ),
    },
    {
      icon: <ShieldCheck className="w-10 h-10 text-red-600" />,
      title: t("Security and trust"),
      description: t(
        "All users are verified to ensure maximum safety in cooperation."
      ),
    },
  ];

  return (
    <section className="relative w-full py-20 bg-gray-50 dark:bg-cardBGText">
      <div className="max-w-6xl mx-auto px-6 text-center">
        {/* Naslov */}
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-extrabold text-[#0b0c0c] dark:text-white mb-6"
        >
          {t("Fast, secure and simple")}
        </motion.h2>

        {/* Podnaslov */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-lg md:text-xl text-gray-600 dark:text-darkText max-w-3xl mx-auto mb-16"
        >
          {t(
            "Our platform provides everything you need to find the right transport partner in a few clicks."
          )}
        </motion.p>

        {/* Kartice sa mogućnostima */}
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              className="bg-white dark:bg-mainDarkBG shadow-xl rounded-2xl p-8 hover:shadow-2xl transition-all duration-300"
            >
              <div className="h-[125px]">
                <div className="flex justify-center mb-3">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-3">
                  {feature.title}
                </h3>
              </div>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-[15px]">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSectionMain;
