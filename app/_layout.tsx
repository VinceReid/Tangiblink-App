import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { ThirdwebProvider } from "thirdweb/react";
import { TamaguiProvider } from "tamagui";
import config from "@/tamagui.config";
import { useAppSettings } from "@/store/settingsStore";
import { ToastProvider } from "@tamagui/toast";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeToastViewport, CurrentToast } from "@/components/ToastViewport";
import { RecordDetailsSheet } from "@/components/sheets/RecordDetailsSheet";
import { TransactionDetailsSheet } from "@/components/sheets/TransactionDetailsSheet";
import { PayDomainSheet } from "@/components/sheets/PayDomainSheet";
import { MapDirectionsPopUp } from "@/components/sheets/MapDirectionsPopUp";
import { BuyWithRecordsSheet } from "@/components/sheets/BuyWithRecordsSheet";
import { BuySheet } from "@/components/sheets/BuySheet";
import { QrSheet } from "@/components/sheets/QrSheet";
import { ActionsSheet } from "@/components/sheets/ActionsSheet";
import { ConfettiAnimation } from "@/components/ConfettiAnimation";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export const unstable_settings = () => {
  const onboarding = useAppSettings((state) => state.onboarding);
  return {
    initialRouteName: !onboarding ? "/onboarding" : "/(tabs)",
  };
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("@/assets/fonts/SpaceMono-Regular.ttf"),
    Inter: require("@tamagui/font-inter/otf/Inter-Medium.otf"),
    InterBold: require("@tamagui/font-inter/otf/Inter-Bold.otf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <KeyboardProvider statusBarTranslucent>
      <ThirdwebProvider>
        <TamaguiProvider config={config} defaultTheme={"dark"}>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <ToastProvider>
              <SafeToastViewport />
              <CurrentToast />
              <Stack>
                <Stack.Screen
                  name="onboarding"
                  options={{ title: "Onboarding", presentation: "modal" }}
                />
                <Stack.Screen
                  name="(tabs)"
                  options={{ headerShown: false, title: "Tangiblink" }}
                />
                <Stack.Screen name="+not-found" />
                <Stack.Screen
                  name="settings"
                  options={{ presentation: "modal" }}
                />
                <Stack.Screen name="help" options={{ presentation: "modal" }} />
                <Stack.Screen
                  name="about"
                  options={{ presentation: "modal" }}
                />
                <Stack.Screen
                  name="policies"
                  options={{ presentation: "modal" }}
                />
                <Stack.Screen
                  name="add-records"
                  options={{ presentation: "modal" }}
                />
                <Stack.Screen
                  name="edit-records"
                  options={{ presentation: "modal" }}
                />
                <Stack.Screen
                  name="transfer-domain"
                  options={{ presentation: "modal" }}
                />
                <Stack.Screen
                  name="loan-domain"
                  options={{ presentation: "modal" }}
                />
              </Stack>
              <RecordDetailsSheet />
              <TransactionDetailsSheet />
              <PayDomainSheet />
              <MapDirectionsPopUp />
              <BuyWithRecordsSheet />
              <QrSheet />
              <BuySheet />
              <ActionsSheet />
              <ConfettiAnimation />
            </ToastProvider>
          </GestureHandlerRootView>
        </TamaguiProvider>
      </ThirdwebProvider>
    </KeyboardProvider>
  );
}
