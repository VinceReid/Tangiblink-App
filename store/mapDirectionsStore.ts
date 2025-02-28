import { create } from "zustand";

// MapDirectionsState type
export type MapDirectionsState = {
    mapDirectionsPopUpOpen: boolean;
    setMapDirectionsPopUpOpen: (value: boolean) => void;
    directToDomain: string;
    setDirectToDomain: (value: string) => void;
  };
  
  // Zustand store for MapDirectionsState
  export const useMapDirectionsStore = create<MapDirectionsState>((set) => ({
    mapDirectionsPopUpOpen: false,
    setMapDirectionsPopUpOpen: (value) => set({ mapDirectionsPopUpOpen: value }),
    directToDomain: "",
    setDirectToDomain: (value) => set({ directToDomain: value }),
  }));