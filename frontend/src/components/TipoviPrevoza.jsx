import React from "react";

const transportTypes = [
  {
    name: "Kamion sa ceradom",
    icon: "🚚",
    description: "Fleksibilan za prevoz različitih tereta.",
  },
  {
    name: "Kiperi (Tovarni kamioni)",
    icon: "🚛",
    description: "Pogodni za građevinske materijale i rasuti teret.",
  },
  {
    name: "Hladnjače",
    icon: "🧊",
    description: "Za prevoz robe koja zahteva kontrolisanu temperaturu.",
  },
  {
    name: "Cisterne",
    icon: "🚒",
    description: "Specijalizovani za prevoz tečnosti i gasova.",
  },
  {
    name: "Dostavni kamioni",
    icon: "📦",
    description: "Manji kamioni za brze i efikasne dostave.",
  },
  {
    name: "Specijalni kamioni",
    icon: "🏗️",
    description: "Dizajnirani za prevoz teških i specijalnih tereta.",
  },
];

const TipoviPrevoza = () => {
  return (
    <section className="md:py-32">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold text-gray-800 mb-10 tracking-tight">
          Tipovi Prevoza
        </h2>
        <p className="text-lg text-gray-600 mb-6">
          Odaberite odgovarajući tip prevoza za vaše potrebe.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {transportTypes.map((type, index) => (
            <div
              key={index}
              className="bg-white shadow-lg rounded-2xl p-6 transition duration-300 hover:shadow-xl hover:scale-105 relative group"
            >
              <div className="flex justify-center items-center text-4xl mb-4">
                {type.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-800">
                {type.name}
              </h3>
              <p className="text-gray-600 text-sm mt-2">{type.description}</p>

              {/* Hover efekat */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-80 transition duration-300 flex items-center justify-center rounded-2xl">
                <span className="text-white text-lg font-bold opacity-0 group-hover:opacity-100 transition duration-300">
                  Više detalja
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TipoviPrevoza;
