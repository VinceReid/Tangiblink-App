import { useRef } from "react";
import { FlashList } from "@shopify/flash-list";
import { YStack, Separator, View, Spinner } from "tamagui";
import { ThemedText } from "@/components/ThemedText";
import { TransferTransactionItem } from "@/components/TransferTransactionItem";
import { DomainPaymentsTransactionItem } from "@/components/DomainPaymentsTransactionItem";
import { UpdateUserTransactionItem } from "@/components/UpdateUserTransactionItem";
import { SetRecordTransactionItem } from "@/components/SetRecordTransactionItem";

// TransactionFlashList props
type TransactionFlashListProps = {
  isLoading: boolean;
  events: any;
  type: "payments" | "transfers" | "loans" | "records";
  showDomain?: boolean;
};

export function TransactionFlashList({
  isLoading,
  events,
  type,
  showDomain,
}: TransactionFlashListProps) {
  const flashListRef = useRef<FlashList<any>>(null);

  return (
    <FlashList
      ref={flashListRef}
      initialScrollIndex={0}
      data={events}
      renderItem={({ item }) => {
        return type === "payments" ? (
          <DomainPaymentsTransactionItem event={item} showDomain={showDomain} />
        ) : type === "transfers" ? (
          <TransferTransactionItem event={item} showDomain={showDomain} />
        ) : type === "loans" ? (
          <UpdateUserTransactionItem event={item} />
        ) : type === "records" ? (
          <SetRecordTransactionItem event={item} />
        ) : null;
      }}
      estimatedItemSize={50}
      ItemSeparatorComponent={() => <Separator themeInverse />}
      ListHeaderComponent={() => <Separator themeInverse />}
      ListFooterComponent={() => <Separator themeInverse />}
      ListEmptyComponent={
        <>
          <YStack br="$5" p="$2" mih={50}>
            <View ai={"center"}>
              <ThemedText type="subtitle">
                {isLoading ? "Loading..." : "No transactions found"}
              </ThemedText>
              {isLoading && <Spinner m={"$2"} />}
            </View>
          </YStack>
          <Separator themeInverse />
        </>
      }
    />
  );
}
