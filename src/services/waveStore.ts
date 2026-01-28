import { create } from "zustand";
import type { proposedWaveDetails } from "../components/ProposeWaveModal";

interface useWaveStore {
  waves: proposedWaveDetails[];
  setWaves: (waveDetail: proposedWaveDetails) => void;
}

const useWaveStore = create<useWaveStore>((set) => ({
  waves: [],
  setWaves: (waveDetail: proposedWaveDetails) =>
    set((s) => ({ waves: [waveDetail, ...s.waves] })),
}));

export default useWaveStore;
