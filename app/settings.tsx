import { Stack, useRouter } from "expo-router";
import { Container } from "@/components/Container";
import { useTheme, XStack, YStack, Label, Separator, Switch } from "tamagui";
import { useAppSettings } from "@/store/settingsStore";
import { OptionContainer } from "@/components/OptionContainer";
import { ExternalLinkOnPress } from "@/components/ExternalLink";
import { github } from "@/constants/externalLinks";
import { chain, contract } from "@/constants/thirdweb";
import { ModalHeader } from "@/components/ModalHeader";
import { ScrollContent } from "@/components/ScrollContent";
import * as Application from "expo-application";
import React from "react";
import { useLocationPermissionStore } from "@/components/LocationPermissionRequest";

export default function Settings() {
  const version = Application?.nativeBuildVersion ?? "0.1.0";
  const router = useRouter();
  const theme = useTheme();
  const color = theme.color.get();
  const setLocation = useLocationPermissionStore((state) => state.setLocation);
  const locationPermission = useAppSettings(
    (state) => state.locationPermission
  );
  const cameraPermission = useAppSettings((state) => state.cameraPermission);
  const onboarding = useAppSettings((state) => state.onboarding);
  const setLocationPermission = useAppSettings(
    (state) => state.setLocationPermission
  );
  const setCameraPermission = useAppSettings(
    (state) => state.setCameraPermission
  );
  const setOnboarding = useAppSettings((state) => state.setOnboarding);

  function switchLocationPermissions(checked: boolean) {
    if (!checked) {
      setLocation(null);
    }
    setLocationPermission();
  }

  return (
    <Container>
      <Stack.Screen
        options={{
          title: "Tangiblink",
          headerShown: true,
          headerTransparent: true,
          headerTitleAlign: "center",
          headerTitleStyle: { color: color },
          headerTintColor: color,
        }}
      />
      <ScrollContent>
        <YStack gap="$2" m="$2">
          <ModalHeader defaultIcon="settings" title="Setting" />
          <XStack alignItems="center" gap="$4">
            <Switch
              id={"switch-location-permissions-denied"}
              size={"$2"}
              checked={locationPermission}
              onCheckedChange={switchLocationPermissions}
            >
              <Switch.Thumb animation="quick" bg="$accentColor" />
            </Switch>
            <Separator minHeight={20} vertical />
            <Label
              paddingRight="$0"
              justifyContent="flex-end"
              size={"$4"}
              htmlFor={"switch-location-permissions-denied"}
            >
              Location Permission
            </Label>
          </XStack>
          <XStack alignItems="center" gap="$4">
            <Switch
              id={"switch-camera-permissions-denied"}
              size={"$2"}
              checked={cameraPermission}
              onCheckedChange={setCameraPermission}
            >
              <Switch.Thumb animation="quick" bg="$accentColor" />
            </Switch>
            <Separator minHeight={20} vertical />
            <Label
              paddingRight="$0"
              justifyContent="flex-end"
              size={"$4"}
              htmlFor={"switch-camera-permissions-denied"}
            >
              Camera Permission
            </Label>
          </XStack>
          <XStack alignItems="center" gap="$4">
            <Switch
              id={"switch-onboarding"}
              size={"$2"}
              checked={!onboarding}
              onCheckedChange={setOnboarding}
            >
              <Switch.Thumb animation="quick" bg="$accentColor" />
            </Switch>
            <Separator minHeight={20} vertical />
            <Label
              paddingRight="$0"
              justifyContent="flex-end"
              size={"$4"}
              htmlFor={"switch-onboarding"}
            >
              Enable onboarding on next app launch
            </Label>
          </XStack>
          <Separator />
          <ModalHeader defaultIcon="info" title="App info" />
          <YStack gap="$2">
            <Label size="$4">Version: {version}</Label>
          </YStack>
          <OptionContainer
            icon="help"
            title="Help topics"
            onPress={() => {
              router.navigate(`/help`);
            }}
          />
          <OptionContainer
            icon="info"
            title="About Tangiblink"
            onPress={() => {
              router.navigate(`/about`);
            }}
          />
          <OptionContainer
            icon="policies"
            title="Terms and conditions"
            onPress={() => {
              router.navigate(`/policies`);
            }}
          />
          <OptionContainer
            icon="github"
            title="Developer"
            subtitle="Smart contract on GitHub"
            onPress={() => ExternalLinkOnPress(github)}
          />
          <OptionContainer
            icon="blockExplorer"
            title="PolygonScan"
            subtitle="Polygon Block explorer"
            onPress={() => {
              ExternalLinkOnPress(
                `${chain.blockExplorers?.[0]?.url}/address/${contract.address}`
              );
            }}
          />
        </YStack>
      </ScrollContent>
    </Container>
  );
}
