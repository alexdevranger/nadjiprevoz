import React, { useState } from "react";
import { motion } from "framer-motion";

const SimpleSteps = () => {
  const createMotionState = () => ({ x: 0, y: 0 });

  const [motionState1, setMotionState1] = useState(createMotionState);
  const [motionState2, setMotionState2] = useState(createMotionState);
  const [motionState3, setMotionState3] = useState(createMotionState);

  const handleMouseMove = (e, setMotionState) => {
    const { clientX, clientY } = e;
    const x = (clientX / window.innerWidth - 0.5) * 0;
    const y = (clientY / window.innerHeight - 0.5) * 10;
    setMotionState({ x, y });
  };

  const handleMouseLeave = (setMotionState) => {
    setMotionState(createMotionState);
  };

  return (
    <div className="bgParalax min-h-screen flex flex-col items-center justify-center cursor-default">
      <h3 className="text-4xl font-extrabold text-gray-800 tracking-tight pt-32">
        Kreiraj profil u 3 koraka
      </h3>
      <h3 className="text-xl font-extrabold text-gray-800 mb-8 tracking-tight pb-8">
        U proseku je potrebno do 2 minuta
      </h3>
      <p className="text-lg text-gray-500 font-semibold max-w-4xl mx-auto mb-12 px-6 text-center">
        Ukoliko imate jedan ili više kamiona ili teretnih vozila ili kompanija
        koja traži usluge prevoza svoje robe, na pravom ste mestu! U 3
        jednostavna koraka možete napraviti profil i pronaći posao već danas! 🚚
      </p>

      <div className="w-full flex flex-col md:flex-row justify-center items-center gap-8 md:gap-12 py-12">
        {[
          {
            step: "1",
            title: "Registracija",
            text: "Prvi korak je da se registrujete ili prijavite. Nakon toga, sistem vas automatski vodi na stranicu za uređivanje profila.",
            state: motionState1,
            setState: setMotionState1,
          },
          {
            step: "2",
            title: "Kreiranje Profila",
            text: "Nakon registracije automatski će se otvoriti stranica na kojoj možeš kreirati svoj profil i ubaciti svoja vozila.",
            state: motionState2,
            setState: setMotionState2,
          },
          {
            step: "3",
            title: "Ponudi usluge",
            text: "Kada dodaš jedno ili više vozila i popuniš sve informacije, tvoj oglas postaje javan klijentima koji traže usluge prevoza.",
            state: motionState3,
            setState: setMotionState3,
          },
        ].map((item, index) => (
          <motion.div
            key={index}
            className="bg-white shadow-lg rounded-lg p-6 w-[350px] border border-gray-200 text-center transition-transform duration-300 hover:shadow-xl"
          >
            <div className="text-5xl font-extrabold text-blue-500 mb-3">
              {item.step}
            </div>
            <h4 className="text-2xl font-bold text-gray-800 mb-3">
              {item.title}
            </h4>
            <p className="text-gray-600">{item.text}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SimpleSteps;
