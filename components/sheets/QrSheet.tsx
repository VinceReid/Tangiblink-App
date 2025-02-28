import { Sheet } from "@tamagui/sheet";
import { useRouter } from "expo-router";
import { useState, useEffect, useRef } from "react";
import { YStack, XStack, useTheme, Button } from "tamagui";
import { LucideIcon } from "@/components/LucideIcons";
import { BackHandler } from "react-native";
import { useQrSheetStore } from "@/store/qrSheetStore";
import { SheetHeader } from "@/components/SheetHeader";
import * as Linking from "expo-linking";
import QRCode from "react-native-qrcode-svg";
import Share from "react-native-share";

export const QrSheet = () => {
  const router = useRouter();
  const [position, setPosition] = useState(0);
  // Destructuring the store
  const qrSheetOpen = useQrSheetStore((state) => state.qrSheetOpen);
  const setQrSheetOpen = useQrSheetStore((state) => state.setQrSheetOpen);
  const domain = useQrSheetStore((state) => state.qrDomain);
  const svgRef = useRef<any>(null);
  const [base64, setBase64] = useState("");
  const logo = require("@/assets/images/logoIcon.png");
  // Colors for the QR code
  const theme = useTheme();
  const color = theme.color10.get();
  const backgroundColor = theme.background.get();

  useEffect(() => {
    const onBackPress = () => {
      if (qrSheetOpen) {
        setQrSheetOpen(false);
        return true;
      }
      router.back();
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      onBackPress
    );
    return () => backHandler.remove();
  }, [qrSheetOpen]);

  // get base64 string encode of the qrcode (currently logo is not included)
  function getDataURL() {
    if (!svgRef.current) {
      return;
    }
    return svgRef.current.toDataURL(base64Callback);
  }

  function base64Callback(dataURL: any) {
    setBase64(dataURL);
  }

  //  On svgRef being set getDataURL is called to get the base64 string of the QR code
  useEffect(() => {
    getDataURL();
  }, [svgRef.current, domain]);

  // Function to share the QR code
  async function shareQR() {
    const shareOptions = {
      title: `Tangiblink domain: ${domain}`,
      message: `View Tangiblink Domain "${domain}". Scan the QR code inside the app`,
      subject: `Check out Tangiblink domain ${domain}`,
      url: `data:image/svg+xml;base64,${base64}`,
    };
    try {
      await Share.open(shareOptions);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Sheet
      forceRemoveScrollEnabled={qrSheetOpen}
      open={qrSheetOpen}
      onOpenChange={setQrSheetOpen}
      snapPointsMode={"percent"}
      snapPoints={[90]}
      dismissOnSnapToBottom
      position={position}
      onPositionChange={setPosition}
      zIndex={100_000}
    >
      <Sheet.Overlay
        animation="lazy"
        enterStyle={{ opacity: 0 }}
        exitStyle={{ opacity: 0 }}
      />
      <Sheet.Handle bg={"$color"} />
      <Sheet.Frame
        padding="$4"
        justifyContent="center"
        alignItems="center"
        gap="$5"
        mb="$10"
      >
        <SheetHeader title="Share QR" defaultIcon="qrCode" domain={domain} />
        <YStack f={1} gap="$3" mb="$3" justifyContent="center">
          {qrSheetOpen && (
            <YStack
              p="$3"
              justifyContent="center"
              br="$5"
              bw={1}
              boc="$accentColor"
            >
              <QRCode
                getRef={(c) => (svgRef.current = c)}
                value={domain}
                logoBackgroundColor="transparent"
                logo={logo}
                logoMargin={0}
                size={250}
                quietZone={10}
                color={color}
                backgroundColor={backgroundColor}
              />
            </YStack>
          )}
          <XStack gap="$3" m="$2" justifyContent="center">
            <Button
              icon={<LucideIcon defaultIcon="share" size={16} />}
              onPress={() => shareQR()}
            >
              Share
            </Button>
          </XStack>
        </YStack>
      </Sheet.Frame>
    </Sheet>
  );
};
