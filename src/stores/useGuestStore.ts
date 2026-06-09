import { create } from "zustand";

interface GuestState {
  guestToken: string | null;
  setGuestToken: (token: string) => void;
  clearGuestToken: () => void;
  isTokenValid: () => boolean;
}

export const useGuestStore = create<GuestState>((set, get) => ({
  guestToken: localStorage.getItem("guestToken"),
  setGuestToken: (token) => {
    localStorage.setItem("guestToken", token);
    set({ guestToken: token });
  },
  clearGuestToken: () => {
    localStorage.removeItem("guestToken");
    set({ guestToken: null });
  },
  isTokenValid: () => {
    const token = get().guestToken;
    if (!token) return false;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  },
}));
