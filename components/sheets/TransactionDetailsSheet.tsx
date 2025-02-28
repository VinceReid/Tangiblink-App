import { chain } from "@/constants/thirdweb";
import { Sheet } from "@tamagui/sheet";
import { View, YStack, XStack, Separator, ScrollView, Theme } from "tamagui";
import useContractData from "@/hooks/useContractData";
import { ThemedText } from "@/components/ThemedText";
import { useTransactionDetailsStore } from "@/store/transactionDetailsStore";
import { ThemedButton } from "@/components/ThemedButton";
import { BackHandler } from "react-native";
import { getBlockTime } from "@/utils/getBlockTime";
import { fromUnixTime } from "date-fns";
import { router } from "expo-router";
import { SheetHeader } from "@/components/SheetHeader";
import React, { useState, useEffect } from "react";
import { Copy } from "../ClipboardCopyPaste";
import { ExternalLinkOnPress } from "@/components/ExternalLink";

export const TransactionDetailsSheet = () => {
  // Destructuring the store
  const transactionDetailsSheetOpen = useTransactionDetailsStore(
    (state) => state.transactionDetailsSheetOpen
  );
  const setTransactionDetailsSheetOpen = useTransactionDetailsStore(
    (state) => state.setTransactionDetailsSheetOpen
  );
  const transactionDetailsDomain = useTransactionDetailsStore(
    (state) => state.transactionDetailsDomain
  );
  const eventDetails = useTransactionDetailsStore(
    (state) => state.eventDetails
  );

  const [position, setPosition] = useState(0);
  const { findIndexOfTokenId, findDomainByIndex } = useContractData();
  const [blockTime, setBlockTime] = useState<string | null>(null);

  useEffect(() => {
    if (!eventDetails) return;
    async function fetchBlockTime() {
      const time = await getBlockTime({
        blockNumber: eventDetails.blockNumber,
      });
      setBlockTime(time);
    }
    fetchBlockTime();
  }, [eventDetails]);

  useEffect(() => {
    const onBackPress = () => {
      if (transactionDetailsSheetOpen) {
        setTransactionDetailsSheetOpen(false);
        return true;
      }
      router.back();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      onBackPress
    );

    return () => backHandler.remove();
  }, [transactionDetailsSheetOpen]);

  //   gets the domain of the transaction
  const domain = () => {
    if (!eventDetails.args.tokenId) return null;
    const tokenId = eventDetails.args.tokenId;
    const index = findIndexOfTokenId(tokenId);
    if (index === -1 || !index) return null;
    return findDomainByIndex(index);
  };

  return (
    <Sheet
      forceRemoveScrollEnabled={transactionDetailsSheetOpen}
      open={transactionDetailsSheetOpen}
      onOpenChange={setTransactionDetailsSheetOpen}
      snapPointsMode={"percent"}
      snapPoints={[90, 50]}
      dismissOnSnapToBottom
      position={position}
      onPositionChange={setPosition}
      zIndex={100_000}
    >
      <Sheet.Overlay
        animation="lazy"
        enterStyle={{ opacity: 0 }}
        exitStyle={{ opacity: 0 }}
      />
      <Sheet.Handle bg={"$color"} />
      <Sheet.Frame padding="$2" justifyContent="center" gap="$5">
        {eventDetails ? (
          <YStack f={1} p="$1" pb="$5" gap="$3.5" ov={"hidden"}>
            <SheetHeader
              title="Transaction details"
              defaultIcon="info"
              domain={transactionDetailsDomain}
            />
            <ScrollView>
              <Theme name={"accent"}>
                <View br={"$5"} bw={1} bg={"$gray5Dark"} gap="$1" p={"$3"}>
                  <ThemedText type="subtext">Date:</ThemedText>
                  <ThemedText type="default">
                    {blockTime ?? "loading..."}
                  </ThemedText>
                  <Separator />
                  <XStack gap="$2" alignItems="center">
                    <ThemedText type="subtext">Transaction hash:</ThemedText>
                    <Copy type="any" value={eventDetails.transactionHash} />
                  </XStack>
                  <ThemedText type="default">
                    {eventDetails.transactionHash}
                  </ThemedText>
                  <Separator />
                  {Object.keys(eventDetails.args).map((key) => (
                    <React.Fragment key={key}>
                      <XStack gap="$2" alignItems="center">
                        <ThemedText type="subtext">{key}:</ThemedText>
                        <Copy
                          type={
                            key === "to" || "from" || "user" || "address"
                              ? "address"
                              : key === "pluscode"
                              ? "domain"
                              : "any"
                          }
                          value={eventDetails.args[key].toString()}
                        />
                      </XStack>
                      <ThemedText type="default">
                        {key === "expires"
                          ? fromUnixTime(
                              Number(eventDetails.args[key])
                            ).toString()
                          : eventDetails.args[key].toString()}
                      </ThemedText>
                      <Separator />
                      {key === "tokenId" ? (
                        <React.Fragment>
                          <XStack gap="$2" alignItems="center">
                            <ThemedText type="subtext">Domain:</ThemedText>
                            <Copy type="domain" value={domain() ?? ""} />
                          </XStack>
                          <ThemedText type="default">{domain()}</ThemedText>
                          <Separator />
                        </React.Fragment>
                      ) : null}
                    </React.Fragment>
                  ))}
                </View>
              </Theme>
            </ScrollView>
            <ThemedButton
              title="View on block explorer"
              onPress={() =>
                ExternalLinkOnPress(
                  `${chain.blockExplorers?.[0]?.url}/tx/${eventDetails.transactionHash}`
                )
              }
            />
          </YStack>
        ) : (
          <ThemedText type="subtitle">No transaction details found</ThemedText>
        )}
      </Sheet.Frame>
    </Sheet>
  );
};
