import React, { useState } from "react";
import axios from "axios";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import LocationAutocomplete from "../components/LocationAutocomplete";
import { useGlobalState } from "../helper/globalState";
import { format } from "date-fns";
import DatePicker, { registerLocale } from "react-datepicker";
import srLatin from "../helper/sr-latin";
import { socket } from "../App";
import "react-datepicker/dist/react-datepicker.css";

registerLocale("sr-latin", srLatin);

const vehicles = [
  { id: "kombi", label: "Kombi" },
  { id: "kamion", label: "Kamion" },
  { id: "šleper", label: "Šleper" },
  { id: "Dostavno vozilo", label: "Dostavno vozilo" },
  { id: "Hladnjača", label: "Hladnjača" },
];

export default function Agent() {
  const [token] = useGlobalState("token");
  const [tours, setTours] = useState([]);
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [showWizard, setShowWizard] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "agent",
      text: "Zdravo! Da li hoćeš da ti pomognem da nađeš prevoznike?",
    },
  ]);
  const [input, setInput] = useState("");

  //dodato
  const [includePhone, setIncludePhone] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [contactName, setContactName] = useState("");

  // Wizard form state
  const [startLocation, setStartLocation] = useState("");
  const [endLocation, setEndLocation] = useState("");
  const [date, setDate] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [cargoWeight, setCargoWeight] = useState("");
  const [extraOption, setExtraOption] = useState("");
  const [pallets, setPallets] = useState("");
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");

  const send = async () => {
    const text = input.trim();
    if (!text) return;
    setMessages((m) => [...m, { role: "user", text }]);
    setInput("");
    setPending(true);

    try {
      const { data } = await axios.post("/api/agent/message", { text });
      if (data?.reply) {
        setMessages((m) => [
          ...m,
          {
            role: "agent",
            text: data.reply,
            parsed: data.parsed,
            results: data.results,
            route: data.route,
          },
        ]);
      } else {
        setMessages((m) => [
          ...m,
          {
            role: "agent",
            text: "Izvini, trenutno ne mogu da obradim zahtev.",
          },
        ]);
      }
    } catch (e) {
      setMessages((m) => [
        ...m,
        { role: "agent", text: "Došlo je do greške. Pokušaj ponovo." },
      ]);
    } finally {
      setPending(false);
    }
  };
  const handleSubmit = async () => {
    if (!startLocation || !endLocation || !date || !vehicle) return;

    try {
      const { data } = await axios.post("/api/agent/find-routes", {
        date,
        startLocation,
        endLocation,
        vehicleType: vehicle,
        cargoWeight: cargoWeight ? Number(cargoWeight) : null,
        pallets: extraOption === "pallets" ? Number(pallets) : null,
        dimensions:
          extraOption === "dimensions"
            ? {
                length: Number(length),
                width: Number(width),
                height: Number(height),
              }
            : null,
      });

      console.log(data);

      setMessages((m) => [
        ...m,
        {
          role: "agent",
          text: data.routes?.length
            ? `Pronašao sam ${data.routes.length} odgovarajućih tura.`
            : "Nažalost, nisam pronašao odgovarajuće ture.",
          results: data.routes || [],
          searchParams: {
            date,
            startLocation,
            endLocation,
            vehicle,
            cargoWeight,
            pallets,
            dimensions: { length, width, height },
          },
        },
      ]);
    } catch (err) {
      console.log(err);

      setMessages((m) => [
        ...m,
        { role: "agent", text: "Došlo je do greške pri traženju tura." },
      ]);
    }

    setShowWizard(false);
    setStartLocation("");
    setEndLocation("");
    setDate("");
    setVehicle("");
    setCargoWeight("");
    setPallets("");
    setLength("");
    setWidth("");
    setHeight("");
  };

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-4 right-4 bg-blue-600 text-white px-16 py-5 rounded-full shadow z-50"
      >
        {open ? "Zatvori pomoć" : "Pomoć (AI)"}
      </button>

      {open && (
        <div className="fixed bottom-24 right-4 w-96 bg-white rounded-xl shadow-lg border flex flex-col z-50">
          <div className="p-3 border-b font-semibold">Transport asistent</div>

          <div className="p-3 space-y-2 h-80 overflow-auto">
            {messages.map((m, i) => (
              <div key={i} className={m.role === "user" ? "text-right" : ""}>
                <div
                  className={
                    m.role === "user"
                      ? "inline-block bg-blue-600 text-white px-3 py-2 rounded-lg"
                      : "inline-block bg-gray-100 px-3 py-2 rounded-lg"
                  }
                >
                  {m.text}
                </div>

                {/* Prvo pitanje → Da/Ne */}
                {m.role === "agent" && i === 0 && (
                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={() => setShowWizard(true)}
                      className="bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      Da
                    </button>
                    <button
                      onClick={() => {
                        setMessages((msgs) => [
                          ...msgs,
                          {
                            role: "agent",
                            text: "U redu, javi ako ti zatrebam.",
                          },
                        ]);
                        setTimeout(() => {
                          setOpen(false);
                        }, 3000);
                      }}
                      className="bg-gray-400 text-white px-3 py-1 rounded"
                    >
                      Ne
                    </button>
                  </div>
                )}

                {/* Ako agent vrati rezultate, prikaži ih */}
                {m.results && m.results.length > 0 && (
                  <div className="mt-2 text-sm bg-gray-50 border rounded p-2">
                    <div className="font-medium mb-1">Predlozi:</div>

                    <ul className="list-disc ml-5">
                      {m.results.map((r) => (
                        <li key={r._id} className="mb-3">
                          <div>
                            <b>{r.contactPerson}</b> ({r.contactPhone}) —{" "}
                            {r.startLocation} → {r.endLocation}{" "}
                            {r.date
                              ? format(new Date(r.date), "d. MMMM yyyy", {
                                  locale: srLatin,
                                })
                              : ""}{" "}
                            | Vozilo: {r.vehicle.type} - {r.vehicle.capacity}kg
                          </div>
                          {/* Dodajemo dugmad ispod svakog prevoznika */}
                          <div className="flex gap-2 mt-1">
                            <button
                              onClick={() =>
                                (window.location.href = `tel:${r.contactPhone}`)
                              }
                              className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-xs"
                            >
                              Pozovi
                            </button>
                            <button
                              onClick={() => {
                                const message = `Zdravo, za datum ${
                                  m.searchParams.date
                                    ? format(
                                        new Date(m.searchParams.date),
                                        "d. MMMM yyyy",
                                        { locale: srLatin }
                                      )
                                    : ""
                                } potreban mi je prevoz ${
                                  m.searchParams.cargoWeight
                                } kg robe, vozilo - ${
                                  m.searchParams.vehicle
                                }, na relaciji ${
                                  m.searchParams.startLocation
                                } → ${m.searchParams.endLocation}${
                                  includePhone && phoneNumber
                                    ? `. Možete me kontaktirati na ${phoneNumber}`
                                    : ""
                                }${contactName ? `, ${contactName}` : ""}.`;

                                window.location.href = `sms:${
                                  r.contactPhone
                                }?body=${encodeURIComponent(message)}`;
                              }}
                              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs"
                            >
                              Pošalji SMS
                            </button>
                            <button
                              onClick={async () => {
                                const chatMessage = `Zdravo, za datum ${
                                  m.searchParams.date
                                    ? format(
                                        new Date(m.searchParams.date),
                                        "d. MMMM yyyy",
                                        { locale: srLatin }
                                      )
                                    : ""
                                } potreban mi je prevoz ${
                                  m.searchParams.cargoWeight
                                } kg robe, vozilo - ${
                                  m.searchParams.vehicle
                                }, na relaciji ${
                                  m.searchParams.startLocation
                                } → ${m.searchParams.endLocation}${
                                  includePhone && phoneNumber
                                    ? `. Možete me kontaktirati na ${phoneNumber}`
                                    : ""
                                }${contactName ? `, ${contactName}` : ""}.`;
                                try {
                                  console.log(
                                    "messages",
                                    r.createdBy._id,
                                    r._id
                                  );
                                  await axios.post(
                                    "/api/messages/bulk",
                                    {
                                      messages: [
                                        {
                                          recipientId: r.createdBy._id,
                                          text: chatMessage,
                                          tourId: r._id,
                                        },
                                      ],
                                    },
                                    {
                                      headers: {
                                        Authorization: `Bearer ${token}`,
                                      },
                                    }
                                  );

                                  // Opciono: navigacija na chat
                                  // navigate("/chat");
                                } catch (err) {
                                  console.error(
                                    "Greška pri slanju poruke:",
                                    err
                                  );
                                }
                              }}
                              className="px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600 text-xs"
                            >
                              Pošalji na chat
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>

                    {/* Preview poruke */}
                    <div className="mt-2 text-sm text-gray-600">
                      Da li želiš da pošalješ sledeću poruku svim prevoznicima?
                      <div className="bg-gray-100 border rounded p-2 mt-1">
                        Zdravo, za datum
                        {m.searchParams.date
                          ? format(
                              new Date(m.searchParams.date),
                              "d. MMMM yyyy",
                              {
                                locale: srLatin,
                              }
                            )
                          : ""}{" "}
                        potreban mi je prevoz {m.searchParams.cargoWeight} kg
                        robe, vozilo - {m.searchParams.vehicle}, na relaciji{" "}
                        <strong>
                          {m.searchParams.startLocation} →{" "}
                          {m.searchParams.endLocation}
                        </strong>
                        {includePhone && phoneNumber && (
                          <>. Možete me kontaktirati na {phoneNumber}</>
                        )}{" "}
                        {contactName && <> , {contactName}</>}.
                      </div>
                    </div>
                    {/* Dodatni kontakt podaci */}
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="includePhone"
                          checked={includePhone}
                          onChange={(e) => setIncludePhone(e.target.checked)}
                          className="mr-2"
                        />
                        <label htmlFor="includePhone">
                          Hoću da dodam moj broj telefona u poruku
                        </label>
                      </div>

                      {includePhone && (
                        <div>
                          <input
                            type="tel"
                            placeholder="+381601234567"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            className="w-full border rounded px-2 py-1 mt-1"
                            pattern="\+381\d{9}"
                          />
                          <small className="text-gray-500">
                            Format: +381601234567
                          </small>
                        </div>
                      )}

                      <input
                        type="text"
                        placeholder="Vaše ime (opciono)"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        className="w-full border rounded px-2 py-1"
                      />
                    </div>
                    <div className="mt-4">
                      {/* Dugme za slanje svima odjednom */}
                      <button
                        className="bg-blue-600 text-white px-4 py-2 rounded"
                        onClick={async () => {
                          try {
                            const recipients = m.results.map((r) => {
                              console.log("r", r);
                              console.log("m.searchParams", m.searchParams);

                              return {
                                recipientId: r.createdBy._id,
                                text: `Zdravo, za datum ${
                                  r.date
                                    ? format(new Date(r.date), "d. MMMM yyyy", {
                                        locale: srLatin,
                                      })
                                    : ""
                                } potreban mi je prevoz ${
                                  m.searchParams.cargoWeight || "?"
                                } kg robe, vozilo - ${
                                  m.searchParams.vehicle
                                }, na relaciji ${
                                  m.searchParams.startLocation
                                } → ${m.searchParams.endLocation}. ${
                                  includePhone && phoneNumber
                                    ? ` Možete me kontaktirati na ${phoneNumber}`
                                    : ""
                                }${contactName ? `, ${contactName}` : ""}`,
                                tourId: r._id,
                              };
                            });
                            console.log("Recipients:", recipients);

                            await axios.post(
                              "/api/messages/bulk",
                              { messages: recipients },
                              {
                                headers: { Authorization: `Bearer ${token}` },
                              }
                            );

                            setMessages((msgs) => [
                              ...msgs,
                              {
                                role: "agent",
                                text: "✅ Poruke su uspešno poslate svim prevoznicima.",
                              },
                            ]);
                          } catch (err) {
                            console.error("Greška pri slanju poruka:", err);
                            setMessages((msgs) => [
                              ...msgs,
                              {
                                role: "agent",
                                text: "❌ Došlo je do greške pri slanju poruka.",
                              },
                            ]);
                          }
                        }}
                      >
                        Pošalji poruke svima
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {pending && <div className="text-xs text-gray-400">Kucam…</div>}

            {/* Wizard unutar agenta */}
            {showWizard && (
              <div className="mt-3 border rounded-lg p-3 space-y-2 bg-gray-50">
                <LocationAutocomplete
                  label="Početna destinacija"
                  value={startLocation}
                  onSelect={(val) => {
                    console.log("Start lokacija:", val);
                    setStartLocation(val.address);
                  }}
                />

                <LocationAutocomplete
                  label="Krajnja destinacija"
                  value={endLocation}
                  onSelect={(val) => {
                    console.log("Krajnja lokacija:", val);
                    setEndLocation(val.address);
                  }}
                />

                <DatePicker
                  selected={date}
                  onChange={(d) => setDate(d)}
                  locale="sr-latin"
                  dateFormat="d. MMMM yyyy"
                  placeholderText="Izaberite datum"
                  className="w-full border rounded px-2 py-1 focus:outline-none"
                  required
                />

                {/* TIP VOZILA */}
                <select
                  value={vehicle}
                  onChange={(e) => setVehicle(e.target.value)}
                  className="w-full border rounded px-3 py-2 text-gray-700 focus:outline-none"
                >
                  <option value="">Izaberi vozilo</option>
                  {vehicles.map((v) => (
                    <option key={v.id} value={v.label}>
                      {v.label}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  className="w-full border rounded px-2 py-1 focus:outline-none"
                  placeholder="Težina robe (kg)"
                  value={cargoWeight}
                  onChange={(e) => setCargoWeight(e.target.value)}
                />

                {/* Dodatne opcije pretrage */}
                <select
                  value={extraOption}
                  onChange={(e) => setExtraOption(e.target.value)}
                  className="w-full border rounded px-3 py-2 text-gray-700 focus:outline-none"
                >
                  <option value="">Dodatne opcije pretrage</option>
                  <option value="pallets">Pretraga po broju paleta</option>
                  <option value="dimensions">Pretraga po gabaritima</option>
                </select>

                {/* Ako user izabere broj paleta */}
                {extraOption === "pallets" && (
                  <input
                    type="number"
                    className="w-full border rounded px-2 py-1 mt-2 focus:outline-none"
                    placeholder="Unesi broj paleta"
                    value={pallets}
                    onChange={(e) => setPallets(e.target.value)}
                  />
                )}

                {/* Ako user izabere gabarite */}
                {extraOption === "dimensions" && (
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    <input
                      type="number"
                      className="border rounded px-2 py-1 focus:outline-none"
                      placeholder="Dužina (cm)"
                      value={length}
                      onChange={(e) => setLength(e.target.value)}
                    />
                    <input
                      type="number"
                      className="border rounded px-2 py-1 focus:outline-none"
                      placeholder="Širina (cm)"
                      value={width}
                      onChange={(e) => setWidth(e.target.value)}
                    />
                    <input
                      type="number"
                      className="border rounded px-2 py-1 focus:outline-none"
                      placeholder="Visina (cm)"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                    />
                  </div>
                )}

                <button
                  onClick={handleSubmit}
                  className="w-full bg-blue-600 text-white px-3 py-2 rounded"
                >
                  Potvrdi
                </button>
              </div>
            )}
          </div>

          {/* <div className="p-2 border-t flex gap-2">
            <input
              className="flex-1 border rounded px-2 py-2"
              placeholder="Npr. Niš do Beograda, četvrtak, 2 palete"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
            />
            <button
              onClick={send}
              className="bg-blue-600 text-white px-4 py-2 rounded"
              disabled={pending}
            >
              Pošalji
            </button>
          </div> */}
        </div>
      )}
    </>
  );
}
