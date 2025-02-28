import { Stack, useRouter, useLocalSearchParams } from "expo-router";
import { Container } from "@/components/Container";
import { ScrollContent } from "@/components/ScrollContent";
import { OptionContainer } from "@/components/OptionContainer";
import { useTheme, YStack } from "tamagui";
import useContractData from "@/hooks/useContractData";
import { ThemedText } from "@/components/ThemedText";
import { ModalHeader } from "@/components/ModalHeader";

export default function Transactions() {
  const { domain } = useLocalSearchParams() as { domain: string };
  const theme = useTheme();
  const color = theme.color.get();
  const router = useRouter();
  const { domainsArray } = useContractData();
  return !domainsArray.data?.includes(domain) ? (
    router.replace(`/${domain}/domain-not-found`)
  ) : (
    <Container>
      <Stack.Screen
        options={{
          title: "Transaction history",
          headerShown: true,
          headerTransparent: true,
          headerTitleAlign: "center",
          headerTitleStyle: { color: color },
          headerTintColor: color,
        }}
      />
      <ScrollContent>
        <ModalHeader defaultIcon="history" domain={domain} />
        <ThemedText type="subtitle">Transaction types</ThemedText>
        <ThemedText type="subtext">
          Select an option to view more details.
        </ThemedText>
        <YStack f={1} gap="$2">
          <OptionContainer
            icon="transferDomain"
            title="Transfer history"
            onPress={() => {
              router.navigate(`/${domain}/transactions/transfers`);
            }}
          />
          <OptionContainer
            icon="recordTransactions"
            title="Records history"
            onPress={() => {
              router.navigate(`/${domain}/transactions/records`);
            }}
          />
          <OptionContainer
            icon="pay"
            title="Domain Payment history"
            onPress={() => {
              router.navigate(`/${domain}/transactions/payments`);
            }}
          />
          <OptionContainer
            icon="loanDomain"
            title="Loan history"
            onPress={() => {
              router.navigate(`/${domain}/transactions/loans`);
            }}
          />
        </YStack>
      </ScrollContent>
    </Container>
  );
}
