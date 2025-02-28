import { create } from "zustand";

// ActionsSheet type
export type QrSheetState = {
  qrDomain: string;
  setQrDomain: (value: string) => void;
  qrSheetOpen: boolean;
  setQrSheetOpen: (value: boolean) => void;
};

// Zustand store for QrSheetState
export const useQrSheetStore = create<QrSheetState>((set) => ({
  qrDomain: "",
  setQrDomain: (value) => set({ qrDomain: value }),
  qrSheetOpen: false,
  setQrSheetOpen: (value) => set({ qrSheetOpen: value }),
}));
