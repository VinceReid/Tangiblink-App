import { create } from "zustand";

// ActionsSheet type
export type ActionsSheetState = {
  actionsDomain: string;
  setActionsDomain: (value: string) => void;
  actionsSheetOpen: boolean;
  setActionsSheetOpen: (value: boolean) => void;
};

// Zustand store for ActionsSheetState
export const useActionsSheetStore = create<ActionsSheetState>((set) => ({
  actionsDomain: "",
  setActionsDomain: (value) => set({ actionsDomain: value }),
  actionsSheetOpen: false,
  setActionsSheetOpen: (value) => set({ actionsSheetOpen: value }),
}));
