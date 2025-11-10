import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

const sections = [
  {
    title: "Opšta pitanja",
    faqs: [
      {
        question: "Kako funkcioniše aplikacija Nađi Prevoz?",
        answer:
          "Aplikacija povezuje vozače i korisnike koji traže prevoz. Vozači mogu dodavati ture, dok korisnici mogu slati zahteve za transport ili rezervisati dostupne ture.",
      },
      {
        question: "Da li mogu koristiti aplikaciju na telefonu?",
        answer:
          "Da, aplikacija je potpuno prilagođena mobilnim uređajima i možete je koristiti kroz bilo koji internet pregledač.",
      },
      {
        question: "Da li moram da registrujem nalog?",
        answer:
          "Da, registracija je neophodna kako biste mogli da kreirate ture, dodajete vozila ili šaljete zahteve za prevoz. Registracija je besplatna i traje svega nekoliko sekundi.",
      },
    ],
  },
  {
    title: "Pitanja za prevoznike (fizička lica i firme)",
    faqs: [
      {
        question: "Kako da dodam svoje vozilo?",
        answer:
          "U svom korisničkom panelu izaberite opciju 'Dodaj vozilo'. Popunite podatke o vozilu, dodajte slike i vozilo će se automatski dodati na listu vaših vozila. Nakon toga možete objaviti svoju prvu turu.",
      },
      {
        question: "Kako da napravim novu turu?",
        answer:
          "U sekciji 'Dodaj turu' unesite destinaciju, datum polaska, raspoloživa mesta i cenu. Nakon što je objavite, svi korisnici će je videti i moći će poslati zahtev za prevoz.",
      },
      {
        question: "Da li mogu registrovati firmu?",
        answer:
          "Da, aplikacija podržava i pravna lica. Kao firma možete dodavati više vozila, vozača i koristiti napredne funkcije praćenja i analitike.",
      },
      {
        question: "Kako funkcioniše sistem ocenjivanja?",
        answer:
          "Nakon svake završene ture, putnici mogu oceniti vozača i obrnuto. Ocene su vidljive svima i doprinose većem poverenju i profesionalnosti.",
      },
    ],
  },
  {
    title: "Pitanja za korisnike",
    faqs: [
      {
        question: "Kako da pošaljem zahtev za prevoz?",
        answer:
          "U sekciji 'Dodaj zahtev' unesite početnu i krajnju tačku, datum i sve potrebne detalje. Prevoznici će moći da odgovore na vaš zahtev ponudom.",
      },
      {
        question: "Mogu li da otkažem zahtev?",
        answer:
          "Da, zahtev možete otkazati u bilo kom trenutku dok nije prihvaćen. Nakon prihvatanja, potrebno je kontaktirati vozača putem chata.",
      },
      {
        question: "Kako se naplaćuje prevoz?",
        answer:
          "Aplikacija ne naplaćuje automatski. Plaćanje se vrši direktno između korisnika i prevoznika, prema dogovoru postignutom putem aplikacije ili direktnim pozivom sa klijentom.",
      },
    ],
  },
  {
    title: "Veštačka inteligencija (AI) + Notifikacije",
    faqs: [
      {
        question: "Kako AI pomoć može da mi pomogne?",
        answer:
          "Na dnu stranice nalazi se opcija 'Pomoć (AI)' koja vas povezuje sa našim AI asistentom.. AI asistent vam može pomoći u pronalaženju zahteva ili tura, automatsko pisanju poruka i kontaktiranje. U nekoliko klikova ce dobiti listu svih prevoznika ili korisnika kojima treba prevoz sa opcijom da AI automatski posalje poruku vezanu za bas tu turu",
      },
      {
        question: "Kakve sve notifikacije dobijam?",
        answer:
          "U zavisnosti od paketa. Free verzija dobija notifikaciju za chat, pro dobija informacije kada se objavi neki oglas koji njemu odgovara ",
      },
      {
        question: "Šta ako mi se javi tehnički problem?",
        answer:
          "Ako primetite grešku u radu aplikacije, prijavite je putem AI asistenta ili kontakt forme. Naš tim će odgovoriti u najkraćem mogućem roku.",
      },
    ],
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (sectionIndex, faqIndex) => {
    const id = `${sectionIndex}-${faqIndex}`;
    setOpenIndex(openIndex === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-mainDarkBG py-16 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-4xl font-bold text-center text-gray-800 dark:text-gray-100 mb-12"
        >
          Često postavljana pitanja (FAQ)
        </motion.h1>

        {sections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="mb-12">
            <h2 className="text-2xl font-semibold text-blue-600 mb-6 border-l-4 border-blue-500 pl-3">
              {section.title}
            </h2>

            <div className="space-y-4">
              {section.faqs.map((faq, faqIndex) => {
                const id = `${sectionIndex}-${faqIndex}`;
                const isOpen = openIndex === id;
                return (
                  <motion.div
                    key={id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: faqIndex * 0.05 }}
                    className="bg-white dark:bg-mainDarkBG rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-white"
                  >
                    <button
                      onClick={() => toggleFAQ(sectionIndex, faqIndex)}
                      className="w-full flex justify-between items-center p-5 text-left focus:outline-none"
                    >
                      <span className="text-lg font-medium text-gray-800 dark:text-white">
                        {faq.question}
                      </span>
                      <ChevronDown
                        className={`w-5 h-5 text-gray-500 dark:text-gray-100 transform transition-transform duration-300 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    <motion.div
                      initial={false}
                      animate={{
                        maxHeight: isOpen ? 300 : 0,
                        opacity: isOpen ? 1 : 0,
                      }}
                      transition={{
                        duration: 0.35,
                        ease: [0.4, 0, 0.2, 1],
                      }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 text-gray-600 dark:text-gray-200 text-base leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}

        <div className="text-center mt-16">
          <p className="text-gray-600 mb-4 dark:text-white">
            Niste pronašli odgovor na svoje pitanje?
          </p>
          <button className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-full shadow hover:bg-blue-700 transition-all">
            Kontaktiraj našu podršku
          </button>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
