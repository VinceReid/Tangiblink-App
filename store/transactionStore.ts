import { latestTransactionsPersistStorage } from "@/store/mmkv";
import { persist, createJSONStorage } from "zustand/middleware";
import { create } from "zustand";

// Store for the transaction details
export type TransactionStore = {
  latestPaymentTxHash: string;
  setLatestPaymentTxHash: (latestPaymentTxHash: string) => void;
};

// Create the store
export const useTransactionStore = create<TransactionStore>()(
  persist(
    (set, get) => ({
      latestPaymentTxHash: "",
      setLatestPaymentTxHash: (latestPaymentTxHash) =>
        set({ latestPaymentTxHash }),
    }),
    {
      name: "transactions-storage",
      storage: createJSONStorage(() => latestTransactionsPersistStorage),
    }
  )
);
