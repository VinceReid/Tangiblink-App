import { View } from "tamagui";
import { ThemedText } from "@/components/ThemedText";
import { useTransactionDetailsStore } from "@/store/transactionDetailsStore";
import { TransactionInfoCard } from "@/components/TransactionInfoCard";

export function SetRecordTransactionItem({ event }: { event: any }) {
  const setEventDetails = useTransactionDetailsStore(
    (state) => state.setEventDetails
  );
  const setTransactionDetailsSheetOpen = useTransactionDetailsStore(
    (state) => state.setTransactionDetailsSheetOpen
  );
  const onPress = () => {
    setEventDetails(event);
    setTransactionDetailsSheetOpen(true);
  };
  return event.eventName === "Set" ? (
    <TransactionInfoCard onPress={onPress} icon="addRecord" title="Set Record">
      <View gap="$1.5">
        <ThemedText type="subtitle">Set record</ThemedText>
        <ThemedText type="info">
          {`Key: `}
          <ThemedText>{event.args.key}</ThemedText>
        </ThemedText>
        <ThemedText type="info">
          {`Value: `}
          <ThemedText>{event.args.value} </ThemedText>
        </ThemedText>
      </View>
    </TransactionInfoCard>
  ) : (
    <TransactionInfoCard
      onPress={onPress}
      icon="deleteRecord"
      title="Reset Record"
    >
      <View gap="$1.5">
        <ThemedText>All records deleted</ThemedText>
      </View>
    </TransactionInfoCard>
  );
}
