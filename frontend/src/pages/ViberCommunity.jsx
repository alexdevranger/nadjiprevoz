import React from "react";
import { motion } from "framer-motion";
import { MessageCircle, QrCode } from "lucide-react";
import QrCodeImg from "../images/qrcodeproba.png"; // Ubaci svoj QR kod u assets folder

const ViberCommunity = () => {
  return (
    <section className="relative overflow-hidden bg-white dark:bg-cardBGText min-h-screen flex py-20 px-6 md:px-12 lg:px-24">
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Tekstualni deo */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          <h2 className="text-4xl md:text-6xl text-[#0b0c0c] dark:text-gray-400 font-bold leading-tight">
            Pridruži se našoj <span className="text-blue-600">Viber </span>{" "}
            grupi
          </h2>

          <p className="text-lg max-w-lg text-[#0b0c0c] dark:text-white">
            Viber grupa dodatno omogucava korisnicima da se povežu, razmenjuju
            iskustva i dobiju brzu podršku.
            <br />
            Budi deo naše zajednice i ostani u toku sa najnovijim informacijama
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 mt-6">
            <a
              href="https://invite.viber.com/your-community-link"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-2xl shadow-lg transition-transform transform hover:-translate-y-1"
            >
              <MessageCircle className="w-5 h-5" />
              Pridruži se
            </a>
            <p className="text-sm text-gray-800">Skeniraj QR kod</p>
          </div>
        </motion.div>

        {/* QR deo */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center justify-center bg-gray-200 backdrop-blur-md p-8 rounded-3xl shadow-2xl"
        >
          <img
            src={QrCodeImg} // ubaci svoj QR kod ovde
            alt="Viber QR Code"
            className="w-48 h-48 mb-4 rounded-xl shadow-md"
          />
          <p className="text-gray-800 text-sm text-center max-w-xs">
            Skeniraj QR code sa kamerom mobilnog telefona da se pridružiš našoj
            Viber zajednici!
          </p>
        </motion.div>
      </div>

      {/* Dekoracija */}
      <div className="absolute top-0 left-0 w-40 h-40 bg-purple-600/20 blur-3xl rounded-full -z-10"></div>
      <div className="absolute bottom-0 right-0 w-60 h-60 bg-indigo-500/10 blur-3xl rounded-full -z-10"></div>
    </section>
  );
};

export default ViberCommunity;
