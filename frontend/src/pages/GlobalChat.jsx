import React, { useEffect, useState, useRef } from "react";
import {
  FaPaperPlane,
  FaExclamationTriangle,
  FaSmile,
  FaSnowflake,
  FaRoad,
  FaFireAlt,
  FaCarCrash,
} from "react-icons/fa";
import { useGlobalState } from "../helper/globalState";
import { useToast } from "../components/ToastContext";
import { socket } from "../App";
import axios from "axios";

const MAX_LENGTH = 200;

const icons = [
  {
    icon: <FaExclamationTriangle className="text-yellow-500" />,
    label: "Oprez ⚠️",
  },
  { icon: <FaCarCrash className="text-red-500" />, label: "Udes 🚗💥" },
  { icon: <FaRoad className="text-gray-600" />, label: "Radovi na putu 🚧" },
  { icon: <FaSnowflake className="text-blue-400" />, label: "Sneg ❄️" },
  { icon: <FaFireAlt className="text-orange-600" />, label: "Požar 🔥" },
  { icon: <FaSmile className="text-yellow-400" />, label: "😊" },
];

const GlobalChat = () => {
  const [user] = useGlobalState("user");
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const { success, error, warning, info } = useToast();

  useEffect(() => {
    if (!socket) return;
    socket.emit("joinGlobalChat");

    const onHistory = (msgs) => setMessages(msgs || []);
    const onReceive = (msg) =>
      setMessages((prev) => [...prev, msg].slice(-300));

    socket.on("globalChatHistory", onHistory);
    socket.on("receiveGlobalMessage", onReceive);

    return () => {
      socket.off("globalChatHistory", onHistory);
      socket.off("receiveGlobalMessage", onReceive);
    };
  }, []);

  // Scroll samo unutar chata
  useEffect(() => {
    if (messagesContainerRef.current) {
      const el = messagesContainerRef.current;
      requestAnimationFrame(() => {
        el.scrollTop = el.scrollHeight;
      });
    }
  }, [messages]);

  const sendMessage = async () => {
    const text = newMessage.trim();
    if (!text) return;
    if (text.length > MAX_LENGTH) {
      error(`Poruka ne može biti duža od ${MAX_LENGTH} karaktera.`);
      return;
    }
    try {
      const payloadSocket = {
        userId: user?.id || user?._id,
        content: text,
      };
      socket.emit("sendGlobalMessage", payloadSocket);

      setNewMessage("");
    } catch (err) {
      console.warn("Socket emit failed:", err);
    }
    setNewMessage("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const isFromMe = (m) => {
    const uid = user?.id || user?._id;
    if (!uid) return false;
    const mu = m.user?._id || m.user?.id || m.user || m.userId || m.senderId;
    return String(mu) === String(uid);
  };

  const Avatar = ({ u, size = 40 }) => {
    const src = u?.profileImage || u?.avatar;
    if (src)
      return (
        <img
          src={src}
          alt="avatar"
          className="rounded-full object-cover"
          style={{ width: size, height: size }}
        />
      );
    const initial = (u?.name || "K")[0].toUpperCase();
    return (
      <div
        className="bg-gray-400 rounded-full flex items-center justify-center text-white font-semibold"
        style={{ width: size, height: size }}
      >
        {initial}
      </div>
    );
  };
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      error("Geolokacija nije podržana na ovom uređaju.");
      return;
    }

    // Prikaži loader (opcionalno)
    info("Učitavam trenutnu lokaciju...");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;

        const locationLink = `📍 Lokacija (${
          accuracy < 50 ? "tačna" : "približna"
        } ±${Math.round(
          accuracy
        )}m): https://www.google.com/maps?q=${latitude},${longitude}`;

        setNewMessage((prev) => `${prev ? prev + " " : ""}${locationLink}`);
        success("Lokacija uspešno dodata u poruku!");
      },
      (err) => {
        console.error(err);
        switch (err.code) {
          case err.PERMISSION_DENIED:
            warning("Dozvola za lokaciju nije odobrena.");
            break;
          case err.POSITION_UNAVAILABLE:
            warning("Nije moguće dobiti lokaciju uređaja.");
            break;
          case err.TIMEOUT:
            warning("Isteklo vreme za dobijanje lokacije.");
            break;
          default:
            warning("Greška pri dobijanju lokacije.");
        }
      },
      {
        enableHighAccuracy: true, // 🔥 koristi GPS kad je moguće
        timeout: 15000, // do 15s čekanja
        maximumAge: 0, // ne koristi stare podatke
      }
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-4 flex flex-col md:flex-row gap-6">
      {/* Info panel */}
      <div className="hidden md:flex flex-col flex-1 bg-blue-50 rounded-xl p-4 shadow-inner">
        <h2 className="text-xl font-semibold text-blue-800 mb-3">
          🛣️ Informacije o putu
        </h2>
        <p className="text-sm text-gray-700 mb-2">
          Ovde korisnici mogu prijaviti zastoje, radove ili opasnosti na putu.
          Chat je zajednički i svi mogu videti poruke u realnom vremenu.
        </p>
        <ul className="text-sm text-gray-600 list-disc pl-5 space-y-1">
          <li>🚧 Radovi na putu – koristite ako vidite radove</li>
          <li>⚠️ Oprez – ako je gužva ili klizav kolovoz</li>
          <li>🔥 Požar ili dim – odmah prijavite</li>
          <li>❄️ Sneg ili led – upozorite druge</li>
        </ul>
      </div>

      {/* Glavni chat */}
      <div className="flex-[2] bg-white p-3 rounded-xl shadow flex flex-col h-[70vh]">
        <div className="flex items-center justify-between mb-2 border-b pb-2">
          <h2 className="font-bold text-lg text-blue-700 flex items-center gap-2">
            <FaExclamationTriangle className="text-yellow-500" />
            Grupni Chat – Obaveštenja o zastojima na putu
          </h2>
        </div>

        {/* Poruke */}
        <div
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto space-y-3 p-2 bg-gray-50 rounded-md"
        >
          {messages.length === 0 && (
            <div className="text-sm text-gray-500 text-center py-4">
              Još nema poruka. Budite prvi koji će nešto prijaviti!
            </div>
          )}

          {messages.map((m) => {
            // Prepoznaje linkove u tekstu i pretvara ih u klikabilne linkove
            const renderMessageWithLinks = (text) => {
              if (!text) return null;
              const urlRegex = /(https?:\/\/[^\s]+)/g;
              const parts = text.split(urlRegex);
              return parts.map((part, i) => {
                if (part.match(urlRegex)) {
                  return (
                    <a
                      key={i}
                      href={part}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline break-all"
                    >
                      {part}
                    </a>
                  );
                }
                return part;
              });
            };
            const me = isFromMe(m);
            const userObj =
              m.user ||
              m.sender ||
              (m.userId ? { _id: m.userId, name: m.senderName } : null);
            return (
              <div
                key={m._id || m.createdAt}
                className={`flex items-center gap-2 ${
                  me ? "justify-end" : "justify-start"
                }`}
              >
                {!me && <Avatar u={userObj} size={36} />}
                <div
                  className={`relative rounded-lg pl-3 pr-16 py-2 max-w-[75%] leading-snug text-sm ${
                    me
                      ? "bg-[#c8dcff] text-gray-900 ml-auto"
                      : "bg-gray-200 text-gray-900"
                  }`}
                >
                  {/* {!me && (
                    <div className="text-[11px] font-semibold text-gray-700 mb-0.5">
                      {userObj?.name || "Korisnik"}
                    </div>
                  )} */}
                  <div>
                    {renderMessageWithLinks(
                      m.content || m.text || m.message || ""
                    )}
                  </div>
                  <div
                    className="absolute bottom-1 right-2 text-[10px] text-gray-900"
                    style={{ opacity: 0.8 }}
                  >
                    {new Date(m.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
                {me && <Avatar u={user} size={36} />}
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input zona */}
        <div className="mt-2 border-t pt-2 flex items-center gap-2">
          <div className="flex items-center gap-2">
            {icons.map((item, i) => (
              <button
                key={i}
                title={item.label}
                onClick={() => setNewMessage((p) => `${p} ${item.label}`)}
                className="p-1.5 rounded-full hover:bg-gray-100 transition"
              >
                {item.icon}
              </button>
            ))}

            {/* 📍 Dugme za lokaciju */}
            <button
              onClick={getCurrentLocation}
              title="Pošalji trenutnu lokaciju"
              className="p-1.5 rounded-full hover:bg-blue-100 text-blue-600 transition"
            >
              📍
            </button>
          </div>

          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Napiši poruku ili izaberi ikonu..."
            maxLength={MAX_LENGTH}
            className="flex-1 border rounded-full px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
          />
          <button
            onClick={sendMessage}
            className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition"
          >
            <FaPaperPlane size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default GlobalChat;
