import React, { useState } from "react";

// Pricing component styled to match dashboard design
export default function Pricing() {
  const [role, setRole] = useState("prevoznik"); // 'prevoznik' or 'potrazivac'
  const [billing, setBilling] = useState("monthly"); // 'monthly' or 'yearly'

  const plans = {
    prevoznik: [
      {
        id: "free",
        title: "Free",
        priceMonthly: 0,
        priceYearly: 0,
        bullets: [
          "Javni profil vozila",
          "Filteri po karakteristikama vozila",
          "Chat sa potraživačima",
          "Praćenje tura i vozila (osnovno)",
          "Notifikacije",
        ],
      },
      {
        id: "pro",
        title: "Premium",
        priceMonthly: 29,
        priceYearly: 290,
        bullets: [
          "Sve iz Free",
          "AI koji prvo predlaže i kontaktira ture",
          "Priority listing i istaknuti oglasi",
          "Detaljna analitika i izveštaji",
          "API pristup i export podataka",
        ],
      },
    ],
    potrazivac: [
      {
        id: "free",
        title: "Free",
        priceMonthly: 0,
        priceYearly: 0,
        bullets: [
          "Objava potražnje i javan profil",
          "Pretraga i filteri vozila",
          "Chat sa prevoznicima",
          "Izračunata kilometraža (osnovno)",
          "Notifikacije",
        ],
      },
      {
        id: "pro",
        title: "Premium",
        priceMonthly: 19,
        priceYearly: 190,
        bullets: [
          "Sve iz Free",
          "AI asistent koji automatski pronalazi prevoznike",
          "Prioritetno slanje zahteva prevoznicima",
          "Napredno praćenje ture i obaveštenja",
          "Detaljna podrška i SLA",
        ],
      },
    ],
  };

  function formatPrice(plan) {
    const price = billing === "monthly" ? plan.priceMonthly : plan.priceYearly;
    return price === 0
      ? "Free"
      : `${price} € ${billing === "monthly" ? "/mo" : "/yr"}`;
  }

  return (
    <div className="w-2/3 mx-auto p-6 bg-gray-50 dark:bg-mainDarkBG">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-[#0b0c0c] dark:text-white">
          Cenovnik
        </h1>
        <p className="text-gray-600 mt-1">
          Izaberi ulogu i paket koji odgovara tvom poslovanju.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
          <div className="bg-white border rounded-lg shadow-sm p-1 flex items-center w-fit">
            <button
              onClick={() => setRole("prevoznik")}
              className={`px-4 py-2 rounded-md font-medium transition ${
                role === "prevoznik"
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Prevoznici
            </button>
            <button
              onClick={() => setRole("potrazivac")}
              className={`px-4 py-2 rounded-md font-medium transition ${
                role === "potrazivac"
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Potraživaoci
            </button>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-600">
              {billing === "monthly" ? "Mesečno" : "Godišnje"}
            </span>
            <button
              onClick={() =>
                setBilling(billing === "monthly" ? "yearly" : "monthly")
              }
              className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm shadow hover:bg-blue-700 transition"
            >
              {billing === "monthly"
                ? "Prebaci na godišnje"
                : "Prebaci na mesečno"}
            </button>
          </div>
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {plans[role].map((plan) => (
          <div
            key={plan.id}
            className="bg-white border rounded-lg p-6 shadow hover:shadow-md transition"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800">
                {plan.title}
              </h2>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">
                  {formatPrice(plan)}
                </div>
                {plan.id === "pro" && billing === "yearly" && (
                  <div className="text-xs text-green-600">
                    Uštedi{" "}
                    {Math.round(plan.priceMonthly * 12 - plan.priceYearly)} €
                  </div>
                )}
              </div>
            </div>

            <ul className="mt-4 space-y-2 text-gray-700">
              {plan.bullets.map((b, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-1">•</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex items-center justify-between">
              <a className="px-4 py-2 bg-gray-100 border rounded-md text-sm hover:bg-gray-200 transition">
                Detalji
              </a>
              <button
                className={`px-5 py-2 rounded-md font-medium shadow ${
                  plan.id === "free"
                    ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {plan.id === "free" ? "Koristi besplatno" : "Kupi premium"}
              </button>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
