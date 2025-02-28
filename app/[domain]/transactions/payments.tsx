import { Stack, useRouter, useLocalSearchParams } from "expo-router";
import { Container } from "@/components/Container";
import { Content } from "@/components/Content";
import { useTheme, Separator } from "tamagui";
import useContractData from "@/hooks/useContractData";
import { ThemedText } from "@/components/ThemedText";
import { plusCodeToTokenId } from "@/utils/plusCodeToTokenId";
import { ModalHeader } from "@/components/ModalHeader";
import { TransactionFlashList } from "@/components/TransactionFlashList";
import React, { useEffect, useState } from "react";

export default function Payments() {
  const { domain } = useLocalSearchParams() as { domain: string };
  const theme = useTheme();
  const color = theme.color.get();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState<any[]>([]);
  const { domainsArray, payDomainEvents } = useContractData();
  const tokenId = plusCodeToTokenId(domain);
  useEffect(() => {
    if (payDomainEvents.data) {
      setLoading(false);
      const newPayments = payDomainEvents.data
        ?.reverse()
        .filter((event: any) => {
          return event.args.tokenId === tokenId;
        });
      // Check if new payments have been added
      if (newPayments.length > payments.length) {
        setPayments(newPayments);
      }
    }
  }, [payDomainEvents]);

  return !domainsArray.data?.includes(domain) ? (
    router.replace(`/${domain}/domain-not-found`)
  ) : (
    <Container>
      <Stack.Screen
        options={{
          title: "Domain Payment history",
          headerShown: true,
          headerTransparent: true,
          headerTitleAlign: "center",
          headerTitleStyle: { color: color },
          headerTintColor: color,
        }}
      />
      <Content>
        <ModalHeader defaultIcon="pay" domain={domain} history />
        <ThemedText type="subtitle">Domain payment transactions</ThemedText>
        <ThemedText type="subtext">
          Select a transaction to view more details.
        </ThemedText>
        <Separator />
        <TransactionFlashList
          isLoading={loading}
          events={payments}
          type="payments"
        />
      </Content>
    </Container>
  );
}
