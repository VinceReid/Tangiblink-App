import { Stack, router } from "expo-router";
import LottieView from "lottie-react-native";
import { OnboardingContainer } from "@/components/Container";
import React, { useState } from "react";
import { StyleSheet, Pressable } from "react-native";
import { XStack, View, YStack, Text } from "tamagui";
import { ConnectWalletButton } from "@/components/ConnectWallet";
import { useActiveAccount } from "thirdweb/react";
import { StatusBar } from "expo-status-bar";
import {
  GestureDetector,
  Gesture,
  Directions,
} from "react-native-gesture-handler";
import { useAppSettings } from "@/store/settingsStore";

import Animated, {
  FadeIn,
  FadeOut,
  SlideOutLeft,
  SlideInRight,
} from "react-native-reanimated";

const onboardingSteps = [
  {
    animation: require("@/assets/lottie/logoSpin.json"),
    title: "Welcome to Tangiblink",
    loop: false,
    description: `Crypto domains by location.`,
  },
  {
    animation: require("@/assets/lottie/logoSpin.json"),
    title: "Trust in your location",
    loop: false,
    description: `Customers can trust your location with a Tangiblink domain and be sure they are sending payments to the right place.`,
  },
  {
    animation: require("@/assets/lottie/map-pinned-orange-animated.json"),
    title: "Explore domains",
    loop: false,
    description: "Head to the map to explore or purchase domains.",
  },
  {
    animation: require("@/assets/lottie/hand-coins-animation.json"),
    title: "Send payments",
    loop: false,
    description: `Make crypto payments to a location using a domain. \nOr receive payments from others to your domain.`,
  },
  {
    animation: require("@/assets/lottie/map-marker-square-plus-animation.json"),
    title: "Buy a domain",
    loop: false,
    description: `Buy a domain to create a link between your wallet and a location of your choice. \nReceive payments to your domain!`,
  },
  {
    animation: require("@/assets/lottie/polygon-matic-logo-animation.json"),
    title: "100% Ownership!",
    loop: false,
    description: `Each domain is a unique NFTs on the Polygon blockchain and can be traded or sold on platforms such as OpenSea.`,
  },
  {
    animation: require("@/assets/lottie/thirdweb.json"),
    title: "Integrated wallet",
    description: `Your wallet and transactions are managed securely by Thirdweb. \n500+ wallet providers supported! \nDon't have a wallet yet? Create one using your social login! \nEmail, phone, social, and passkey options.`,
    loop: false,
  },
  {
    animation: require("@/assets/lottie/wallet-animation.json"),
    title: "Login to Tangiblink",
    titleConnected: "Connected to Tangiblink",
    loop: false,
    description: `Purchase a domain, view your domains, send and receive payments. \n`,
    descriptionConnected: `You are now connected to Tangiblink. \nPurchase a domain, view your domains, send and receive payments. \n`,
    connect: true,
  },
];

export default function OnboardingScreen() {
  const setOnboarding = useAppSettings((state) => state.setOnboarding);
  const [screenIndex, setScreenIndex] = useState(0);
  const data = onboardingSteps[screenIndex];
  const account = useActiveAccount();

  function onContinue() {
    const isLastScreen = screenIndex === onboardingSteps.length - 1;
    if (isLastScreen) {
      endOnboarding();
    } else {
      setScreenIndex(screenIndex + 1);
    }
  }

  function onBack() {
    const isFirstScreen = screenIndex === 0;
    if (isFirstScreen) {
      endOnboarding();
    } else {
      setScreenIndex(screenIndex - 1);
    }
  }

  function endOnboarding() {
    setScreenIndex(0);
    setOnboarding();
    router.navigate("/(tabs)");
  }

  const swipes = Gesture.Simultaneous(
    Gesture.Fling().runOnJS(true).direction(Directions.RIGHT).onStart(onBack),
    Gesture.Fling().runOnJS(true).direction(Directions.LEFT).onStart(onContinue)
  );
  return (
    <OnboardingContainer>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar style="light" />
      <XStack gap="$2" mx="$3.5">
        {onboardingSteps.map((step, index) => (
          <View
            key={index}
            flex={1}
            h="$0.5"
            bg={index === screenIndex ? "$color10" : "gray"}
            br="$5"
          />
        ))}
      </XStack>

      <GestureDetector gesture={swipes}>
        <YStack p="$4.5" f={1} key={screenIndex}>
          <View mt="auto">
            <Animated.View entering={FadeIn} exiting={FadeOut}>
              <LottieView
                source={data.animation}
                style={{
                  width: "100%",
                  height: "100%",
                  pointerEvents: "none",
                  alignSelf: "center",
                  margin: 20,
                  marginTop: 10,
                }}
                autoPlay
                loop={data.loop}
              />
            </Animated.View>
          </View>
          <View mt="auto">
            <Animated.Text
              entering={SlideInRight}
              exiting={SlideOutLeft}
              style={styles.title}
            >
              {data.connect && !account && data.title}
              {data.connect && account && data.titleConnected}
              {!data.connect && data.title}
            </Animated.Text>
            <Animated.Text
              entering={SlideInRight.delay(50)}
              exiting={SlideOutLeft}
              style={styles.description}
            >
              {data.connect && !account && data.description}
              {data.connect && account && data.descriptionConnected}
              {!data.connect && data.description}
            </Animated.Text>
            {data.connect && !account && <ConnectWalletButton />}
            <XStack mt="$4.5" ai={"center"} gap="$4.5">
              <Text onPress={endOnboarding} style={styles.buttonText}>
                Skip
              </Text>
              <Pressable onPress={onContinue} style={styles.button}>
                <Text style={styles.buttonText}>
                  {screenIndex === onboardingSteps.length - 1
                    ? data.connect && account ? "Enter App" : "Finish"
                    : "Continue"}
                </Text>
              </Pressable>
            </XStack>
          </View>
        </YStack>
      </GestureDetector>
    </OnboardingContainer>
  );
}

const styles = StyleSheet.create({
  page: {
    // alignItems: 'center',
    justifyContent: "center",
    flex: 1,
    backgroundColor: "#15141A",
  },
  pageContent: {
    padding: 20,
    flex: 1,
  },
  image: {
    alignSelf: "center",
    margin: 20,
    marginTop: 70,
  },
  title: {
    color: "#FDFDFD",
    fontSize: 50,
    fontFamily: "InterBlack",
    letterSpacing: 1.3,
    marginVertical: 10,
  },
  description: {
    color: "gray",
    fontSize: 20,
    fontFamily: "Inter",
    lineHeight: 28,
  },
  button: {
    backgroundColor: "#302E38",
    borderRadius: 50,
    alignItems: "center",
    flex: 1,
  },
  buttonText: {
    color: "#FDFDFD",
    fontFamily: "InterSemi",
    fontSize: 16,
    padding: 15,
    paddingHorizontal: 25,
  },
});
