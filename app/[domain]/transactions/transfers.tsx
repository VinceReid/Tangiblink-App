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

export default function Transfers() {
  const { domain } = useLocalSearchParams() as { domain: string };
  const theme = useTheme();
  const color = theme.color.get();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [transfersFiltered, setTransfersFiltered] = useState<any[]>([]);
  const { domainsArray, transfers, transfersLoading } = useContractData();
  const tokenId = plusCodeToTokenId(domain);
  useEffect(() => {
    if (transfers) {
      setLoading(false);
      const newTransfers = transfers?.reverse()?.filter((event) => {
        return event.args.tokenId === tokenId;
      });
      // Check if new transfers have been added
      if (newTransfers.length > transfersFiltered.length) {
        setTransfersFiltered(newTransfers);
      }
    }
  }, [transfers, transfersLoading]);
  return !domainsArray.data?.includes(domain) ? (
    router.replace(`/${domain}/domain-not-found`)
  ) : (
    <Container>
      <Stack.Screen
        options={{
          title: "Transfer history",
          headerShown: true,
          headerTransparent: true,
          headerTitleAlign: "center",
          headerTitleStyle: { color: color },
          headerTintColor: color,
        }}
      />
      <Content>
        <ModalHeader defaultIcon="transferDomain" domain={domain} history />
        <ThemedText type="subtitle">Transfers of domain ownership</ThemedText>
        <ThemedText type="subtext">
          Select a transaction to view more details.
        </ThemedText>
        <Separator />
        <TransactionFlashList
          isLoading={loading}
          events={transfersFiltered}
          type="transfers"
        />
      </Content>
    </Container>
  );
}
