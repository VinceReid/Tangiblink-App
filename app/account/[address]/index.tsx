import { Stack, useRouter, useLocalSearchParams } from "expo-router";
import { Container } from "@/components/Container";
import { Content } from "@/components/Content";
import { useTheme, YStack } from "tamagui";
import { ThemedText } from "@/components/ThemedText";
import { ModalHeader } from "@/components/ModalHeader";
import { AccountDomainsFlashList } from "@/components/AccountDomainsFlashList";
import { SocialSection } from "@/components/SocialProfiles";

export default function AccountDomains() {
  const { address } = useLocalSearchParams() as { address: string };
  const router = useRouter();
  const theme = useTheme();
  const color = theme.color.get();

  return !address ? (
    router.replace(`/+not-found`)
  ) : (
    <Container>
      <Stack.Screen
        options={{
          // title: "Account domains",
          headerTitle: () => (
            <ModalHeader defaultIcon="accountDomains" account={address} />
          ),
          headerShown: true,
          headerTransparent: true,
          headerTitleAlign: "center",
          headerTitleStyle: { color: color },
          headerTintColor: color,
        }}
      />
      <Content>
        <YStack gap="$2" f={1}>
          <SocialSection address={address} />
          <ThemedText type="subtitle" >Account domains</ThemedText>
          <ThemedText type="subtext">Select a domain to view</ThemedText>
          <AccountDomainsFlashList address={address} />
        </YStack>
      </Content>
    </Container>
  );
}
