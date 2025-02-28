import { Stack } from "expo-router";
import { Container } from "@/components/Container";
import {ScrollContent} from "@/components/ScrollContent";
import { useTheme, YStack } from "tamagui";
import { HelpAccordion } from "@/components/HelpAccordion";

export default function Help() {
  const theme = useTheme();
  const color = theme.color.get();

  return (
    <Container>
      <Stack.Screen
        options={{
          title: "Help",
          headerShown: true,
          headerTransparent: true,
          headerTitleAlign: "center",
          headerTitleStyle: { color: color },
          headerTintColor: color,
        }}
      />
      <ScrollContent>
        <YStack gap="$2" m="$2">
          <HelpAccordion />
        </YStack>
      </ScrollContent>
    </Container>
  );
}
