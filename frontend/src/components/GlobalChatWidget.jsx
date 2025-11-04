import React, { useEffect, useState, useRef } from "react";
import { Rnd } from "react-rnd";
import { FaComments, FaTimes, FaPaperPlane } from "react-icons/fa";
import { useToast } from "../components/ToastContext";
import { useGlobalState } from "../helper/globalState";
import { socket } from "../App";

const MAX_COLLAPSED = 4;
const MAX_LENGTH = 100;

const GlobalChatWidget = () => {
  const [user] = useGlobalState("user");
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [open, setOpen] = useState(true);
  const [miniOpen, setMiniOpen] = useState(false);
  const [hasNotification, setHasNotification] = useState(false);
  const { success, error, warning, info } = useToast();
  const [position, setPosition] = useState({
    x: typeof window !== "undefined" ? window.innerWidth - 350 - 48 - 300 : 100,
    y: 48,
  });
  const [size, setSize] = useState({ width: 350, height: 500 });
  const [isHovering, setIsHovering] = useState(false);

  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  // Socket effects
  useEffect(() => {
    if (!socket) return;

    socket.emit("joinGlobalChat");

    const onHistory = (msgs) => {
      setMessages(msgs || []);
    };

    const onReceive = (msg) => {
      setMessages((prev) => {
        const next = [...prev, msg];
        return next.slice(-200);
      });

      // Postavi notifikaciju samo ako je chat zatvoren
      // if (!open && !miniOpen) {
      //   setHasNotification(true);
      // }
    };

    socket.on("globalChatHistory", onHistory);
    socket.on("receiveGlobalMessage", onReceive);

    return () => {
      socket.off("globalChatHistory", onHistory);
      socket.off("receiveGlobalMessage", onReceive);
    };
  }, [open, miniOpen]);

  // Auto-scroll to bottom
  useEffect(() => {
    if ((open || miniOpen) && messagesContainerRef.current) {
      const el = messagesContainerRef.current;
      // Koristimo requestAnimationFrame za glatko skrolovanje
      requestAnimationFrame(() => {
        el.scrollTop = el.scrollHeight;
      });
    }
  }, [messages, open, miniOpen]);

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
      socket?.emit("sendGlobalMessage", payloadSocket);

      setNewMessage("");
    } catch (err) {
      console.warn("Socket emit failed:", err);
    }

    setNewMessage("");
    setHasNotification(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      e.stopPropagation();
      sendMessage();
    }
  };

  const handleSendClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    sendMessage();
  };

  const Avatar = ({ u, size = 32 }) => {
    const src = u?.profileImage || u?.profileImageUrl || u?.avatar;
    if (src) {
      return (
        <img
          src={src}
          alt={u?.name || "User"}
          className="rounded-full object-cover"
          style={{ width: size, height: size }}
        />
      );
    }
    const initial = (u?.name || u?.company || "K")[0]?.toUpperCase();
    return (
      <div
        className="rounded-full bg-gray-400 flex items-center justify-center text-white font-semibold"
        style={{ width: size, height: size }}
      >
        {initial}
      </div>
    );
  };

  const lastMessages = messages.slice(-MAX_COLLAPSED);

  const isFromMe = (m) => {
    const uid = user?.id || user?._id;
    if (!uid) return false;
    if (m.user) {
      const mu = m.user._id || m.user.id || m.user;
      return String(mu) === String(uid);
    }
    if (m.senderId) return String(m.senderId) === String(uid);
    if (m.userId) return String(m.userId) === String(uid);
    return false;
  };

  const handleOpenChat = () => {
    setOpen(true);
    setHasNotification(false); // Reset notifikacije kada se otvori chat
  };

  const handleCloseChat = () => {
    setOpen(false);
    setMiniOpen(false);
  };

  const getDimensions = () => {
    if (!open && !miniOpen) {
      return { width: 56, height: 56 };
    } else if (miniOpen && !open) {
      return { width: 300, height: 200 };
    } else {
      return size;
    }
  };

  const dimensions = getDimensions();

  return (
    <Rnd
      size={{ width: dimensions.width, height: dimensions.height }}
      position={{ x: position.x, y: position.y }}
      onDragStop={(e, d) => {
        e.preventDefault();
        e.stopPropagation();

        const maxX = window.innerWidth - dimensions.width - 20;
        const maxY = window.innerHeight - dimensions.height - 20;

        const boundedX = Math.max(20, Math.min(d.x, maxX));
        const boundedY = Math.max(20, Math.min(d.y, maxY));

        setPosition({ x: boundedX, y: boundedY });
      }}
      onResizeStop={(e, direction, ref, delta, newPosition) => {
        e.preventDefault();
        e.stopPropagation();

        if (open) {
          const newWidth = Math.min(
            parseInt(ref.style.width),
            window.innerWidth - 40
          );
          const newHeight = Math.min(
            parseInt(ref.style.height),
            window.innerHeight - 40
          );

          setSize({
            width: newWidth,
            height: newHeight,
          });
        }

        const currentWidth = open
          ? parseInt(ref.style.width)
          : dimensions.width;
        const currentHeight = open
          ? parseInt(ref.style.height)
          : dimensions.height;
        const maxX = window.innerWidth - currentWidth - 20;
        const maxY = window.innerHeight - currentHeight - 20;

        const boundedX = Math.max(20, Math.min(newPosition.x, maxX));
        const boundedY = Math.max(20, Math.min(newPosition.y, maxY));

        setPosition({ x: boundedX, y: boundedY });
      }}
      enableResizing={
        open
          ? {
              top: true,
              right: true,
              bottom: true,
              left: true,
              topRight: true,
              bottomRight: true,
              bottomLeft: true,
              topLeft: true,
            }
          : false
      }
      minWidth={open ? 300 : dimensions.width}
      minHeight={open ? 400 : dimensions.height}
      maxWidth={Math.min(500, window.innerWidth - 60)}
      maxHeight={Math.min(700, window.innerHeight - 60)}
      disableDragging={false}
      className="z-50 fixed"
    >
      <div
        className="h-full w-full"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {/* FULL panel - BEZ ANIMACIJA */}
        {open && (
          <div className="bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden h-full">
            <div
              className="flex items-center justify-between px-3 py-2 bg-blue-600 text-white cursor-move"
              style={{ cursor: "move" }}
            >
              <div className="flex items-center gap-2">
                <FaComments />
                <span className="font-semibold text-sm">Global Chat</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  className="p-1 rounded hover:bg-blue-500/30 transition-colors"
                  onClick={handleCloseChat}
                  title="Zatvori"
                >
                  <FaTimes />
                </button>
              </div>
            </div>

            <div
              ref={messagesContainerRef}
              className="flex-1 overflow-auto p-2 space-y-2 bg-gray-50"
              style={{ overflowY: "auto" }}
            >
              {messages.length === 0 && (
                <div className="text-xs text-gray-500 text-center py-4">
                  Još nema poruka. Budite prvi koji će poslati poruku!
                </div>
              )}
              {messages.map((m) => {
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
                    {!me && <Avatar u={userObj} size={28} />}
                    <div
                      className={`relative rounded-lg pl-3 pr-16 py-2 max-w-[80%] text-sm leading-snug break-words ${
                        me
                          ? "bg-[#c8dcff] text-gray-900 ml-auto"
                          : "bg-gray-200 text-gray-900"
                      }`}
                    >
                      <div>{m.content || m.text || m.message || ""}</div>
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
                    {me && <Avatar u={user} size={28} />}
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-2 border-t bg-white flex gap-2 items-center">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Napiši poruku..."
                maxLength={MAX_LENGTH}
                className="flex-1 border rounded-full px-3 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-400"
              />
              <button
                onClick={handleSendClick}
                className="bg-blue-600 text-white p-1.5 rounded-full hover:bg-blue-700 transition-colors"
              >
                <FaPaperPlane size={12} />
              </button>
            </div>
          </div>
        )}

        {/* MINI expanded - BEZ ANIMACIJA */}
        {miniOpen && !open && (
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden h-full flex flex-col">
            <div
              className="flex items-center justify-between px-3 py-2 bg-blue-600 text-white cursor-move"
              style={{ cursor: "move" }}
            >
              <div className="flex items-center gap-2">
                <FaComments />
                <span className="font-semibold text-sm">Global Chat</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  className="p-1 rounded hover:bg-blue-500/30 transition-colors"
                  onClick={() => setMiniOpen(false)}
                  title="Zatvori"
                >
                  <FaTimes size={12} />
                </button>
              </div>
            </div>

            <div
              ref={messagesContainerRef}
              className="flex-1 p-2 space-y-1 overflow-auto bg-gray-50"
            >
              {lastMessages.length === 0 && (
                <div className="text-xs text-gray-500 text-center">
                  Još nema poruka
                </div>
              )}
              {lastMessages.map((m) => {
                const me = isFromMe(m);
                const userObj =
                  m.user ||
                  m.sender ||
                  m.senderObj ||
                  (m.userId ? { _id: m.userId, name: m.senderName } : null);
                return (
                  <div
                    key={m._id || m.createdAt}
                    className={`flex items-start gap-1 ${
                      me ? "justify-end" : ""
                    }`}
                  >
                    {!me && <Avatar u={userObj} size={20} />}
                    <div
                      className={`px-1.5 py-1 rounded-md text-xs max-w-[85%] break-words ${
                        me
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 text-gray-800"
                      }`}
                    >
                      <div className="text-[10px] font-semibold mb-0.5">
                        {userObj?.name ||
                          userObj?.company ||
                          (me ? user?.name || user?.company : "Korisnik")}
                      </div>
                      <div className="leading-tight">
                        {(m.content || m.text || m.message || "").slice(0, 80)}
                      </div>
                    </div>
                    {me && <Avatar u={user} size={20} />}
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-1 border-t bg-white flex items-center gap-1">
              <input
                type="text"
                placeholder="Napiši poruku..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                maxLength={MAX_LENGTH}
                className="flex-1 border rounded-full px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-400"
              />
              <button
                onClick={handleSendClick}
                className="bg-blue-600 text-white p-1 rounded-full hover:bg-blue-700 transition-colors"
              >
                <FaPaperPlane size={10} />
              </button>
            </div>
          </div>
        )}

        {/* Circle button - BEZ ANIMACIJA */}
        {!open && !miniOpen && (
          <button
            onClick={handleOpenChat}
            className="w-14 h-14 rounded-full bg-blue-500 text-white shadow-lg flex items-center justify-center hover:bg-blue-600 transition relative cursor-move"
            title="Otvori chat"
            style={{ cursor: "move" }}
          >
            <FaComments size={20} />
            {/* Statična notifikacija bez animacije */}
            {hasNotification && (
              <div className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px]">
                !
              </div>
            )}
          </button>
        )}
      </div>
    </Rnd>
  );
};

export default GlobalChatWidget;
