// helper/messageService.js
import { setGlobalState } from "./globalState";
import { socket } from "../App";
import axios from "axios";

let isInitialized = false;
let currentUserId = null;

export const initMessageService = (token, userId) => {
  if (isInitialized) return;

  currentUserId = userId;

  // Slušaj socket događaje za nove poruke
  socket.on("newMessage", (message) => {
    // VAŽNO: Povećaj broj nepročitanih SAMO ako poruka nije od trenutnog korisnika
    console.log(
      "newMessage",
      message.senderId !== userId,
      message.senderId !== userId._id,
      message.senderId,
      userId
    );
    if (message.senderId !== userId && message.senderId !== userId._id) {
      setGlobalState("totalUnread", (prev) => prev + 1);
    }
  });

  // Slušaj ažuriranja konverzacija
  socket.on("conversationUpdated", (conversation) => {
    console.log(
      "conversationUpdated",
      conversation.lastMessage?.senderId,
      currentUserId
    );
    if (conversation.lastMessage?.senderId === currentUserId) return; // ignoriši svoje poruke
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

// Dodajte funkciju za ručno ažuriranje broja nepročitanih
export const updateUnreadCount = (count) => {
  setGlobalState("totalUnread", count);
};
