import { create } from "zustand";

// BuySheet type
export type BuyDomainState = {
  buyDomain: string;
  setBuyDomain: (value: string) => void;
  buySheetOpen: boolean;
  setBuySheetOpen: (value: boolean) => void;
  buyWithRecordSheetOpen: boolean;
  setBuyWithRecordSheetOpen: (value: boolean) => void;
};

// Zustand store for BuyDomainState
export const useBuyDomainStore = create<BuyDomainState>((set) => ({
  buyDomain: "",
  setBuyDomain: (value) => set({ buyDomain: value }),
  buySheetOpen: false,
  setBuySheetOpen: (value) => set({ buySheetOpen: value }),
  buyWithRecordSheetOpen: false,
  setBuyWithRecordSheetOpen: (value) => set({ buyWithRecordSheetOpen: value }),
}));
