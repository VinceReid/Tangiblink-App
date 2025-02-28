import { settingsPersistStorage } from "@/store/mmkv";
import { persist, createJSONStorage } from "zustand/middleware";
import { create } from "zustand";

// Unit types
export type Units = "metric" | "imperial";

// App Setting types
export type AppSettings = {
  notifications: boolean;
  setNotifications: () => void;
  units: Units;
  setUnits: (units: Units) => void;
  locationPermission: boolean;
  setLocationPermission: () => void;
  cameraPermission: boolean;
  setCameraPermission: () => void;
  onboarding: boolean;
  setOnboarding: () => void;
};

// Settings for the app
export const useAppSettings = create<AppSettings>()(
  persist(
    (set, get) => ({
      notifications: true,
      setNotifications: () =>
        set((state: AppSettings) => ({ notifications: !state.notifications })),
      units: "metric",
      setUnits: (units: Units) => set({ units: units }),
      locationPermission: true,
      setLocationPermission: () =>
        set((state: AppSettings) => ({
          locationPermission: !state.locationPermission,
        })),
      cameraPermission: false,
      setCameraPermission: () =>
        set((state: AppSettings) => ({
          cameraPermission: !state.cameraPermission,
        })),
      onboarding: false,
      setOnboarding: () =>
        set((state: AppSettings) => ({ onboarding: !state.onboarding })),
    }),
    {
      name: "settings-storage",
      storage: createJSONStorage(() => settingsPersistStorage),
    }
  )
);
