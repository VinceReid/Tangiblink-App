import { Container } from "@/components/Container";
import { Content } from "@/components/Content";
import { Spinner, YStack } from "tamagui";
import LottieView from "lottie-react-native";

import { ThemedText } from "@/components/ThemedText";

export function LoadingContent() {
  return (
    <Content>
      <YStack flex={1} justifyContent="center" alignItems="center" gap="$5">
        <LottieView
          source={require("@/assets/lottie/logoSpin.json")}
          style={{
            width: "80%",
            height: "80%",
            pointerEvents: "none",
            alignSelf: "center",
            margin: 20,
            marginTop: 10,
          }}
          autoPlay
        />
        <ThemedText type="title" >Loading...</ThemedText>
      </YStack>
    </Content>
  );
}
