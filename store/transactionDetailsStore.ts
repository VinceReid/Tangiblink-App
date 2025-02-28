import { create } from "zustand";

// TransactionState type
export type TransactionDetailsState = {
  transactionDetailsSheetOpen: boolean;
  setTransactionDetailsSheetOpen: (value: boolean) => void;
  eventDetails: any | null;
  setEventDetails: (eventDetails: any) => void;
  transactionDetailsDomain: string;
  setTransactionDetailsDomain: (transactionDetailsDomain: string) => void;
};

// Zustand store for TransactionState
export const useTransactionDetailsStore = create<TransactionDetailsState>(
  (set) => ({
    transactionDetailsSheetOpen: false,
    setTransactionDetailsSheetOpen: (value) =>
      set({ transactionDetailsSheetOpen: value }),
    eventDetails: null,
    setEventDetails: (eventDetails) => set({ eventDetails: eventDetails }),
    transactionDetailsDomain: "",
    setTransactionDetailsDomain: (transactionDetailsDomain) =>
      set({ transactionDetailsDomain: transactionDetailsDomain }),
  })
);
