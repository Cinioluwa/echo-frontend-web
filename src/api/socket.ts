import { io, Socket } from "socket.io-client";
import { API_BASE_URL } from "./axios.config";

let socket: Socket | null = null;

export const connectSocket = (token: string) => {
  socket = io(API_BASE_URL, { auth: { token } });
  return socket;
};

export const disconnectSocket = () => {
  socket?.disconnect();
  socket = null;
};

export const getSocket = () => socket;
