import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useGlobalState, setGlobalState } from "../helper/globalState";
import { useLocation, useNavigate } from "react-router-dom";
import { MoreVertical } from "lucide-react";
import DatePicker, { registerLocale } from "react-datepicker";
import { format } from "date-fns";
import srLatin from "../helper/sr-latin";
import { socket } from "../App";

registerLocale("sr-latin", srLatin);

export default function DashboardChat() {
  const [token] = useGlobalState("token");
  const [user] = useGlobalState("user");
  const [conversations, setConversations] = useState([]);
  const [activeConv, setActiveConv] = useState(null);
  const activeConvRef = useRef(null); // REF za aktuelnu konverzaciju
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const { state } = useLocation();
  const navigate = useNavigate();
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    conversation: null,
  });
  const contextMenuRef = useRef();
  const [dropdownMenu, setDropdownMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
  });
  const dropdownMenuRef = useRef();

  const handleMarkAllAsRead = async () => {
    try {
      // Optimističko ažuriranje UI-a
      setConversations((prev) =>
        prev.map((conv) => ({
          ...conv,
          unread: {
            ...conv.unread,
            [user.id]: 0,
          },
        }))
      );

      // Pošalji zahtev za svaku konverzaciju
      conversations.forEach((conv) => {
        if (conv.unread?.[user.id] > 0) {
          socket?.emit("markRead", {
            conversationId: conv._id,
            userId: user.id,
          });
        }
      });

      handleCloseDropdownMenu();
    } catch (error) {
      console.error("Greška pri označavanju svih kao pročitano:", error);
    }
  };

  // Funkcije za otvaranje/zatvaranje dropdown menija
  const handleDropdownMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDropdownMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
    });
  };

  const handleCloseDropdownMenu = () => {
    setDropdownMenu({ visible: false, x: 0, y: 0 });
  };

  // Funkcije za kontekstni meni
  const handleContextMenu = (e, conversation) => {
    e.preventDefault();
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      conversation: conversation,
    });
  };

  const handleCloseContextMenu = () => {
    setContextMenu({ visible: false, x: 0, y: 0, conversation: null });
  };

  const handleMarkAsRead = async (conversation) => {
    if (!conversation) return;

    try {
      socket?.emit("markRead", {
        conversationId: conversation._id,
        userId: user.id,
      });

      setConversations((prev) =>
        prev.map((c) =>
          c._id === conversation._id
            ? {
                ...c,
                unread: {
                  ...c.unread,
                  [user.id]: 0,
                },
              }
            : c
        )
      );

      handleCloseContextMenu();
    } catch (error) {
      console.error("Greška pri označavanju kao pročitano:", error);
    }
  };

  // Efekt za zatvaranje kontekstnog menija
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        contextMenuRef.current &&
        !contextMenuRef.current.contains(e.target)
      ) {
        handleCloseContextMenu();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Efekt za zatvaranje dropdown menija kada se klikne negde drugde
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownMenuRef.current &&
        !dropdownMenuRef.current.contains(e.target)
      ) {
        handleCloseDropdownMenu();
      }
    };

    if (dropdownMenu.visible) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownMenu.visible]);

  // --- Socket listeners: registruj jednom (prazan deps)
  useEffect(() => {
    // handleri su ovde deklarisani pa možemo sigurno skinuti istu funkciju u cleanup
    const onNewMessage = (msg) => {
      // Ako je poruka za otvorenu konverzaciju - append
      if (
        activeConvRef.current &&
        msg.conversationId === activeConvRef.current._id
      ) {
        setMessages((m) => [...m, msg]);
      }
    };

    const onConversationUpdated = (conv) => {
      setConversations((prev) => {
        const idx = prev.findIndex((c) => c._id === conv._id);
        if (idx === -1) return [conv, ...prev];
        const copy = [...prev];
        copy.splice(idx, 1);
        return [conv, ...copy];
      });
      // ako je ovo otvorena konverzacija, update-uj i activeConv/ref
      if (activeConvRef.current && activeConvRef.current._id === conv._id) {
        setActiveConv(conv);
        activeConvRef.current = conv;
      }
    };

    socket.on("newMessage", onNewMessage);
    socket.on("conversationUpdated", onConversationUpdated);

    return () => {
      // skini TAČNO iste handler-e da se ne dupliraju
      socket.off("newMessage", onNewMessage);
      socket.off("conversationUpdated", onConversationUpdated);
    };
  }, []);

  useEffect(() => {
    // Izračunaj ukupan broj nepročitanih poruka
    if (!user || !conversations) return;
    const totalUnread = conversations.reduce((total, conv) => {
      return total + (conv.unread?.[user.id] || 0);
    }, 0);

    // Ažuriraj globalno stanje
    setGlobalState("totalUnread", totalUnread);
  }, [conversations, user]);

  // --- Load conversations (isti kao pre)
  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          error("Sesija je istekla. Molimo prijavite se ponovo.");
          return;
        }
        const res = await axios.get("/api/conversations", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const allConvs = Array.isArray(res.data) ? res.data : [];

        const totalUnread = allConvs.reduce((total, conv) => {
          return total + (conv.unread?.[user.id] || 0);
        }, 0);
        setGlobalState("totalUnread", totalUnread);

        // uvek postavi sve konverzacije u state
        setConversations(allConvs);

        // ako je prosleđen conversationId iz navigate (npr. "Pošalji poruku" sa ture)
        if (state?.conversationId) {
          // pronađi tu konverzaciju
          const c = res.data.find((x) => x._id === state.conversationId);
          if (c && c._id) {
            // setConversations([c]); // prikaži samo tu sobu
            openConversation(c);
          } else {
            const resp = await axios.get(
              `/api/conversations?conversationId=${state.conversationId}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            if (resp.data && resp.data._id) {
              setConversations((prev) =>
                prev.some((p) => p._id === resp.data._id)
                  ? prev
                  : [resp.data, ...prev]
              );
              openConversation(resp.data);
            }
          }
        } else if (state?.tourId) {
          // filtriraj sve konverzacije te ture
          const related = allConvs.filter((c) => {
            console.log(c);
            const tid = c.tourId?._id;
            return tid && String(tid) === String(state.tourId);
          });

          // sve ostale
          const others = allConvs.filter((c) => {
            const tid = c.tour?._id || c.tourId?._id || c.tourId;
            return !(tid && String(tid) === String(state.tourId));
          });

          // spoji: prvo sve te ture, pa ostale
          setConversations([...related, ...others]);
        } else if (state?.jobId) {
          const related = allConvs.filter((c) => {
            const jid = c.jobId?._id;
            return jid && String(jid) === String(state.jobId);
          });

          const others = allConvs.filter((c) => {
            const jid = c.jobId?._id || c.jobId;
            return !(jid && String(jid) === String(state.jobId));
          });

          setConversations([...related, ...others]);
        } else {
          // nema prosleđenog ID-ja → prikaži sve postojeće
          setConversations(allConvs);
        }
      } catch (err) {
        console.error("Greška pri učitavanju razgovora:", err);
      }
    };
    if (token) load();
  }, [token, state]); // može ostati token + state

  const openConversation = async (conv) => {
    setActiveConv(conv);
    activeConvRef.current = conv;

    // Optimističko ažuriranje lokalnog state-a
    setConversations((prev) =>
      prev.map((c) =>
        c._id === conv._id ? { ...c, unread: { ...c.unread, [user.id]: 0 } } : c
      )
    );

    // Ažuriraj GLOBALNI broj nepročitanih
    const newTotalUnread = conversations.reduce((total, c) => {
      if (c._id === conv._id) {
        return total; // Ova konverzacija će biti 0
      }
      return total + (c.unread?.[user.id] || 0);
    }, 0);

    setGlobalState("totalUnread", newTotalUnread);

    // Ostali kod ostaje isti...
    socket?.emit("markRead", {
      conversationId: conv._id,
      userId: user.id,
    });

    socket?.emit("joinRoom", conv._id);

    try {
      const res = await axios.get(`/api/messages/${conv._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Greška pri učitavanju poruka:", err);
      setMessages([]);
    }
  };

  useEffect(() => {
    if (activeConv) {
      console.log(
        "Setting active conversation ID in localStorage:",
        activeConv._id
      );
      localStorage.setItem("activeConvId", activeConv._id);
    }
    return () => {
      localStorage.removeItem("activeConvId");
    };
  }, [activeConv]);

  // --- sendMessage: samo emituj, ne appenduj odmah (izbegavamo dupliranje)
  const sendMessage = () => {
    if (!text.trim() || !activeConv) return;

    const payload = {
      conversationId: activeConv._id,
      senderId: user.id,
      text: text.trim(),
    };

    socket.emit("sendMessage", payload);

    setText("");
  };

  useEffect(() => {
    // Kada se konverzacije učitaju, ažuriraj globalni broj nepročitanih
    if (conversations.length > 0) {
      const totalUnread = conversations.reduce((total, conv) => {
        return total + (conv.unread?.[user.id] || 0);
      }, 0);
      setGlobalState("totalUnread", totalUnread);
    }
  }, [conversations]);

  return (
    <div className="max-w-6xl mx-auto p-4 flex gap-6">
      <aside className="w-80 bg-white p-3 rounded shadow h-[70vh] overflow-auto relative">
        {/* NASLOV SA IKONOM */}
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-semibold">Razgovori</h2>
          <button
            onClick={handleDropdownMenu}
            className="p-1 rounded hover:bg-gray-100 transition-colors"
            title="Opcije"
          >
            <MoreVertical size={20} />
          </button>
        </div>

        {conversations.map((c) => {
          // console.log("c", c);
          const other = Array.isArray(c.participants)
            ? c.participants.find((p) => p._id !== user.id)
            : null;
          // console.log("other", other);
          const unread = c.unread?.[user.id] || 0;

          // Formatiranje datuma
          const formatMessageDate = (dateString) => {
            if (!dateString) return "";

            const messageDate = new Date(dateString);
            const today = new Date();
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);

            // Provera da li je danas
            if (messageDate.toDateString() === today.toDateString()) {
              return `danas, ${format(messageDate, "HH:mm")}`;
            }

            // Provera da li je juče
            if (messageDate.toDateString() === yesterday.toDateString()) {
              return `juče, ${format(messageDate, "HH:mm")}`;
            }

            // Stariji datumi
            return format(messageDate, "d. MMMM yyyy, HH:mm", {
              locale: srLatin,
            });
          };

          return (
            <div
              key={c._id}
              onClick={() => openConversation(c)}
              onContextMenu={(e) => handleContextMenu(e, c)}
              className={`p-2 rounded cursor-pointer mb-2 border-b border-blue-200 ${
                activeConv?._id === c._id ? "bg-blue-50" : ""
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="font-semibold">
                    {other?.name || other?.company || "Korisnik"}
                  </div>

                  <div className="text-sm text-gray-500 mt-1">
                    {c.tourId
                      ? `${c.tourId.startLocation} → ${
                          c.tourId.endLocation || "Bilo gde"
                        }`
                      : c.shipmentId
                      ? `${c.shipmentId.pickupLocation} → ${
                          c.shipmentId.dropoffLocation || "Bilo gde"
                        }`
                      : c.jobId
                      ? `Posao: ${
                          c.jobId.position ||
                          c.jobId.title ||
                          "Nepoznato radno mesto"
                        }`
                      : "Razgovor"}
                  </div>
                  {/* {c.jobId && (
                    <>
                      <div className="text-sm text-gray-700">
                        Posao: {c.jobId.title || "Nepoznat"}
                      </div>
                      {c.jobId?.slug && (
                        <div
                          className="text-xs text-blue-600 hover:underline cursor-pointer mt-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/poslovi/${c.jobId.slug}`);
                          }}
                        >
                          Otvori oglas
                        </div>
                      )}
                    </>
                  )} */}

                  <div className="text-sm text-gray-600 mt-1">
                    {c.lastMessage?.text
                      ? `${c.lastMessage.text.slice(0, 40)}${
                          c.lastMessage.text.length > 40 ? "…" : ""
                        }`
                      : "—"}
                  </div>
                </div>

                <div className="flex flex-col items-end">
                  <span className="text-xs text-gray-500 mb-1">
                    {c.lastMessage?.createdAt
                      ? formatMessageDate(c.lastMessage.createdAt)
                      : ""}
                  </span>

                  {unread > 0 && (
                    <div
                      className="bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full cursor-pointer hover:bg-red-600"
                      onClick={(e) => {
                        e.stopPropagation(); // Sprečava otvaranje konverzacije
                        handleMarkAsRead(c);
                      }}
                      onContextMenu={(e) => {
                        e.stopPropagation(); // Sprečava prikaz kontekstnog menija za celu konverzaciju
                        handleContextMenu(e, c);
                      }}
                    >
                      {unread}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </aside>
      <section className="flex-1 bg-white p-3 rounded shadow h-[70vh] flex flex-col">
        {activeConv ? (
          <>
            {/* Lista poruka */}

            <div
              className="flex-1 overflow-auto mb-3 space-y-3 p-4"
              ref={(el) => {
                if (el) {
                  el.scrollTop = el.scrollHeight; // Auto-scroll na dno
                }
              }}
            >
              {messages.map((m, i) => {
                const mine =
                  m.senderId === user.id ||
                  m.senderId === (user._id || user.id);
                return (
                  <div
                    key={i}
                    className={`flex ${mine ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[70%] ${mine ? "ml-auto" : "mr-auto"}`}
                    >
                      <div
                        className={`inline-block p-3 rounded-2xl ${
                          mine
                            ? "bg-blue-500 text-white rounded-br-none"
                            : "bg-gray-200 text-gray-800 rounded-bl-none"
                        }`}
                      >
                        {m.text}
                      </div>
                      <div
                        className={`text-xs text-gray-400 mt-1 ${
                          mine ? "text-right" : "text-left"
                        }`}
                      >
                        {format(new Date(m.createdAt), "HH:mm", {
                          locale: srLatin,
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Input za poruke */}
            <div className="flex gap-2">
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="flex-1 border p-2 rounded"
                placeholder="Napiši poruku..."
                onKeyDown={(e) => {
                  if (e.key === "Enter") sendMessage();
                }}
              />
              <button
                onClick={sendMessage}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Pošalji
              </button>
            </div>
          </>
        ) : (
          <div className="text-center text-gray-500">
            Izaberi razgovor sa leve strane ili klikni "Pošalji poruku" na
            ponudi
          </div>
        )}
      </section>
      {/* KONTEKSTNI MENI - DODAJTE OVDE */}
      {contextMenu.visible && (
        <div
          ref={contextMenuRef}
          className="fixed bg-white border border-gray-200 rounded shadow-lg z-50 py-1"
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
          <div
            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            onClick={() => handleMarkAsRead(contextMenu.conversation)}
          >
            Označi kao pročitano
          </div>
          <div
            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            onClick={handleCloseContextMenu}
          >
            Zatvori
          </div>
        </div>
      )}
      {/* DROPDOWN MENI ZA SVE PORUKE */}
      {dropdownMenu.visible && (
        <div
          ref={dropdownMenuRef}
          className="fixed bg-white border border-gray-200 rounded shadow-lg z-50 py-1"
          style={{ top: dropdownMenu.y, left: dropdownMenu.x }}
        >
          <div
            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            onClick={handleMarkAllAsRead}
          >
            Označi sve kao pročitano
          </div>
          <div
            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            onClick={handleCloseDropdownMenu}
          >
            Zatvori
          </div>
        </div>
      )}
    </div>
  );
}
