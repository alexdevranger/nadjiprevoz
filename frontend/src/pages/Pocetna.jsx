import React, { useEffect, useRef, useState } from "react";
import {
  motion,
  useAnimation,
  useInView,
  useScroll,
  useTransform,
} from "framer-motion";
import { Link } from "react-router-dom";
import Swiper from "swiper";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import {
  FaArrowRight,
  FaCheckCircle,
  FaSearch,
  FaRoute,
  FaClipboardList,
  FaUsers,
  FaShieldAlt,
  FaChartLine,
} from "react-icons/fa";
import Monitor from "../images/monitor2.png";
import Kamion from "../images/kamionGif.gif";

import { Typewriter } from "react-simple-typewriter";
import FeaturesSectionMain from "@/components/FeaturesSectionMain";
import Oglasi from "@/components/Oglasi";
import Kontakt from "./Kontakt";
import Pricing from "../components/Pricing";
import ViberCommunity from "./ViberCommunity";

// Demo podaci za prikaz turi i zahteva
const demoTure = [
  {
    id: 1,
    od: "Beograd",
    do: "Niš",
    datum: "15.12.2023.",
    vozilo: "Hladnjača",
    tonaza: "10t",
  },
  {
    id: 2,
    od: "Novi Sad",
    do: "Subotica",
    datum: "16.12.2023.",
    vozilo: "Platforma",
    tonaza: "15t",
  },
  {
    id: 3,
    od: "Kragujevac",
    do: "Zrenjanin",
    datum: "17.12.2023.",
    vozilo: "CEntara",
    tonaza: "8t",
  },
];

const demoZahtevi = [
  {
    id: 1,
    od: "Beograd",
    do: "Zagreb",
    datum: "18.12.2023.",
    tip: "Hladnjača",
    opis: "Prevoze hranu",
  },
  {
    id: 2,
    od: "Novi Sad",
    do: "Budimpešta",
    datum: "19.12.2023.",
    tip: "Platforma",
    opis: "Prevoze mašine",
  },
  {
    id: 3,
    od: "Niš",
    do: "Sofija",
    datum: "20.12.2023.",
    tip: "CEntara",
    opis: "Prevoze gradevinski materijal",
  },
];

const gridContainerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.35 },
  },
};

const gridSquareVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

// Komponenta kartice po uzoru na DashboardCard
const HomeCard = ({ icon, title, description, color }) => (
  <div
    className={`bg-white rounded-xl shadow-md p-8 h-full transition-all duration-300 hover:shadow-lg hover:transform hover:-translate-y-1 border-l-4 ${color}`}
  >
    <div className="flex items-center mb-6">
      <div className={`text-2xl mr-3 ${color.replace("border-l-", "text-")}`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-800">{title}</h3>
    </div>
    <p className="text-gray-600">{description}</p>
  </div>
);

const Pocetna = () => {
  const { scrollYProgress: completionProgress } = useScroll();
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true });
  const mainControls = useAnimation();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const paragraphOneValue = useTransform(
    scrollYProgress,
    [0, 1],
    ["-100%", "0%"]
  );

  const paragraphTwoValue = useTransform(
    scrollYProgress,
    [0, 1],
    ["100%", "0%"]
  );

  useEffect(() => {
    if (isInView) {
      mainControls.start("visible");
    }
  }, [isInView]);
  // slider
  useEffect(() => {
    const swiper = new Swiper(".video-swiper", {
      modules: [Navigation, Pagination],
      slidesPerView: 1,
      spaceBetween: 50,
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
      breakpoints: {
        640: {
          slidesPerView: 1,
        },
        768: {
          slidesPerView: 2,
        },
        1024: {
          slidesPerView: 3,
        },
      },
    });

    return () => {
      swiper.destroy();
    };
  }, []);
  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center">
        <div className="container mx-auto px-6 py-16">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="lg:w-1/2 text-center lg:text-left">
              <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
                NAĐI PREVOZ
              </h1>
              <h2 className="text-2xl font-bold text-gray-600 mb-8 flex flex-wrap items-center justify-center lg:justify-start">
                <span className="text-blue-600 mr-2">
                  <Typewriter
                    words={[
                      "PAMETNO POVEZIVANJE TURA",
                      "EFIKASNA ORGANIZACIJA",
                      "SVI TRANSPORTNI ZAHTEVI NA JEDNOM MESTU",
                    ]}
                    loop={Infinity}
                    cursor
                    cursorStyle="_"
                    typeSpeed={40}
                    deleteSpeed={30}
                    delaySpeed={4000}
                  />
                </span>
                <img
                  src={Kamion}
                  alt="Kamion animacija"
                  className="w-12 h-12 object-contain"
                />
              </h2>
              <p className="text-lg text-gray-600 mb-10 leading-relaxed">
                Platforma koja revolucionarno povezuje pružaoce transportnih
                usluga sa klijentima. Više povratnih tura, više posla, pomoć AI
                prijatelja.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  to="/register"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-300 flex items-center justify-center"
                >
                  Započni odmah <FaArrowRight className="ml-2" />
                </Link>
                <Link
                  to="/alltours"
                  className="border border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold py-3 px-8 rounded-lg transition-colors duration-300 flex items-center justify-center"
                >
                  Pogledaj ture <FaRoute className="ml-2" />
                </Link>
              </div>
            </div>
            <div className="lg:w-1/2">
              <img
                src={Monitor}
                alt="TransportHub platforma"
                className="w-full rounded-xl shadow-xl"
              />
            </div>
          </div>
        </div>
      </div>
      {/* Video Tutorials Section */}
      {/* Video Tutorials Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Kako funkcioniše NađiPrevoz ?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Pogledajte kratke video tutorijale kako biste brzo savladali
              korišćenje naše platforme.
            </p>
          </div>

          <div className="relative">
            {/* Swiper Container */}
            <div className="swiper-container video-swiper overflow-hidden pb-12">
              <div className="swiper-wrapper">
                {/* Video Slide 1 */}
                <div className="swiper-slide">
                  <div className="bg-white rounded-xl shadow-md overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-lg hover:transform hover:-translate-y-1">
                    <div className="relative pb-[56.25%] h-0 overflow-hidden">
                      <iframe
                        className="absolute top-0 left-0 w-full h-full"
                        src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                        title="YouTube video player 1"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                    <div className="p-6 flex-grow">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">
                        Kako da kreirate svoj prvi zahtev
                      </h3>
                      <p className="text-gray-600">
                        Naučite kako da postavite svoj prvi zahtev za transport
                        u samo nekoliko koraka.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Video Slide 2 */}
                <div className="swiper-slide">
                  <div className="bg-white rounded-xl shadow-md overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-lg hover:transform hover:-translate-y-1">
                    <div className="relative pb-[56.25%] h-0 overflow-hidden">
                      <iframe
                        className="absolute top-0 left-0 w-full h-full"
                        src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                        title="YouTube video player 2"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                    <div className="p-6 flex-grow">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">
                        Upravljanje turama - kompletno uputstvo
                      </h3>
                      <p className="text-gray-600">
                        Saznajte kako da efikasno organizujete i pratite sve
                        vaše ture.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Video Slide 3 */}
                <div className="swiper-slide">
                  <div className="bg-white rounded-xl shadow-md overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-lg hover:transform hover:-translate-y-1">
                    <div className="relative pb-[56.25%] h-0 overflow-hidden">
                      <iframe
                        className="absolute top-0 left-0 w-full h-full"
                        src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                        title="YouTube video player 3"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                    <div className="p-6 flex-grow">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">
                        Kako da pronađete idealne prevoznike
                      </h3>
                      <p className="text-gray-600">
                        Saveti kako da pronađete i verifikujete najpouzdanije
                        prevoznike za vaše potrebe.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Video Slide 4 */}
                <div className="swiper-slide">
                  <div className="bg-white rounded-xl shadow-md overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-lg hover:transform hover:-translate-y-1">
                    <div className="relative pb-[56.25%] h-0 overflow-hidden">
                      <iframe
                        className="absolute top-0 left-0 w-full h-full"
                        src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                        title="YouTube video player 4"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                    <div className="p-6 flex-grow">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">
                        Praćenje transakcija i sigurnost
                      </h3>
                      <p className="text-gray-600">
                        Objašnjenje kako platforma obezbeđuje sigurnu razmenu i
                        praćenje svih transakcija.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pagination */}
              <div className="swiper-pagination mt-6"></div>
            </div>
          </div>
        </div>
      </section>
      {/* Prednosti sajta */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Zašto odabrati baš nas?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Naša platforma je dizajnirana da olakša i unapredi transportne
              usluge kroz pametne alate i jednostavno korišćenje.
            </p>
          </div>

          <motion.div
            variants={gridContainerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <motion.div variants={gridSquareVariants}>
              <HomeCard
                icon={<FaSearch />}
                title="Brzo pronalaženje"
                description="Pronađite idealne ture ili transportne zahteve u samo nekoliko klikova."
                color="border-l-blue-500"
              />
            </motion.div>

            <motion.div variants={gridSquareVariants}>
              <HomeCard
                icon={<FaRoute />}
                title="Upravljanje turama"
                description="Organizujte i pratite sve svoje ture na jednom mestu."
                color="border-l-green-500"
              />
            </motion.div>

            <motion.div variants={gridSquareVariants}>
              <HomeCard
                icon={<FaUsers />}
                title="Široka mreža"
                description="Povežite se sa pouzdanim prevoznicima i klijentima širom regiona."
                color="border-l-purple-500"
              />
            </motion.div>

            <motion.div variants={gridSquareVariants}>
              <HomeCard
                icon={<FaShieldAlt />}
                title="Sigurna transakcija"
                description="Bezbedna platforma sa verifikovanim korisnicima i transparentnim uslovima."
                color="border-l-red-500"
              />
            </motion.div>

            <motion.div variants={gridSquareVariants}>
              <HomeCard
                icon={<FaChartLine />}
                title="Analitika i izveštaji"
                description="Pratite performanse i generišite detaljne izveštaje o vašem transportnom poslovanju."
                color="border-l-yellow-500"
              />
            </motion.div>

            <motion.div variants={gridSquareVariants}>
              <HomeCard
                icon={<FaCheckCircle />}
                title="Jednostavna upotreba"
                description="Intuitivan interfejs koji omogućava brzo i lako korišćenje bez obuke."
                color="border-l-indigo-500"
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Prikaz turi i zahteva */}
      <section className="py-20 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Kako izgledaju naše ture i zahtevi?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Pogledajte kako platforma prikazuje dostupne ture i transportne
              zahteve
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Ture */}
            <div className="bg-white rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl hover:transform hover:-translate-y-1">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <FaRoute className="text-xl text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">
                  Dostupne ture
                </h3>
              </div>
              <p className="text-gray-600 mb-6">
                Pregledajte sve dostupne ture koje prevoznici nude. Filtriranje
                po lokaciji, tipu vozila i datumu vam olakšava pronalaženje
                idealne turе.
              </p>

              <div className="space-y-4">
                {demoTure.map((tura) => (
                  <div
                    key={tura.id}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow border-l-4 border-blue-300"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-gray-800">
                          {tura.od} → {tura.do}
                        </h4>
                        <p className="text-sm text-gray-600">
                          Datum: {tura.datum}
                        </p>
                      </div>
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                        {tura.vozilo}
                      </span>
                    </div>
                    <div className="mt-2 text-sm text-gray-700">
                      Tonáža: {tura.tonaza}
                    </div>
                  </div>
                ))}
              </div>

              <Link
                to="/alltours"
                className="inline-flex items-center mt-6 text-blue-600 hover:text-blue-800 font-medium"
              >
                Pogledaj sve ture <FaArrowRight className="ml-2" />
              </Link>
            </div>

            {/* Zahtevi */}
            <div className="bg-white rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl hover:transform hover:-translate-y-1">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                  <FaClipboardList className="text-xl text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">
                  Transportni zahtevi
                </h3>
              </div>
              <p className="text-gray-600 mb-6">
                Klijenti postavljaju zahteve za transportom robe. Pregledajte
                aktivne zahteve i pronađite one koji odgovaraju vašim
                kapacitetima i raspoloživosti.
              </p>

              <div className="space-y-4">
                {demoZahtevi.map((zahtev) => (
                  <div
                    key={zahtev.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow border-l-4 border-green-300"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-gray-800">
                          {zahtev.od} → {zahtev.do}
                        </h4>
                        <p className="text-sm text-gray-600">
                          Datum: {zahtev.datum}
                        </p>
                      </div>
                      <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
                        {zahtev.tip}
                      </span>
                    </div>
                    <div className="mt-2 text-sm text-gray-700">
                      {zahtev.opis}
                    </div>
                  </div>
                ))}
              </div>

              <Link
                to="/allshipments"
                className="inline-flex items-center mt-6 text-green-600 hover:text-green-800 font-medium"
              >
                Pogledaj sve zahteve <FaArrowRight className="ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>
      <Pricing />

      {/* Call to Action */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Spremni da transformišete svoj transportni biznis?
          </h2>
          <p className="text-xl mb-10 max-w-2xl mx-auto">
            Pridružite se našoj zajednici prevoznika i klijenata i iskusite
            jednostavnost organizacije transporta na jednom mestu.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-white text-blue-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg transition-colors duration-300"
            >
              Registrujte se besplatno
            </Link>
            <Link
              to="/login"
              className="border border-white text-white hover:bg-blue-700 font-semibold py-3 px-8 rounded-lg transition-colors duration-300"
            >
              Već imate nalog? Prijavite se
            </Link>
          </div>
        </div>
      </section>
      {/* Viber */}
      <ViberCommunity />
      {/* <Oglasi /> */}
      <FeaturesSectionMain />
      <Kontakt />
    </div>
  );
};

export default Pocetna;
