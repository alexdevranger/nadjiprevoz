// helper/messageService.js
import { setGlobalState } from "./globalState";
import { socket } from "../App";
import axios from "axios";

let isInitialized = false;

export const initMessageService = (token, userId) => {
  if (isInitialized) return;

  // Slušaj socket događaje za nove poruke
  socket.on("newMessage", (message) => {
    if (message.senderId !== userId) {
      // Ako poruka nije od trenutnog korisnika, povećaj broj nepročitanih
      setGlobalState("totalUnread", (prev) => prev + 1);
    }
  });

  // Slušaj ažuriranja konverzacija
  socket.on("conversationUpdated", (conversation) => {
    // Osvježi broj nepročitanih poruka
    fetchUnreadCount(token);
  });

  isInitialized = true;
};

export const fetchUnreadCount = async (token) => {
  try {
    const response = await axios.get("/api/conversations/unread-count", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setGlobalState("totalUnread", response.data.count);
  } catch (error) {
    console.error("Greška pri dobijanju broja nepročitanih poruka:", error);
  }
};
