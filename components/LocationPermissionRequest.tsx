import { useEffect } from "react";
import { Linking, AppState, NativeEventSubscription } from "react-native";
import type { AppStateStatus } from "react-native";
import * as Location from "expo-location";
import { useAppSettings } from "@/store/settingsStore";
import { create } from "zustand";

import {
  AlertDialog,
  Button,
  XStack,
  YStack,
  Switch,
  Label,
  Separator,
} from "tamagui";

// LocationPermissionState type
export type LocationPermissionState = {
  isDialogOpen: boolean;
  setIsDialogOpen: (value: boolean) => void;
  appStateListener: NativeEventSubscription | null;
  setAppStateListener: (value: NativeEventSubscription | null) => void;
  location: Location.LocationObject | null;
  setLocation: (location: Location.LocationObject | null) => void;
};

// Zustand store for LocationPermissionState
export const useLocationPermissionStore = create<LocationPermissionState>(
  (set) => ({
    isDialogOpen: false,
    setIsDialogOpen: (value) => set({ isDialogOpen: value }),
    appStateListener: null,
    setAppStateListener: (listener) => set({ appStateListener: listener }),
    location: null,
    setLocation: (location) => set({ location: location }),
  })
);

// Component to request location permissions
export default function LocationPermissionRequest() {
  // Destructuring the store
  const isDialogOpen = useLocationPermissionStore(
    (state) => state.isDialogOpen
  );
  const appStateListener = useLocationPermissionStore(
    (state) => state.appStateListener
  );
  const setLocation = useLocationPermissionStore((state) => state.setLocation);
  const setIsDialogOpen = useLocationPermissionStore(
    (state) => state.setIsDialogOpen
  );
  const setAppStateListener = useLocationPermissionStore(
    (state) => state.setAppStateListener
  );

  const { locationPermission, setLocationPermission } = useAppSettings();

  // Get the current location of the user and open a dialog if location permission is denied
  useEffect(() => {
    (async () => {
      let { status } = await Location.getForegroundPermissionsAsync();
      if (status !== "granted" && !locationPermission) {
        setLocation(null);
        return;
      }
      if (status !== "granted") {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status === "granted") {
          let location = await Location.getCurrentPositionAsync({});
          setLocation(location);
          return;
        } else {
          if (locationPermission) {
            setIsDialogOpen(true);
            return;
          }
        }
      }
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, [locationPermission]);

  // Function to get the current location of the user
  const getLocation = async () => {
    let { status } = await Location.getForegroundPermissionsAsync();
    if (status === "granted") {
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      !locationPermission && setLocationPermission();
    } else {
      setLocation(null);
    }
  };

  // Function to handle the app state change
  const handleAppStateChange = async (state: AppStateStatus) => {
    if (state === "active") {
      // User has returned from phone settings, do something with this information
      await getLocation();
      appStateListener?.remove();
    }
  };

  useEffect(() => {
    if (!isDialogOpen) {
      return;
    }
    setAppStateListener(
      AppState.addEventListener("change", handleAppStateChange)
    );
    return () => appStateListener?.remove();
  }, [isDialogOpen]);

  // Function to handle closing the dialog
  const handleClose = () => {
    setIsDialogOpen(false);
  };
  // Function to handle Open settings
  const handleOpenSettings = () => {
    Linking.openSettings();
    setIsDialogOpen(false);
  };
  return (
    <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay
          key="location-permissions-alert-overlay"
          animation="quick"
          opacity={0.5}
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />
        <AlertDialog.Content
          bordered
          elevate
          key="location-permissions-alert-content"
          animation={[
            "quick",
            {
              opacity: {
                overshootClamping: true,
              },
            },
          ]}
          enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
          exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
          x={0}
          scale={1}
          opacity={1}
          y={0}
        >
          <YStack>
            <AlertDialog.Title>Location permissions</AlertDialog.Title>
            <AlertDialog.Description>
              {`To enable Tangiblink's map to access your location.\nGo to settings and enable location permissions.\n`}
            </AlertDialog.Description>
            <XStack alignItems="center" gap="$2" mb={"$3"}>
              <Label
                paddingRight="$0"
                justifyContent="flex-end"
                size={"$2"}
                htmlFor={"switch-location-permissions-denied"}
              >
                Ignore future requests
              </Label>
              <Separator minHeight={20} vertical />
              <Switch
                id={"switch-location-permissions-denied"}
                size={"$2"}
                defaultChecked={!locationPermission}
                onCheckedChange={setLocationPermission}
              >
                <Switch.Thumb animation="quick" bg="$accentColor" />
              </Switch>
            </XStack>

            <XStack gap="$3" justifyContent="flex-end">
              <AlertDialog.Cancel asChild>
                <Button onPress={handleClose}>Cancel</Button>
              </AlertDialog.Cancel>
              <AlertDialog.Action asChild>
                <Button theme="active" onPress={handleOpenSettings}>
                  Open settings
                </Button>
              </AlertDialog.Action>
            </XStack>
          </YStack>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog>
  );
}
