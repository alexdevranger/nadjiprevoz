import React, { useState } from "react";
import axios from "axios";

export default function AgentChat() {
  // const [open, setOpen] = useState(false);
  // const [pending, setPending] = useState(false);
  // const [messages, setMessages] = useState([
  //   {
  //     role: "agent",
  //     text: "Zdravo! Kako mogu da pomognem oko prevoza? Recite mi polazište, odredište i datum.",
  //   },
  // ]);
  // const [input, setInput] = useState("");
  // const send = async () => {
  //   const text = input.trim();
  //   if (!text) return;
  //   setMessages((m) => [...m, { role: "user", text }]);
  //   setInput("");
  //   setPending(true);
  //   try {
  //     const { data } = await axios.post("/api/agent/message", { text });
  //     if (data?.reply) {
  //       setMessages((m) => [
  //         ...m,
  //         {
  //           role: "agent",
  //           text: data.reply,
  //           parsed: data.parsed,
  //           results: data.results,
  //           route: data.route,
  //         },
  //       ]);
  //     } else {
  //       setMessages((m) => [
  //         ...m,
  //         {
  //           role: "agent",
  //           text: "Izvini, trenutno ne mogu da obradim zahtev.",
  //         },
  //       ]);
  //     }
  //   } catch (e) {
  //     setMessages((m) => [
  //       ...m,
  //       { role: "agent", text: "Došlo je do greške. Pokušaj ponovo." },
  //     ]);
  //   } finally {
  //     setPending(false);
  //   }
  // };
  // const sendMessageToOffers = async () => {
  //   try {
  //     const { data } = await axios.post("/api/offers/message", {
  //       text: "Pozdrav, imamo novu ponudu za transport. Pogledajte detalje u aplikaciji.",
  //     });
  //     alert(data.message || "Poruka je poslata ponudjačima!");
  //   } catch (error) {
  //     console.error(error);
  //     alert("Greška prilikom slanja poruke ponudjačima.");
  //   }
  // };
  // return (
  //   <>
  //     <button
  //       onClick={() => setOpen((o) => !o)}
  //       className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-full shadow"
  //     >
  //       {open ? "Zatvori pomoć" : "Pomoć (AI)"}
  //     </button>
  //     {open && (
  //       <div className="fixed bottom-20 right-4 w-96 bg-white rounded-xl shadow-lg border flex flex-col">
  //         <div className="p-3 border-b font-semibold">Transport asistent</div>
  //         <div className="p-3 space-y-2 h-80 overflow-auto">
  //           {messages.map((m, i) => (
  //             <div key={i} className={m.role === "user" ? "text-right" : ""}>
  //               <div
  //                 className={
  //                   m.role === "user"
  //                     ? "inline-block bg-blue-600 text-white px-3 py-2 rounded-lg"
  //                     : "inline-block bg-gray-100 px-3 py-2 rounded-lg"
  //                 }
  //               >
  //                 {m.text}
  //               </div>
  //               {/* Opcionalno prikaži rezultate koje vrati agent */}
  //               {m.results && m.results.length > 0 && (
  //                 <div className="mt-2 text-sm bg-gray-50 border rounded p-2">
  //                   <div className="font-medium mb-1">Predlozi:</div>
  //                   <ul className="list-disc ml-5">
  //                     {m.results.map((r) => (
  //                       <li key={r.id}>
  //                         <b>{r.carrier}</b> — {r.start?.name} → {r.end?.name}{" "}
  //                         {r.date ? `(${r.date})` : ""} | {r.capacity}
  //                       </li>
  //                     ))}
  //                   </ul>
  //                 </div>
  //               )}
  //             </div>
  //           ))}
  //           {pending && <div className="text-xs text-gray-400">Kucam…</div>}
  //         </div>
  //         <div className="p-2 border-t flex gap-2">
  //           <input
  //             className="flex-1 border rounded px-2 py-2"
  //             placeholder="Npr. Niš do Beograda, četvrtak, 2 palete"
  //             value={input}
  //             onChange={(e) => setInput(e.target.value)}
  //             onKeyDown={(e) => e.key === "Enter" && send()}
  //           />
  //           <button
  //             onClick={send}
  //             className="bg-blue-600 text-white px-4 py-2 rounded"
  //             disabled={pending}
  //           >
  //             Pošalji
  //           </button>
  //           <button
  //             onClick={sendMessageToOffers}
  //             className="bg-green-600 text-white px-4 py-2 rounded"
  //           >
  //             Pošalji poruku ponudjačima
  //           </button>
  //         </div>
  //       </div>
  //     )}
  //   </>
  // );
}
