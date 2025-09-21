import React, { useState } from "react";
import { Link } from "react-router-dom";
import ScreenshotOne from "../images/monitor2.png";

const steps = [
  {
    id: 1,
    text: "Jednostavno registrujte se kao prevoznik ili potraživač usluge i započnite saradnju u nekoliko koraka.",
    image: ScreenshotOne,
  },
  {
    id: 2,
    text: "Brzo pretražite dostupne transportne ponude ili klijente prema vašim potrebama.",
    image: ScreenshotOne,
  },
  {
    id: 3,
    text: "Pratite status svih svojih tura u realnom vremenu sa detaljnim informacijama o prevozu.",
    image: ScreenshotOne,
  },
  {
    id: 4,
    text: "Naša platforma omogućava jednostavno povezivanje ponude i potražnje uz AI predloge.",
    image: ScreenshotOne,
  },
  {
    id: 5,
    text: "Analizirajte istoriju svojih tura i pratite napredak u svakom projektu.",
    image: ScreenshotOne,
  },
  {
    id: 6,
    text: "Sigurna i transparentna komunikacija između prevoznika i klijenata direktno kroz aplikaciju.",
    image: ScreenshotOne,
  },
  {
    id: 7,
    text: "Automatska obaveštenja i podsjetnici za sve zakazane ture i prevozne zadatke.",
    image: ScreenshotOne,
  },
];

const IntroSteps = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  return (
    <div className="w-full flex justify-center items-center min-h-screen bg-gray-100 flex-col px-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full p-8 flex flex-col items-center">
        <h2 className="text-2xl md:text-3xl font-bold text-blue-600 mb-6 text-center">
          Korak {steps[currentStep].id}
        </h2>
        <p className="text-gray-700 text-center mb-6">
          {steps[currentStep].text}
        </p>
        <img
          src={steps[currentStep].image}
          alt={`Korak ${steps[currentStep].id}`}
          className="w-full max-w-md rounded-lg mb-6"
        />

        {currentStep < steps.length - 1 ? (
          <button
            onClick={handleNext}
            className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition"
          >
            Dalje
          </button>
        ) : (
          <Link
            to="/dashboard"
            className="px-6 py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition"
          >
            KRENI
          </Link>
        )}

        {/* Indicator */}
        <div className="flex mt-6 space-x-2">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full ${
                index === currentStep ? "bg-blue-500" : "bg-gray-300"
              }`}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IntroSteps;
