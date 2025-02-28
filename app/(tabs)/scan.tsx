import { Separator, YStack, View, Button } from "tamagui";
import { useState, useRef, useEffect } from "react";
import { Container } from "@/components/Container";
import { ScanContent, Content } from "@/components/Content";
import { ThemedText } from "@/components/ThemedText";
import { useActiveAccount } from "thirdweb/react";
import { ModalHeader } from "@/components/ModalHeader";
import CameraPermissionRequest from "@/components/CameraPermissionRequest";
import { useCameraPermissions } from "expo-camera";
import { useAppSettings } from "@/store/settingsStore";
import { CameraView } from "expo-camera";
import { AppState, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Overlay } from "@/components/ScannerOverlay";
import { LucideIcon } from "@/components/LucideIcons";
import * as Linking from "expo-linking";
import OpenLocationCode from "@/utils/openlocationcode";
import useContractData from "@/hooks/useContractData";
import { useMapStore } from "@/store/mapStore";
import { useBuyDomainStore } from "@/store/buyDomainStore";
import { ErrorDialog } from "@/components/ErrorDialog";
import { ExternalLinkOnPress } from "@/components/ExternalLink";

export default function ScanQRScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const isPermissionGranted = Boolean(permission?.status === "granted");
  const { cameraPermission, setCameraPermission } = useAppSettings();
  const router = useRouter();
  const { domainsArray } = useContractData();
  const setSelectedDomain = useMapStore((state) => state.setSelectedDomain);
  const setBuyDomain = useBuyDomainStore((state) => state.setBuyDomain);
  const setBuySheetOpen = useBuyDomainStore((state) => state.setBuySheetOpen);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [error, setError] = useState("");
  const qrLock = useRef(false);
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        qrLock.current = false;
      }
      appState.current = nextAppState;
    });
    return () => subscription.remove();
  }, []);

  // Request camera permissions button
  const requestCameraPermissions = async () => {
    let { status } = await requestPermission();
    if (status === "granted") {
      !cameraPermission && setCameraPermission();
    }
  };

  // Function to try scanning another QR code after an error
  useEffect(() => {
    if (!isDialogOpen) {
      setError("");
      qrLock.current = false;
    }
  }, [isDialogOpen]);

  return (
    <Container>
      <CameraPermissionRequest />
      {cameraPermission && isPermissionGranted ? (
        <ScanContent>
          <CameraView
            style={StyleSheet.absoluteFillObject}
            facing="back"
            onBarcodeScanned={({ data }) => {
              if (data && !qrLock.current) {
                qrLock.current = true;
                setTimeout(async () => {
                  // check if the data is a valid open location code
                  if (OpenLocationCode.isValid(data)) {
                    const point = OpenLocationCode.decode(data) as any;
                    const domain = OpenLocationCode.encode(
                      point.latitudeCenter,
                      point.longitudeCenter,
                      11
                    );
                    if (domainsArray.data?.includes(domain)) {
                      qrLock.current = false;
                      router.navigate(`/${domain}`);
                    } else {
                      setSelectedDomain(domain);
                      setBuyDomain(domain);
                      setBuySheetOpen(true);
                      qrLock.current = false;
                      router.navigate(`/(tabs)/map`);
                    }
                  } else {
                    // if can open the url, open it
                    if (await Linking.canOpenURL(data)) {
                      Linking.openURL(data);
                    } else {
                      try {
                        ExternalLinkOnPress(data);
                      } catch (e) {
                        // if not, show an alert
                        setError("Invalid QR code");
                        setIsDialogOpen(true);
                      }
                    }
                  }
                }, 500);
              }
            }}
          />
          <Overlay />
          <ErrorDialog
            error={error}
            isDialogOpen={isDialogOpen}
            setIsDialogOpen={setIsDialogOpen}
          />
        </ScanContent>
      ) : (
        <Content>
          <YStack
            flex={1}
            p="$2"
            gap="$3.5"
            justifyContent="center"
            alignItems="center"
          >
            <LucideIcon defaultIcon="scan" size={100} />
            <ThemedText type="subtitle">
              Please enable camera permissions to scan QR codes
            </ThemedText>
            <Button onPress={requestCameraPermissions} size="$2">
              Enable Camera Permissions
            </Button>
          </YStack>
        </Content>
      )}
    </Container>
  );
}
