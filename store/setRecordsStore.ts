import { create } from "zustand";

export type KeyValue = {
  key: string;
  value: string;
};

// SetRecordsState type
export type SetRecordsState = {
  records: KeyValue[];
  addRecord: (record: KeyValue) => void;
  deleteRecordByIndex: (index: number) => void;
  deleteAllRecords: () => void;
  recordsDomain: string;
  setRecordsDomain: (recordsDomain: string) => void;
  existingKeys: string[];
  setExistingKeys: (existingKeys: string[]) => void;
  existingRecords: KeyValue[];
  setExistingRecords: (existingRecords: KeyValue[]) => void;
  editedRecords: KeyValue[];
  addEditedRecord: (record: KeyValue) => void;
  deleteEditedRecordByKey: (key: string) => void;
  deletedRecords: string[];
  addDeletedRecord: (key: string) => void;
  deleteDeletedRecord: (key: string) => void;
  resetDeletedAndEditedRecords: () => void;
  definedKey: string;
  setDefinedKey: (definedKey: string) => void;
};

// Zustand store for SetRecordsState
export const useSetRecordsStore = create<SetRecordsState>((set) => ({
  records: [],
  // Check if a record with the same key already exists and if it does update it, otherwise add it
  addRecord: (record) =>
    set((state) => {
      const recordIndex = state.records.findIndex((r) => r.key === record.key);
      if (recordIndex === -1) {
        return { records: [...state.records, record] };
      }
      const newRecords = [...state.records];
      newRecords[recordIndex] = record;
      return { records: newRecords };
    }),
  deleteRecordByIndex: (index) =>
    set((state) => ({ records: state.records.filter((_, i) => i !== index) })),
  deleteAllRecords: () => set({ records: [] }),
  recordsDomain: "",
  setRecordsDomain: (recordsDomain) => set({ recordsDomain: recordsDomain }),
  existingKeys: [],
  setExistingKeys: (existingKeys) => set({ existingKeys: existingKeys ?? [] }),
  existingRecords: [],
  setExistingRecords: (existingRecords) =>
    set({ existingRecords: existingRecords ?? [] }),
  editedRecords: [],
  addEditedRecord: (record) =>
    set((state) => {
      const recordIndex = state.editedRecords.findIndex(
        (r) => r.key === record.key
      );
      if (recordIndex === -1) {
        return { editedRecords: [...state.editedRecords, record] };
      }
      const newRecords = [...state.editedRecords];
      newRecords[recordIndex] = record;
      return { editedRecords: newRecords };
    }),
  deleteEditedRecordByKey: (key) =>
    set((state) => ({
      editedRecords: state.editedRecords.filter((r) => r.key !== key),
    })),
  deletedRecords: [],
  addDeletedRecord: (key) =>
    set((state) => {
      const recordIndex = state.deletedRecords.findIndex((k) => k === key);
      if (recordIndex === -1) {
        return { deletedRecords: [...state.deletedRecords, key] };
      }
      const newRecords = [...state.deletedRecords];
      newRecords[recordIndex] = key;
      return { deletedRecords: newRecords };
    }),
  deleteDeletedRecord: (key) =>
    set((state) => ({
      deletedRecords: state.deletedRecords.filter((k) => k !== key),
    })),
  resetDeletedAndEditedRecords: () =>
    set({ editedRecords: [], deletedRecords: [] }),
  definedKey: "",
  setDefinedKey: (definedKey) => set({ definedKey: definedKey }),
}));
