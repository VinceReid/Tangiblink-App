import { Stack, useRouter, useLocalSearchParams } from "expo-router";
import { Container } from "@/components/Container";
import { Content } from "@/components/Content";
import { useTheme, Separator } from "tamagui";
import useContractData from "@/hooks/useContractData";
import { ThemedText } from "@/components/ThemedText";
import { ZERO_ADDRESS } from "thirdweb";
import { plusCodeToTokenId } from "@/utils/plusCodeToTokenId";
import { ModalHeader } from "@/components/ModalHeader";
import { TransactionFlashList } from "@/components/TransactionFlashList";
import React, { useEffect, useState } from "react";

export default function Loans() {
  // Make sure to set the domain in the store before navigating to this page
  const { domain } = useLocalSearchParams() as { domain: string };
  const theme = useTheme();
  const color = theme.color.get();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [loans, setLoans] = useState<any[]>([]);
  const { domainsArray, updateUserEvents } = useContractData();
  const tokenId = plusCodeToTokenId(domain);
  useEffect(() => {
    if (updateUserEvents.data) {
      setLoading(false);
      const newLoans = updateUserEvents.data?.reverse().filter((event: any) => {
        return (
          event.args.tokenId === tokenId && event.args.user !== ZERO_ADDRESS
        );
      });
      // Check if new loans have been added
      if (newLoans.length > loans.length) {
        setLoans(newLoans);
      }
    }
  }, [updateUserEvents]);

  return !domainsArray.data?.includes(domain) ? (
    router.replace(`/${domain}/domain-not-found`)
  ) : (
    <Container>
      <Stack.Screen
        options={{
          title: "Loan history",
          headerShown: true,
          headerTransparent: true,
          headerTitleAlign: "center",
          headerTitleStyle: { color: color },
          headerTintColor: color,
        }}
      />
      <Content>
        <ModalHeader defaultIcon="loanDomain" domain={domain} history />
        <ThemedText type="subtitle">Domain loan transactions</ThemedText>
        <ThemedText type="subtext">
          Select a transaction to view more details.
        </ThemedText>
        <Separator />
        <TransactionFlashList isLoading={loading} events={loans} type="loans" />
      </Content>
    </Container>
  );
}
