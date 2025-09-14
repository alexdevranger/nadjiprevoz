// import React, { useEffect, useRef, useState } from "react";
// import {
//   motion,
//   useAnimation,
//   useInView,
//   useScroll,
//   useTransform,
// } from "framer-motion";
// import { Link } from "react-router-dom";
// import Monitor from "../images/monitor2.png";
// import Kamion from "../images/kamionGif.gif";
// import IstorijaGif from "../images/istorijaGif.gif";
// import LokacijaGif from "../images/locationGif.gif";
// import ClockGif from "../images/clockGif.gif";
// import BrzoPretrazivanje from "../images/searchGif.gif";
// import { Typewriter } from "react-simple-typewriter";
// import FeaturesSectionMain from "@/components/FeaturesSectionMain";
// import Oglasi from "@/components/Oglasi";
// import Kontakt from "./Kontakt";
// // import RegistracijaDugme from "../components/RegistracijaDugme";

// const gridContainerVariants = {
//   hidden: { opacity: 0 },
//   show: {
//     opacity: 1,
//     transition: { staggerChildren: 0.35 },
//   },
// };

// const gridSquareVeriants = {
//   hidden: { opacity: 0 },
//   show: { opacity: 1 },
// };

// const svgIconVariants = {
//   hidden: {
//     opacity: 0.3,
//     pathLength: 0,
//     fill: "rgba(252, 211, 77, 0)",
//   },
//   visible: {
//     opacity: 1,
//     pathLength: 1,
//     fill: "rgba(252, 211, 77, 1)",
//   },
// };

// const Pocetna = () => {
//   const { scrollYProgress: completionProgress } = useScroll();

//   const containerRef = useRef(null);

//   const isInView = useInView(containerRef, { once: true });
//   const mainControls = useAnimation();

//   const { scrollYProgress } = useScroll({
//     target: containerRef,
//     offset: ["start end", "end start"],
//   });

//   const paragraphOneValue = useTransform(
//     scrollYProgress,
//     [0, 1],
//     ["-100%", "0%"]
//   );

//   const paragraphTwoValue = useTransform(
//     scrollYProgress,
//     [0, 1],
//     ["100%", "0%"]
//   );

//   useEffect(() => {
//     if (isInView) {
//       mainControls.start("visible");
//     }
//   }, [isInView]);

//   return (
//     <div>
//       {/* Hero Section */}
//       <div className="flex flex-col min-h-screen bgMain">
//         <main className="flex-grow">
//           <div className="container mx-auto px-6 py-16 text-center">
//             <h1 className="text-5xl md:text-7xl font-bold text-gray-800 mb-6 tracking-tight pt-9">
//               TRANSPORTHUB
//             </h1>
//             <h2 className="text-2xl font-extrabold text-gray-600 pb-9 flex justify-center items-center">
//               <span className="text-blue-600 pt-[1px]">
//                 <Typewriter
//                   words={[
//                     "BRZO POVEZIVANJE",
//                     "LAKO KORISCENJE",
//                     "SVE NA JEDNOM MESTU",
//                   ]}
//                   loop={Infinity}
//                   cursor
//                   cursorStyle="_"
//                   typeSpeed={35}
//                   deleteSpeed={25}
//                   delaySpeed={5000}
//                 />
//               </span>
//               <img
//                 src={Kamion}
//                 alt="Kamion animacija"
//                 className="mt-[-5px] w-[50px] h-full object-contain"
//               />
//             </h2>
//             <div className="flex flex-col lg:flex-row justify-center items-center pt-12 gap-8">
//               <div className="lg:w-1/2">
//                 <img src={Monitor} alt="Monitor" className="w-full" />
//               </div>
//               <div className="mt-[-100px] cursor-default lg:w-1/2 bg-gray-100 text-gray-600 p-8 rounded-lg shadow-xl border transition-all ease-in duration-500 hover:border-gray-500 hover:shadow-xl">
//                 <p className="text-lg md:text-xl leading-relaxed font-semibold ">
//                   Na pravom ste mestu! Ako nudite usluge prevoza ili vam je
//                   potrebna sigurna i brza dostava, tu smo da vas povežemo.
//                   Izaberite svoju ulogu i postanite deo naše zajednice koja
//                   olakšava transport širom Srbije. Registrujte se i započnite
//                   već danas.
//                 </p>
//                 <Link to="">
//                   {/* <button className="text-white hover:text-gray-500 px-6 py-2 border rounded-md mt-12 transition-all ease-in duration-300 border-gray-500 hover:border-gray-500 bg-blue-500 hover:bg-white">
//                     Registracija
//                   </button> */}
//                   {/* <button className="group group-hover:before:duration-500 group-hover:after:duration-500 after:duration-500 hover:border-rose-300 hover:before:[box-shadow:_20px_20px_20px_30px_#a21caf] duration-500 before:duration-500 hover:duration-500 underline underline-offset-2 hover:after:-right-8 hover:before:right-12 hover:before:-bottom-8 hover:before:blur hover:underline hover:underline-offset-4 origin-left hover:decoration-2 hover:text-rose-300 relative bg-neutral-800 h-16 w-64 border text-center p-3 text-gray-50 text-base font-bold rounded-lg overflow-hidden before:absolute before:w-12 before:h-12 before:content[''] before:right-1 before:top-1 before:z-10 before:bg-violet-500 before:rounded-full before:blur-lg after:absolute after:z-10 after:w-20 after:h-20 after:content[''] after:bg-rose-300 after:right-8 after:top-3 after:rounded-full after:blur-lg">
//                     Registracija
//                   </button> */}
//                   <div className="w-full flex justify-center items-center pt-6">
//                     {/* <RegistracijaDugme /> */}
//                   </div>
//                   {/* <div className="w-full flex justify-center">
//                     <button class="border duration-300 relative group cursor-pointer text-sky-50  overflow-hidden h-16 w-64 rounded-md bg-sky-200 p-2 flex justify-center items-center font-extrabold">
//                       <div class="absolute right-32 -top-4  group-hover:top-1 group-hover:right-2 z-10 w-40 h-40 rounded-full group-hover:scale-150 duration-500 bg-sky-900"></div>
//                       <div class="absolute right-2 -top-4  group-hover:top-1 group-hover:right-2 z-10 w-32 h-32 rounded-full group-hover:scale-150  duration-500 bg-sky-800"></div>
//                       <div class="absolute -right-12 top-4 group-hover:top-1 group-hover:right-2 z-10 w-24 h-24 rounded-full group-hover:scale-150  duration-500 bg-sky-700"></div>
//                       <div class="absolute right-20 -top-4 group-hover:top-1 group-hover:right-2 z-10 w-16 h-16 rounded-full group-hover:scale-150  duration-500 bg-sky-600"></div>
//                       <p class="z-10">Registracija</p>
//                     </button>
//                   </div> */}
//                 </Link>
//               </div>
//             </div>
//           </div>
//         </main>
//       </div>
//       <Oglasi />

//       {/* Prednosti sajta */}
//       <motion.section
//         variants={gridContainerVariants}
//         initial="hidden"
//         animate="show"
//         className="bg-gradient-to-b min-h-screen from-white to-gray-50 py-20 cursor-default"
//       >
//         <div className="container mx-auto text-center">
//           {/* Heading Section */}
//           <h2 className="text-4xl font-extrabold text-gray-800 mb-8 tracking-tight">
//             Zašto odabrati nas?
//           </h2>
//           <p className="text-lg text-gray-500 font-semibold max-w-2xl mx-auto mb-12 px-6">
//             Naša platforma je dizajnirana da pruži brzinu, pouzdanost i
//             sigurnost.
//           </p>

//           {/* Feature Cards */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
//             {/* Ušteda vremena */}
//             <motion.div
//               variants={gridSquareVeriants}
//               className="relative bg-gray-100 p-8 rounded-lg shadow-lg transition-transform transform hover:scale-105"
//             >
//               <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 flex justify-center items-center w-16 h-16 bg-gray-500 border border-gray-200 rounded-full shadow-md overflow-hidden">
//                 {/* Ubacujemo GIF umesto SVG-a */}
//                 <img
//                   src={ClockGif}
//                   alt="Ušteda vremena"
//                   className="w-3/4 h-full object-contain"
//                 />
//               </div>
//               <h3 className="text-2xl font-bold text-gray-800 mt-10">
//                 Ušteda vremena
//               </h3>
//               <p className="text-gray-600 mt-4">
//                 Preko naše platforme pronalaženje posla traje svega nekoliko
//                 sekundi.
//               </p>
//             </motion.div>
//             {/* Brzo povezivanje */}
//             <motion.div
//               variants={gridSquareVeriants}
//               className="relative bg-gray-50 p-8 rounded-lg shadow-lg transition-transform transform hover:scale-105"
//             >
//               <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 flex justify-center items-center w-16 h-16 bg-gray-500 border border-gray-200 rounded-full shadow-md overflow-hidden">
//                 {/* Ubacujemo GIF umesto SVG-a */}
//                 <img
//                   src={BrzoPretrazivanje}
//                   alt="Brzo povezivanje"
//                   className="w-2/3 h-full object-contain"
//                 />
//               </div>
//               <h3 className="text-2xl font-bold text-gray-800 mt-10">
//                 Brzo povezivanje
//               </h3>
//               <p className="text-gray-600 mt-4">
//                 Naša platforma koristi veštačku inteligenciju kako bi pronašla
//                 idealnu uslugu prevoza ili idealnog klijenta za vas.
//               </p>
//             </motion.div>

//             {/* Brza pretraga */}
//             <motion.div
//               variants={gridSquareVeriants}
//               className="relative bg-gray-100 p-8 rounded-lg shadow-lg transition-transform transform hover:scale-105"
//             >
//               <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 flex justify-center items-center w-16 h-16 bg-gray-500 border border-gray-200 rounded-full shadow-md">
//                 <motion.svg
//                   className="w-2/3 stroke-amber-500 stroke-[0.5]"
//                   xmlns="http://www.w3.org/2000/svg"
//                   viewBox="0 0 24 24"
//                 >
//                   <motion.path
//                     d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z"
//                     variants={svgIconVariants}
//                     initial="hidden"
//                     animate="visible"
//                     transition={{
//                       default: {
//                         duration: 2,
//                         ease: "easeInOut",
//                         delay: 1,
//                         repeat: Infinity,
//                         repeatType: "reverse",
//                         repeatDelay: 1,
//                       },
//                       fill: {
//                         duration: 2,
//                         ease: "easeIn",
//                         delay: 2,
//                         repeat: Infinity,
//                         repeatType: "reverse",
//                         repeatDelay: 1,
//                       },
//                     }}
//                   />
//                 </motion.svg>
//               </div>
//               <h3 className="text-2xl font-bold text-gray-800 mt-10">
//                 Brza pretraga
//               </h3>
//               <p className="text-gray-600 mt-4">
//                 Na osnovu vašeg profila mi pronalazimo posao ili prevoz za vas.
//               </p>
//             </motion.div>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-12">
//             {/* Praćenje tura */}
//             <motion.div
//               variants={gridSquareVeriants}
//               className="relative bg-gray-100 p-8 rounded-lg shadow-lg transition-transform transform hover:scale-105"
//             >
//               <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 flex justify-center items-center w-16 h-16 bg-gray-500 border border-gray-200 rounded-full shadow-md overflow-hidden">
//                 {/* Ubacujemo GIF umesto SVG-a */}
//                 <img
//                   src={LokacijaGif}
//                   alt="Praćenje tura"
//                   className="w-2/3 h-full object-contain"
//                 />
//               </div>
//               <h3 className="text-2xl font-bold text-gray-800 mt-10">
//                 Praćenje tura
//               </h3>
//               <p className="text-gray-600 mt-4">
//                 Naša platforma vam omogućava da pratite status svih vaših tura u
//                 realnom vremenu.
//               </p>
//             </motion.div>

//             {/* Ponuda / Potražnja Transporta */}
//             <motion.div
//               variants={gridSquareVeriants}
//               className="relative bg-gray-50 p-8 rounded-lg shadow-lg transition-transform transform hover:scale-105"
//             >
//               <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 flex justify-center items-center w-16 h-16 bg-gray-500 border border-gray-200 rounded-full shadow-md overflow-hidden">
//                 {/* Ubacujemo GIF umesto SVG-a */}
//                 <img
//                   src={Kamion}
//                   alt="Kamion animacija"
//                   className="w-2/3 h-full object-contain"
//                 />
//               </div>
//               <h3 className="text-2xl font-bold text-gray-800 mt-10">
//                 Ponuda / Potražnja Transporta
//               </h3>
//               <p className="text-gray-600 mt-4">
//                 Povezujemo poslodavce i kandidate na jednostavan način, prema
//                 specifičnim potrebama i ponudama.
//               </p>
//             </motion.div>

//             {/* Istorija tura */}
//             <motion.div
//               variants={gridSquareVeriants}
//               className="relative bg-gray-100 p-8 rounded-lg shadow-lg transition-transform transform hover:scale-105"
//             >
//               <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 flex justify-center items-center w-16 h-16 bg-gray-500 border border-gray-200 rounded-full shadow-md overflow-hidden">
//                 {/* Ubacujemo GIF umesto SVG-a */}
//                 <img
//                   src={IstorijaGif}
//                   alt="Istorija tura"
//                   className="w-2/3 h-full object-contain"
//                 />
//               </div>
//               <h3 className="text-2xl font-bold text-gray-800 mt-10">
//                 Istorija tura
//               </h3>
//               <p className="text-gray-600 mt-4">
//                 Pristupite svim prethodnim poslovima, pratite napredak i analize
//                 kroz detaljnu istoriju.
//               </p>
//             </motion.div>
//           </div>
//         </div>
//       </motion.section>
//       <FeaturesSectionMain />
//       <Kontakt />
//     </div>
//   );
// };

// export default Pocetna;
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
import IstorijaGif from "../images/istorijaGif.gif";
import LokacijaGif from "../images/locationGif.gif";
import ClockGif from "../images/clockGif.gif";
import BrzoPretrazivanje from "../images/searchGif.gif";
import { Typewriter } from "react-simple-typewriter";
import FeaturesSectionMain from "@/components/FeaturesSectionMain";
import Oglasi from "@/components/Oglasi";
import Kontakt from "./Kontakt";

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
                TRANSPORTHUB
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
                usluga sa klijentima. Bez komplikacija, samo efikasno
                organizovan transport.
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
              Kako funkcioniše Transporthub?
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
                  <div className="bg-white rounded-xl shadow-md overflow-hidden h-full flex flex-col">
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
                  <div className="bg-white rounded-xl shadow-md overflow-hidden h-full flex flex-col">
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
                  <div className="bg-white rounded-xl shadow-md overflow-hidden h-full flex flex-col">
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
                  <div className="bg-white rounded-xl shadow-md overflow-hidden h-full flex flex-col">
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
              Zašto odabrati Transporthub?
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
            <motion.div
              variants={gridSquareVariants}
              className="bg-gray-50 p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <FaSearch className="text-2xl text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Brzo pronalaženje
              </h3>
              <p className="text-gray-600">
                Pronađite idealne ture ili transportne zahteve u samo nekoliko
                klikova.
              </p>
            </motion.div>

            <motion.div
              variants={gridSquareVariants}
              className="bg-gray-50 p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <FaRoute className="text-2xl text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Upravljanje turama
              </h3>
              <p className="text-gray-600">
                Organizujte i pratite sve svoje ture na jednom mestu.
              </p>
            </motion.div>

            <motion.div
              variants={gridSquareVariants}
              className="bg-gray-50 p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6">
                <FaUsers className="text-2xl text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Široka mreža
              </h3>
              <p className="text-gray-600">
                Povežite se sa pouzdanim prevoznicima i klijentima širom
                regiona.
              </p>
            </motion.div>

            <motion.div
              variants={gridSquareVariants}
              className="bg-gray-50 p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
                <FaShieldAlt className="text-2xl text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Sigurna transakcija
              </h3>
              <p className="text-gray-600">
                Bezbedna platforma sa verifikovanim korisnicima i transparentnim
                uslovima.
              </p>
            </motion.div>

            <motion.div
              variants={gridSquareVariants}
              className="bg-gray-50 p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-6">
                <FaChartLine className="text-2xl text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Analitika i izveštaji
              </h3>
              <p className="text-gray-600">
                Pratite performanse i generišite detaljne izveštaje o vašem
                transportnom poslovanju.
              </p>
            </motion.div>

            <motion.div
              variants={gridSquareVariants}
              className="bg-gray-50 p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-6">
                <FaCheckCircle className="text-2xl text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Jednostavna upotreba
              </h3>
              <p className="text-gray-600">
                Intuitivan interfejs koji omogućava brzo i lako korišćenje bez
                obuke.
              </p>
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
            <div className="bg-white rounded-xl shadow-lg p-6">
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
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
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
            <div className="bg-white rounded-xl shadow-lg p-6">
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
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
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

      <Oglasi />
      <FeaturesSectionMain />
      <Kontakt />
    </div>
  );
};

export default Pocetna;
