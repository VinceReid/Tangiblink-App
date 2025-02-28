import { MMKV } from "react-native-mmkv";
import { StateStorage } from "zustand/middleware/persist";

// Create a new storage instance for settings
export const settingsStorage = new MMKV({
  id: "settings-storage",
});

export const settingsPersistStorage: StateStorage = {
  setItem: (name: string, value: string) => {
    settingsStorage.set(name, value);
  },
  getItem: (name: string) => {
    const value = settingsStorage.getString(name);
    return value ?? null;
  },
  removeItem: (name: string) => {
    settingsStorage.delete(name);
  },
};

// Create a new storage instance for transactions
export const transactionsStorage = new MMKV({
  id: "transactions-storage",
});

export const latestTransactionsPersistStorage: StateStorage = {
  setItem: (name: string, value: string) => {
    transactionsStorage.set(name, value);
  },
  getItem: (name: string) => {
    const value = transactionsStorage.getString(name);
    return value ?? null;
  },
  removeItem: (name: string) => {
    transactionsStorage.delete(name);
  },
};