import { create } from "zustand";
import type { PingFormDetails } from "../components/PingFormModal";

interface usePingStore {
  pings: PingFormDetails[];
  setPings: (pingDetail: PingFormDetails) => void;
}

const usePingStore = create<usePingStore>((set) => ({
  pings: [],
  setPings: (pingDetail: PingFormDetails) =>
    set((s) => ({ pings: [pingDetail, ...s.pings] })),
}));

export default usePingStore;
