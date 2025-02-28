import { View } from "tamagui";
import { ThemedText } from "@/components/ThemedText";
import { shortenAddress } from "thirdweb/utils";
import { useTransactionDetailsStore } from "@/store/transactionDetailsStore";
import { fromUnixTime } from "date-fns";
import { TransactionInfoCard } from "@/components/TransactionInfoCard";

export function UpdateUserTransactionItem({ event }: { event: any }) {
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

  return (
    <TransactionInfoCard
      onPress={onPress}
      icon="loanDomain"
      title="Domain Loaned"
    >
      <View gap="$1.5">
        <ThemedText type="info">
          {`Loaned to: `}
          <ThemedText>{shortenAddress(event.args.user)} </ThemedText>
        </ThemedText>
        <ThemedText type="info">
          {`Expiry: `}
          <ThemedText>
            {`${fromUnixTime(Number(event.args.expires))}`}
          </ThemedText>
        </ThemedText>
      </View>
    </TransactionInfoCard>
  );
}
