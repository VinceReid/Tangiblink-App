import { Stack, useRouter } from "expo-router";
import { Container } from "@/components/Container";
import { Content } from "@/components/Content";
import { ThemedText } from "@/components/ThemedText";
import {
  useTheme,
  XStack,
  YStack,
  Label,
  Separator,
  Switch,
  View,
} from "tamagui";
import { useState } from "react";
import Markdown from "react-native-markdown-display";
import { terms, privacyPolicy } from "@/constants/policies";
import { ScrollContent } from "@/components/ScrollContent";
import { Pressable } from "react-native";
import {
  GestureDetector,
  Gesture,
  Directions,
} from "react-native-gesture-handler";
export default function Terms() {
  const theme = useTheme();
  const color = theme.color.get();
  const [screenIndex, setScreenIndex] = useState(0);

  const Terms = () => {
    return <Markdown style={{ body: { color: color } }}>{terms}</Markdown>;
  };

  const PrivacyPolicy = () => {
    return (
      <Markdown style={{ body: { color: color } }}>{privacyPolicy}</Markdown>
    );
  };

  function onForward() {
    const isLastScreen = screenIndex === policyPages.length - 1;
    if (isLastScreen) {
      return;
    } else {
      setScreenIndex(screenIndex + 1);
    }
  }
  function onBack() {
    const isFirstScreen = screenIndex === 0;
    if (isFirstScreen) {
      return;
    } else {
      setScreenIndex(screenIndex - 1);
    }
  }

  const policyPages = [
    { step: "Terms and conditions", content: <Terms /> },
    { step: "Privacy policy", content: <PrivacyPolicy /> },
  ];
  const data = policyPages[screenIndex].content;

  const swipes = Gesture.Simultaneous(
    Gesture.Fling().runOnJS(true).direction(Directions.RIGHT).onStart(onBack),
    Gesture.Fling().runOnJS(true).direction(Directions.LEFT).onStart(onForward)
  );

  return (
    <Container>
      <Stack.Screen
        options={{
          title: "Policies",
          headerShown: true,
          headerTransparent: true,
          headerTitleAlign: "center",
          headerTitleStyle: { color: color },
          headerTintColor: color,
        }}
      />
      <ScrollContent>
        <YStack gap="$2" m="$2">
          <XStack gap="$2" mx="$3.5">
            {policyPages.map((item, index) => (
              <YStack f={1} key={index}>
                <Pressable onPress={() => setScreenIndex(index)}>
                  <YStack f={1} alignItems="center">
                    <ThemedText
                      type={index === screenIndex ? "subtext" : "default"}
                    >
                      {item.step}
                    </ThemedText>
                  </YStack>
                  <View
                    flex={1}
                    h="$0.5"
                    bg={index === screenIndex ? "$color10" : "gray"}
                    br="$5"
                  />
                </Pressable>
              </YStack>
            ))}
          </XStack>
          <GestureDetector gesture={swipes}>
            <YStack f={1} key={screenIndex}>
              {data}
            </YStack>
          </GestureDetector>
        </YStack>
      </ScrollContent>
    </Container>
  );
}
