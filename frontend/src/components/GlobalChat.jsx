// import React, { useEffect, useState, useRef } from "react";
// import { socket } from "../App";
// import axios from "axios";
// import { useGlobalState } from "../helper/globalState";

// const GlobalChat = () => {
//   const [user] = useGlobalState("user");
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState("");
//   const messagesEndRef = useRef(null);

//   useEffect(() => {
//     if (!socket) return;

//     socket.emit("joinGlobalChat");

//     socket.on("globalChatHistory", (msgs) => setMessages(msgs));
//     socket.on("receiveGlobalMessage", (msg) =>
//       setMessages((prev) => [...prev, msg])
//     );

//     return () => {
//       socket.off("globalChatHistory");
//       socket.off("receiveGlobalMessage");
//     };
//   }, []);

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   const sendMessage = async () => {
//     if (!newMessage.trim()) return;

//     // Emit preko Socket.io
//     socket.emit("sendGlobalMessage", {
//       userId: user.id,
//       content: newMessage,
//     });

//     // REST fallback sa tokenom
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) return;

//       await axios.post(
//         "/api/global-chat",
//         { content: newMessage },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       setNewMessage("");
//     } catch (err) {
//       console.error("Greška pri slanju poruke:", err);
//     }
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === "Enter") sendMessage();
//   };

//   return (
//     <div className="flex flex-col h-full w-full bg-gray-100 border rounded-lg shadow-md">
//       {/* Chat messages */}
//       <div className="flex-1 overflow-y-auto p-4 space-y-4">
//         {messages.map((msg) => {
//           const isMe = msg.user?._id === user._id;
//           return (
//             <div
//               key={msg._id}
//               className={`flex items-start space-x-2 ${
//                 isMe ? "justify-end" : "justify-start"
//               }`}
//             >
//               {!isMe && (
//                 <div className="flex-shrink-0">
//                   {msg.user?.profileImage ? (
//                     <img
//                       src={msg.user.profileImage}
//                       alt={msg.user.name}
//                       className="w-8 h-8 rounded-full object-cover"
//                     />
//                   ) : (
//                     <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-white font-bold">
//                       {msg.user?.name?.[0] || "?"}
//                     </div>
//                   )}
//                 </div>
//               )}

//               <div
//                 className={`max-w-xs px-4 py-2 rounded-lg break-words ${
//                   isMe
//                     ? "bg-blue-500 text-white self-end"
//                     : "bg-gray-200 text-gray-900"
//                 }`}
//               >
//                 {!isMe && (
//                   <div className="text-xs font-semibold text-gray-700 mb-1">
//                     {msg.user?.name}
//                   </div>
//                 )}
//                 <div className="text-sm">{msg.content}</div>
//               </div>

//               {isMe && <div className="flex-shrink-0 w-8 h-8" />}
//             </div>
//           );
//         })}
//         <div ref={messagesEndRef} />
//       </div>

//       {/* Input */}
//       <div className="flex p-3 border-t bg-white sticky bottom-0">
//         <input
//           type="text"
//           value={newMessage}
//           onChange={(e) => setNewMessage(e.target.value)}
//           onKeyPress={handleKeyPress}
//           placeholder="Type a message..."
//           className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
//         />
//         <button
//           onClick={sendMessage}
//           className="ml-2 bg-blue-500 text-white px-5 py-2 rounded-full hover:bg-blue-600"
//         >
//           Send
//         </button>
//       </div>
//     </div>
//   );
// };

// export default GlobalChat;
import React, { useEffect, useState, useRef } from "react";
import { socket } from "../App";
import axios from "axios";
import { useGlobalState } from "../helper/globalState";
import { FaSmile } from "react-icons/fa";

const GlobalChat = () => {
  const [user] = useGlobalState("user");
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!socket) return;

    socket.emit("joinGlobalChat");

    socket.on("globalChatHistory", (msgs) => setMessages(msgs));
    socket.on("receiveGlobalMessage", (msg) =>
      setMessages((prev) => [...prev, msg])
    );

    return () => {
      socket.off("globalChatHistory");
      socket.off("receiveGlobalMessage");
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    // Emit preko Socket.io
    socket.emit("sendGlobalMessage", {
      userId: user.id,
      content: newMessage,
    });

    // REST fallback sa tokenom
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      await axios.post(
        "/api/global-chat",
        { content: newMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setNewMessage("");
    } catch (err) {
      console.error("Greška pri slanju poruke:", err);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen max-h-screen w-full bg-gray-50 border shadow-lg">
      {/* Chat poruke */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => {
          const isMe = msg.user.id === user.id;
          return (
            <div
              key={msg._id}
              className={`flex items-start space-x-2 ${
                isMe ? "justify-end" : "justify-start"
              }`}
            >
              {!isMe && (
                <div className="flex-shrink-0">
                  {msg.user.profileImage ? (
                    <img
                      src={msg.user.profileImage}
                      alt={msg.user.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-400 flex items-center justify-center text-white font-bold">
                      {msg.user.name?.[0] || "?"}
                    </div>
                  )}
                </div>
              )}

              <div
                className={`relative max-w-xs px-4 py-2 rounded-lg break-words ${
                  isMe
                    ? "bg-blue-500 text-white self-end rounded-br-none"
                    : "bg-gray-200 text-gray-900 self-start rounded-bl-none"
                }`}
              >
                {!isMe && (
                  <div className="text-xs font-semibold text-gray-700 mb-1">
                    {msg.user.name}{" "}
                    <FaSmile className="inline text-yellow-400 ml-1" />
                  </div>
                )}
                <div className="text-sm">{msg.content}</div>
              </div>

              {isMe && <div className="flex-shrink-0 w-10 h-10" />}
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex items-center p-3 border-t bg-white">
        <button className="mr-2 text-gray-500 hover:text-gray-700">
          <FaSmile size={24} />
        </button>
        <textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Type a message..."
          className="flex-1 border rounded-xl px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 max-h-24 overflow-y-auto"
        />
        <button
          onClick={sendMessage}
          className="ml-2 bg-blue-500 text-white px-5 py-2 rounded-full hover:bg-blue-600"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default GlobalChat;
