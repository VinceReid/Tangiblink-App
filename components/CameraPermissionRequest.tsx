import { useEffect } from "react";
import { Linking, AppState, NativeEventSubscription } from "react-native";
import type { AppStateStatus } from "react-native";
import { useAppSettings } from "@/store/settingsStore";
import { useCameraPermissions } from "expo-camera";

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

// CameraPermissionState type
export type CameraPermissionState = {
  isDialogOpen: boolean;
  setIsDialogOpen: (value: boolean) => void;
  appStateListener: NativeEventSubscription | null;
  setAppStateListener: (value: NativeEventSubscription | null) => void;
};

// Zustand store for CameraPermissionState
export const useCameraPermissionStore = create<CameraPermissionState>(
  (set) => ({
    isDialogOpen: false,
    setIsDialogOpen: (value) => set({ isDialogOpen: value }),
    appStateListener: null,
    setAppStateListener: (listener) => set({ appStateListener: listener }),
  })
);

// Component to request camera permissions
export default function CameraPermissionRequest() {
  // Destructuring the store
  const isDialogOpen = useCameraPermissionStore((state) => state.isDialogOpen);
  const appStateListener = useCameraPermissionStore(
    (state) => state.appStateListener
  );
  const setIsDialogOpen = useCameraPermissionStore(
    (state) => state.setIsDialogOpen
  );
  const setAppStateListener = useCameraPermissionStore(
    (state) => state.setAppStateListener
  );

  const { cameraPermission, setCameraPermission } = useAppSettings();
  const [permission, requestPermission] = useCameraPermissions();
  const isPermissionGranted = Boolean(permission?.status === "granted");
  // Get the current location of the user and open a dialog if location permission is denied
  useEffect(() => {
    (async () => {
      if (!isPermissionGranted && !cameraPermission) {
        return;
      }
      if (!isPermissionGranted) {
        let { status } = await requestPermission();
        if (status === "granted") {
          !cameraPermission && setCameraPermission();
          return;
        } else {
          if (!cameraPermission) {
            setIsDialogOpen(true);
            return;
          }
        }
      }
    })();
  }, [cameraPermission]);

  // Function to get the current location of the user
  const getPermissionStatus = async () => {
    if (isPermissionGranted) {
      !cameraPermission && setCameraPermission();
    }
  };

  // Function to handle the app state change
  const handleAppStateChange = async (state: AppStateStatus) => {
    if (state === "active") {
      // User has returned from phone settings, do something with this information
      await getPermissionStatus();
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
          key="camera-permissions-alert-overlay"
          animation="quick"
          opacity={0.5}
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />
        <AlertDialog.Content
          bordered
          elevate
          key="camera-permissions-alert-content"
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
              {`To enable Tangiblink's camera feature, please grant access to your camera in your phone's settings.\n`}
            </AlertDialog.Description>
            <XStack alignItems="center" gap="$2" mb={"$3"}>
              <Label
                paddingRight="$0"
                justifyContent="flex-end"
                size={"$2"}
                htmlFor={"switch-camera-permissions-denied"}
              >
                Ignore future requests
              </Label>
              <Separator minHeight={20} vertical />
              <Switch
                id={"switch-camera-permissions-denied"}
                size={"$2"}
                defaultChecked={cameraPermission}
                onCheckedChange={setCameraPermission}
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
