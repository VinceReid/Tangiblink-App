import { create } from "zustand";

// TransferDomainState type
export type TransferDomainState = {
  transferDomain: string;
  setTransferDomain: (transferDomain: string) => void;
  transferTo: string;
  setTransferTo: (transferTo: string) => void;
  isValidated: boolean;
  setIsValidated: (value: boolean) => void;
  domainsPendingTransfer: string[];
  setDomainsPendingTransfer: (value: string[]) => void;
};

// Zustand store for TransferDomainState
export const useTransferDomainStore = create<TransferDomainState>((set) => ({
  transferDomain: "",
  setTransferDomain: (transferDomain) =>
    set({ transferDomain: transferDomain }),
  transferTo: "",
  setTransferTo: (transferTo) => set({ transferTo: transferTo }),
  isValidated: false,
  setIsValidated: (value) => set({ isValidated: value }),
  domainsPendingTransfer: [],
  setDomainsPendingTransfer: (value) => set({ domainsPendingTransfer: value }),
}));
