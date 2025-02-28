import { Region } from "react-native-maps";

import type { NativeEventSubscription } from "react-native";
import * as Location from "expo-location";
import { create } from "zustand";

// MapState type
export type MapState = {
  mapLoading: boolean;
  setMapLoading: (value: boolean) => void;
  region: Region;
  setRegion: (region: Region) => void;
  zoom: number;
  setZoom: (zoom: number) => void;
  selectedDomain: string | null;
  setSelectedDomain: (domain: string | null) => void;
  isDialogOpen: boolean;
  setIsDialogOpen: (value: boolean) => void;
  appStateListener: NativeEventSubscription | null;
  setAppStateListener: (value: NativeEventSubscription | null) => void;
  focusedDomainCard: string | null;
  setFocusedDomainCard: (value: string | null) => void;
  closestDomain: string | null;
  setClosestDomain: (value: string | null) => void;
  ownedMarkers: JSX.Element[];
  setOwnedMarkers: (value: JSX.Element[]) => void;
  ownedPolygons: JSX.Element[];
  setOwnedPolygons: (value: JSX.Element[]) => void;
  domainsInViewport: string[];
  setDomainsInViewport: (value: string[]) => void;
  domainFlashListOpen: boolean;
  setDomainFlashListOpen: () => void;
  viewDomain: string | null;
  setViewDomain: (value: string | null) => void;
};

// Zustand store for MapState
export const useMapStore = create<MapState>((set) => ({
  mapLoading: true,
  setMapLoading: (value) => set({ mapLoading: value }),
  region: {
    latitude: 23.362460480158585,
    latitudeDelta: 95.29234485320822,
    longitude: 16.942805740982294,
    longitudeDelta: 69.91075236350298,
  },
  setRegion: (region) => set({ region: region }),
  zoom: 1,
  setZoom: (zoom) => set({ zoom: zoom }),
  selectedDomain: null,
  setSelectedDomain: (domain) => set({ selectedDomain: domain }),
  isDialogOpen: false,
  setIsDialogOpen: (value) => set({ isDialogOpen: value }),
  appStateListener: null,
  setAppStateListener: (listener) => set({ appStateListener: listener }),
  focusedDomainCard: null,
  setFocusedDomainCard: (value) => set({ focusedDomainCard: value }),
  closestDomain: null,
  setClosestDomain: (value) => set({ closestDomain: value }),
  ownedMarkers: [],
  setOwnedMarkers: (value) => set({ ownedMarkers: value }),
  ownedPolygons: [],
  setOwnedPolygons: (value) => set({ ownedPolygons: value }),
  domainsInViewport: [],
  setDomainsInViewport: (value) => set({ domainsInViewport: value }),
  domainFlashListOpen: true,
  setDomainFlashListOpen: () => set((state) => ({ domainFlashListOpen: !state.domainFlashListOpen })),
  viewDomain: null,
  setViewDomain: (value) => set({ viewDomain: value }),
}));
