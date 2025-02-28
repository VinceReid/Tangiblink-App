import { Stack, useRouter } from "expo-router";
import { Container } from "@/components/Container";
import { CardContainer } from "@/components/CardContainer";
import { ScrollContent } from "@/components/ScrollContent";
import { OptionContainer } from "@/components/OptionContainer";
import { useTheme, Separator, YStack } from "tamagui";
import { ThemedText } from "@/components/ThemedText";
import { ModalHeader } from "@/components/ModalHeader";

export default function NotAuthorized() {
  const theme = useTheme();
  const color = theme.color.get();
  const router = useRouter();
  return (
    <Container>
      <Stack.Screen
        options={{
          title: "Not authorized!",
          headerShown: true,
          headerTransparent: true,
          headerTitleAlign: "center",
          headerTitleStyle: { color: color },
          headerTintColor: color,
        }}
      />
      <ScrollContent>
        <ModalHeader defaultIcon="unauthorized" title="Not Authorized" />
        <Separator />
        <CardContainer>
          <ThemedText type="subtitle">
            You are not Authorized to view this content. Please login or return.
          </ThemedText>
        </CardContainer>
        <YStack f={1} gap="$2">
          <OptionContainer
            icon="account"
            title="Go to account"
            onPress={() => {
              router.replace("/");
            }}
          />
          <OptionContainer
            icon="map"
            title="Go to map"
            onPress={() => {
              router.replace("/(tabs)/map");
            }}
          />
        </YStack>
      </ScrollContent>
    </Container>
  );
}
