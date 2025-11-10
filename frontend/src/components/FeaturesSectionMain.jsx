import React from "react";
import { motion } from "framer-motion";
import { Truck, Users, Search, ShieldCheck } from "lucide-react";

const features = [
  {
    icon: <Truck className="w-10 h-10 text-blue-600" />,
    title: "Brzo povezivanje",
    description:
      "Naša aplikacija trenutno povezuje prevoznike i potražioce prevoza bez nepotrebnog čekanja.",
  },
  {
    icon: <Users className="w-10 h-10 text-green-600" />,
    title: "Široka mreža",
    description:
      "Pristupite velikoj mreži proverenih korisnika i klijenata širom zemlje.",
  },
  {
    icon: <Search className="w-10 h-10 text-purple-600" />,
    title: "Jednostavna pretraga",
    description:
      "Pametni filteri i algoritmi pomažu da brzo pronađete odgovarajuće partnere.",
  },
  {
    icon: <ShieldCheck className="w-10 h-10 text-red-600" />,
    title: "Sigurnost i poverenje",
    description:
      "Svi korisnici su verifikovani kako bi saradnja bila maksimalno bezbedna.",
  },
];

const FeaturesSectionMain = () => {
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
          Brzo, sigurno i jednostavno
        </motion.h2>

        {/* Podnaslov */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-16"
        >
          Naša platforma pruža sve što vam je potrebno da pronađete pravog
          partnera za transport u nekoliko klikova.
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
              <div className="flex justify-center mb-6">{feature.icon}</div>
              <h3 className="text-xl font-semibold  text-gray-600 dark:text-gray-400 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-white text-base">
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
