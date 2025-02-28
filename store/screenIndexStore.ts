import { create } from "zustand";

// ScreenIndexState type
export type ScreenIndexState = {
  indexScreenIndex: number;
  setIndexScreenIndex: (value: number) => void;
  domainScreenIndex: number;
  setDomainScreenIndex: (value: number) => void;
  activityScreenIndex: number;
  setActivityScreenIndex: (value: number) => void;
};

// Zustand store for ScreenIndexState
export const useScreenIndexStore = create<ScreenIndexState>((set) => ({
  indexScreenIndex: 0,
  setIndexScreenIndex: (value) => set({ indexScreenIndex: value }),
  domainScreenIndex: 1,
  setDomainScreenIndex: (value) => set({ domainScreenIndex: value }),
  activityScreenIndex: 0,
  setActivityScreenIndex: (value) => set({ activityScreenIndex: value }),
}));
