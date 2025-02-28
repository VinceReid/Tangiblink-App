import { create } from "zustand";

// PayState type
export type PayState = {
  paySheetOpen: boolean;
  setPaySheetOpen: (value: boolean) => void;
  data: string;
  setData: (data: string) => void;
  amountToPay: string;
  setAmountToPay: (amountToPay: string) => void;
  domainToPay: string;
  setDomainToPay: (domainToPay: string) => void;
};

// Zustand store for PayState
export const usePayStore = create<PayState>((set) => ({
  paySheetOpen: false,
  setPaySheetOpen: (value) => set({ paySheetOpen: value }),
  data: "",
  setData: (data) => set({ data: data }),
  amountToPay: "",
  setAmountToPay: (amountToPay) => set({ amountToPay: amountToPay }),
  domainToPay: "",
  setDomainToPay: (domainToPay) => set({ domainToPay: domainToPay }),
}));
