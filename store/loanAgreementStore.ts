import { create } from "zustand";

// LoanAgreementState type
export type LoanAgreementState = {
    loanDomain: string;
    setLoanDomain: (value: string) => void;
    loanDuration: string | null;
    setLoanDuration: (value: string) => void;
    loanExpiry: Date;
    setLoanExpiry: (value: Date) => void;
    loanAddress: string;
    setLoanAddress: (value: string) => void;
    isValidated: boolean;
    setIsValidated: (value: boolean) => void;
    loanDomainsPendingTransactions: string[];
    setLoanDomainsPendingTransactions: (value: string[]) => void;
};

// Zustand store for LoanAgreementState
export const useLoanAgreementStore = create<LoanAgreementState>((set) => ({
    loanDomain: "",
    setLoanDomain: (value) => set({ loanDomain: value }),
    loanDuration: null,
    setLoanDuration: (value) => set({ loanDuration: value }),
    loanExpiry: new Date(),
    setLoanExpiry: (value) => set({ loanExpiry: value }),
    loanAddress: "",
    setLoanAddress: (value) => set({ loanAddress: value }),
    isValidated: false,
    setIsValidated: (value) => set({ isValidated: value }),
    loanDomainsPendingTransactions: [],
    setLoanDomainsPendingTransactions: (value) => set({ loanDomainsPendingTransactions: value }),
}));
