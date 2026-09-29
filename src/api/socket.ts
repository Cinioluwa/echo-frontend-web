import { io, Socket } from "socket.io-client";
import { API_BASE_URL } from "./axios.config";
import { useAuthStore } from "../stores/auth/useAuthStore";

let socket: Socket | null = null;

// Strip trailing /api or /api/ so Socket.io connects to root namespace '/'
export const getSocketUrl = (url: string): string => {
  return url.replace(/\/api\/?$/, "");
};

export const connectSocket = (token: string): Socket => {
  if (socket) {
    if (socket.connected && (socket.auth as any)?.token === token) {
      return socket;
    }
    socket.disconnect();
    socket = null;
  }

  const socketUrl = getSocketUrl(API_BASE_URL);
  socket = io(socketUrl, {
    auth: { token },
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
  });

  socket.on("connect", () => {
    console.log("🟢 WebSocket connected to:", socketUrl, "ID:", socket?.id);
  });

  socket.on("connect_error", (err) => {
    console.error("🔴 WebSocket connection error:", err.message);
  });

  socket.on("disconnect", (reason) => {
    console.log("🟡 WebSocket disconnected:", reason);
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = (): Socket | null => {
  if (!socket) {
    const token =
      useAuthStore.getState().token || localStorage.getItem("authToken");
    if (token) {
      return connectSocket(token);
    }
  }
  return socket;
};
