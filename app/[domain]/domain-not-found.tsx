import { Stack, useRouter, useLocalSearchParams } from "expo-router";
import { Container } from "@/components/Container";
import { CardContainer } from "@/components/CardContainer";
import { ScrollContent } from "@/components/ScrollContent";
import { OptionContainer } from "@/components/OptionContainer";
import { useTheme, YStack } from "tamagui";
import { ThemedText } from "@/components/ThemedText";
import { ModalHeader } from "@/components/ModalHeader";

export default function DomainNotFound() {
  const { domain } = useLocalSearchParams() as { domain: string };
  const theme = useTheme();
  const color = theme.color.get();
  const router = useRouter();
  return (
    <Container>
      <Stack.Screen
        options={{
          title: "Oops!",
          headerShown: true,
          headerTransparent: true,
          headerTitleAlign: "center",
          headerTitleStyle: { color: color },
          headerTintColor: color,
        }}
      />
      <ScrollContent>
        <ModalHeader defaultIcon="notFound" domain={domain} />
        <CardContainer>
          <ThemedText type="subtitle">This domain doesn't exist.</ThemedText>
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
