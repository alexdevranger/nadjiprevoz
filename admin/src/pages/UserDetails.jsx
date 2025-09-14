// // src/pages/UserDetails.jsx
// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import axios from "axios";
// import Header from "../components/Header";
// import moment from "moment";

// export default function UserDetails() {
//   const { id } = useParams(); // ID iz URL-a
//   const [user, setUser] = useState(null);
//   const [tours, setTours] = useState([]);
//   const [shipments, setShipments] = useState([]);
//   const [messages, setMessages] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const token = localStorage.getItem("token");

//         // Učitaj podatke o korisniku
//         const resUser = await axios.get(`/api/admin/users/${id}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         console.log(resUser.data);
//         setUser(resUser.data);

//         // Učitaj ture
//         const resTours = await axios.get(`/api/admin/users/${id}/tours`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         console.log(resTours.data);
//         setTours(resTours.data);

//         // Učitaj shipments
//         const resShipments = await axios.get(
//           `/api/admin/users/${id}/shipments`,
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );
//         console.log(resShipments.data);
//         setShipments(resShipments.data);

//         // Učitaj poruke
//         const resMessages = await axios.get(`/api/admin/users/${id}/messages`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         console.log(resMessages.data);
//         setMessages(resMessages.data);
//       } catch (err) {
//         console.error("Greška prilikom učitavanja podataka", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [id]);

//   if (loading) return <div>Učitavanje...</div>;

//   return (
//     <div className="min-h-screen bg-slate-100">
//       <Header />
//       <main className="p-6">
//         <h2 className="text-2xl font-bold mb-4">Detalji korisnika</h2>

//         {user && (
//           <div className="mb-6 bg-white p-4 rounded shadow">
//             <p>
//               <strong>Ime:</strong> {user.name}
//             </p>
//             <p>
//               <strong>Email:</strong> {user.email}
//             </p>
//             <p>
//               <strong>Uloge:</strong> {user.roles.join(", ")}
//             </p>
//             <p>
//               <strong>Firma:</strong> {user.hasCompany ? user.company : "-"}
//             </p>
//             <p>
//               <strong>Registrovan:</strong>{" "}
//               {moment(user.createdAt).format("DD.MM.YYYY")}
//             </p>
//           </div>
//         )}

//         <section className="mb-6">
//           <h3 className="text-xl font-semibold mb-2">Ture</h3>
//           <ul className="bg-white rounded shadow divide-y">
//             {tours.map((t) => (
//               <li key={t._id} className="p-2">
//                 {t.title} ({moment(t.date).format("DD.MM.YYYY")})
//               </li>
//             ))}
//           </ul>
//         </section>

//         <section className="mb-6">
//           <h3 className="text-xl font-semibold mb-2">Zahtevi (Shipments)</h3>
//           <ul className="bg-white rounded shadow divide-y">
//             {shipments.map((s) => (
//               <li key={s._id} className="p-2">
//                 {s.description} – {s.status}
//               </li>
//             ))}
//           </ul>
//         </section>

//         <section>
//           <h3 className="text-xl font-semibold mb-2">Poruke (Chat)</h3>
//           <ul className="bg-white rounded shadow divide-y">
//             {messages.map((m) => (
//               <li key={m._id} className="p-2">
//                 <strong>{m.senderName}:</strong> {m.text}
//               </li>
//             ))}
//           </ul>
//         </section>
//       </main>
//     </div>
//   );
// }
// src/pages/UserDetails.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import moment from "moment";

export default function UserDetails() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [tours, setTours] = useState([]);
  const [shipments, setShipments] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedConversation, setSelectedConversation] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const resUser = await axios.get(`/api/admin/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(resUser.data);

        const resTours = await axios.get(`/api/admin/users/${id}/tours`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(resTours.data);
        setTours(resTours.data);

        const resShipments = await axios.get(
          `/api/admin/users/${id}/shipments`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log(resShipments.data);
        setShipments(resShipments.data);

        const resMessages = await axios.get(`/api/admin/users/${id}/messages`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(resMessages.data);
        setMessages(resMessages.data);
      } catch (err) {
        console.error("Greška prilikom učitavanja podataka", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // filtrirane i sortirane poruke
  const filteredMessages = (
    selectedConversation
      ? messages.filter((m) => m.conversationId === selectedConversation)
      : messages
  ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  if (loading) return <div>Učitavanje...</div>;

  return (
    <div className="min-h-screen bg-slate-100">
      <Header />
      <main className="p-6">
        <h2 className="text-2xl font-bold mb-4">Detalji korisnika</h2>

        {user && (
          <div className="mb-6 bg-white p-4 rounded shadow">
            <p>
              <strong>Ime:</strong> {user.name}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Uloge:</strong> {user.roles.join(", ")}
            </p>
            <p>
              <strong>Firma:</strong> {user.hasCompany ? user.company : "-"}
            </p>
            <p>
              <strong>Registrovan:</strong>{" "}
              {moment(user.createdAt).format("DD.MM.YYYY")}
            </p>
          </div>
        )}

        {/* Shipments */}
        <section className="mb-6">
          <h3 className="text-xl font-semibold mb-2">📦 Zahtevi (Shipments)</h3>
          <ul className="bg-white rounded shadow divide-y">
            {shipments.map((s) => (
              <li key={s._id} className="p-3">
                <p>
                  <strong>Ruta:</strong> {s.pickupLocation} →{" "}
                  {s.dropoffLocation}
                </p>
                <p>
                  <strong>Datum:</strong> {moment(s.date).format("DD.MM.YYYY")}
                </p>
                <p>
                  <strong>Roba:</strong> {s.goodsType} ({s.weightKg} kg)
                </p>
                <p>
                  <strong>Palete:</strong> {s.pallets}
                </p>
                <p>
                  <strong>Napomena:</strong> {s.note || "-"}
                </p>
                <p>
                  <strong>Telefon:</strong> {s.contactPhone}
                </p>
                <p className="text-sm text-gray-500">
                  Kreiran: {moment(s.createdAt).format("DD.MM.YYYY HH:mm")}
                </p>
              </li>
            ))}
          </ul>
        </section>

        {/* Tours */}
        <section className="mb-6">
          <h3 className="text-xl font-semibold mb-2">🚛 Ture</h3>
          <ul className="bg-white rounded shadow divide-y">
            {tours.map((t) => (
              <li key={t._id} className="p-3">
                <p>
                  <strong>Ruta:</strong> {t.startLocation} → {t.endLocation}
                </p>
                <p>
                  <strong>Datum:</strong> {moment(t.date).format("DD.MM.YYYY")}
                </p>
                <p>
                  <strong>Kontakt:</strong> {t.contactPerson} ({t.contactPhone})
                </p>
                <p>
                  <strong>Napomena:</strong> {t.note || "-"}
                </p>
                <p>
                  <strong>Vozilo:</strong> {t.vehicle?.type} –{" "}
                  {t.vehicle?.capacity} kg -({t.vehicle?.licensePlate})
                </p>
                <p className="text-sm text-gray-500">
                  Kreirano: {moment(t.createdAt).format("DD.MM.YYYY HH:mm")} |
                  Ažurirano: {moment(t.updatedAt).format("DD.MM.YYYY HH:mm")}
                </p>
              </li>
            ))}
          </ul>
        </section>

        {/* Messages */}
        <section>
          <h3 className="text-xl font-semibold mb-2">💬 Poruke (Chat)</h3>
          {selectedConversation && (
            <div className="mb-2">
              <span className="text-sm text-gray-700">
                Filtrirano po konverzaciji:{" "}
                <strong>{selectedConversation}</strong>
              </span>
              <button
                onClick={() => setSelectedConversation(null)}
                className="ml-3 text-blue-600 underline text-sm"
              >
                Resetuj filter
              </button>
            </div>
          )}
          <ul className="bg-white rounded shadow divide-y">
            {filteredMessages.map((m) => (
              <li key={m._id} className="p-3">
                <p className="text-sm text-gray-500">
                  [{moment(m.createdAt).format("DD.MM.YYYY HH:mm")}]{" "}
                  <button
                    onClick={() => setSelectedConversation(m.conversationId)}
                    className="text-blue-600 underline"
                  >
                    Konverzacija: {m.conversationId}
                  </button>
                </p>
                <p>{m.text}</p>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}
