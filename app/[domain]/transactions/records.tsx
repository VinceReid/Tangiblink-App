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

export default function Records() {
  const { domain } = useLocalSearchParams() as { domain: string };
  const theme = useTheme();
  const color = theme.color.get();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState<any[]>([]);
  const { domainsArray, setAndResetRecordsEvents } = useContractData();
  const tokenId = plusCodeToTokenId(domain);
  useEffect(() => {
    if (setAndResetRecordsEvents.data) {
      setLoading(false);
      const newRecords = setAndResetRecordsEvents.data
        ?.reverse()
        .filter((event: any) => {
          return event.args.tokenId === tokenId;
        });
      // Check if new records have been added
      if (newRecords.length > records.length) {
        setRecords(newRecords);
      }
    }
  }, [setAndResetRecordsEvents]);

  return !domainsArray.data?.includes(domain) ? (
    router.replace(`/${domain}/domain-not-found`)
  ) : (
    <Container>
      <Stack.Screen
        options={{
          title: "Records history",
          headerShown: true,
          headerTransparent: true,
          headerTitleAlign: "center",
          headerTitleStyle: { color: color },
          headerTintColor: color,
        }}
      />
      <Content>
        <ModalHeader defaultIcon="recordTransactions" domain={domain} history />
        <ThemedText type="subtitle">Set/Reset records transactions</ThemedText>
        <ThemedText type="subtext">
          Select a transaction to view more details.
        </ThemedText>
        <Separator />
        <TransactionFlashList
          isLoading={loading}
          events={records}
          type="records"
        />
      </Content>
    </Container>
  );
}
