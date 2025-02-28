import { create } from "zustand";
import { DomainInfo } from "@/hooks/useContractData";

// Contract Data Store type
export type ContractDataState = {
    paymentsReceived: any[];
    setPaymentsReceived: (paymentsReceived: any[]) => void;
    paymentsReceivedLoading: boolean;
    setPaymentsReceivedLoading: (paymentsReceivedLoading: boolean) => void;
    domainsInfo: DomainInfo[];
    setDomainsInfo: (domainsInfo: DomainInfo[]) => void;
    domainInfoLoading: boolean;
    setDomainInfoLoading: (domainInfoLoading: boolean) => void;
    transfers: any[];
    setTransfers: (transfers: any[]) => void;
    transfersLoading: boolean;
    setTransfersLoading: (transfersLoading: boolean) => void;
};

// Zustand store for ContractDataState
export const useContractDataStore = create<ContractDataState>((set) => ({
    paymentsReceived: [],
    setPaymentsReceived: (paymentsReceived) => set({ paymentsReceived }),
    paymentsReceivedLoading: true,
    setPaymentsReceivedLoading: (paymentsReceivedLoading) => set({ paymentsReceivedLoading }),
    domainsInfo: [],
    setDomainsInfo: (domainsInfo) => set({ domainsInfo }),
    domainInfoLoading: true,
    setDomainInfoLoading: (domainInfoLoading) => set({ domainInfoLoading }),
    transfers: [],
    setTransfers: (transfers) => set({ transfers }),
    transfersLoading: true,
    setTransfersLoading: (transfersLoading) => set({ transfersLoading }),
}));
