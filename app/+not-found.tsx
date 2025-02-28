import { Link, Stack } from "expo-router";
import { YStack } from "tamagui";
import { ThemedText } from "@/components/ThemedText";
import { Container } from "@/components/Container";
import { Content } from "@/components/Content";
import { useTheme } from "tamagui";
import { ModalHeader } from "@/components/ModalHeader";

export default function NotFoundScreen() {
  const theme = useTheme();
  const color = theme.color.get();
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
      <Content>
        <ModalHeader defaultIcon="notFound" title="Not Found" />
        <YStack gap="$2">
          <ThemedText type="subtitle">This screen doesn't exist.</ThemedText>
          <Link href="/">
            <ThemedText type="link">Go to home screen!</ThemedText>
          </Link>
        </YStack>
      </Content>
    </Container>
  );
}
