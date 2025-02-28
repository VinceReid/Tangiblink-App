import { create } from "zustand";

// RecordDetailsState type
export type RecordDetailsState = {
  recordDetailsDomain: string;
  setRecordDetailsDomain: (value: string) => void;
  recordDetailsSheetOpen: boolean;
  setRecordDetailsSheetOpen: (value: boolean) => void;
  recordKey: string | null;
  setRecordKey: (recordKey: any) => void;
  recordTokenId: bigint | null;
  setRecordTokenId: (recordTokenId: bigint) => void;
};

// Zustand store for RecordDetailsState
export const useRecordDetailsStore = create<RecordDetailsState>((set) => ({
  recordDetailsDomain: "",
  setRecordDetailsDomain: (value) => set({ recordDetailsDomain: value }),
  recordDetailsSheetOpen: false,
  setRecordDetailsSheetOpen: (value) => set({ recordDetailsSheetOpen: value }),
  recordKey: null,
  setRecordKey: (recordKey) => set({ recordKey: recordKey }),
  recordTokenId: null,
  setRecordTokenId: (recordTokenId) => set({ recordTokenId: recordTokenId }),
}));
