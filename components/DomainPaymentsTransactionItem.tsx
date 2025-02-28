import { View } from "tamagui";
import { ThemedText } from "@/components/ThemedText";
import { toEther } from "thirdweb/utils";
import { chain } from "@/constants/thirdweb";
import { useTransactionDetailsStore } from "@/store/transactionDetailsStore";
import { TransactionInfoCard } from "@/components/TransactionInfoCard";

export function DomainPaymentsTransactionItem({
  event,
  showDomain,
}: {
  event: any;
  showDomain?: boolean;
}) {
  const domain = event.args.plusCode;
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
    <TransactionInfoCard onPress={onPress} icon="pay" title="Pay Domain">
      <View gap="$1.5">
        {showDomain && (
          <ThemedText type="info">
            {`Domain: `}
            <ThemedText>{domain}</ThemedText>
          </ThemedText>
        )}
        <ThemedText type="info">
          {`Amount: `}
          <ThemedText>
            {toEther(event.args.amount)}
            {chain.nativeCurrency?.symbol}
          </ThemedText>
        </ThemedText>
        <ThemedText type="info">
          {`-Fee: `}
          <ThemedText>
            {toEther(event.args.fee)} ${chain.nativeCurrency?.symbol}
          </ThemedText>
        </ThemedText>
        <ThemedText type="info">
          {`Total Paid: `}
          <ThemedText>
            {toEther(event.args.paid)} ${chain.nativeCurrency?.symbol}
          </ThemedText>
        </ThemedText>
        <ThemedText type="info">
          {`Reason: `}
          <ThemedText>{event.args.data || "No reason provided"}</ThemedText>
        </ThemedText>
      </View>
    </TransactionInfoCard>
  );
}
