import { View } from "tamagui";
import { ThemedText } from "@/components/ThemedText";
import { ZERO_ADDRESS } from "thirdweb";
import { shortenAddress } from "thirdweb/utils";
import { useTransactionDetailsStore } from "@/store/transactionDetailsStore";
import useContractData from "@/hooks/useContractData";
import { TransactionInfoCard } from "@/components/TransactionInfoCard";

export function TransferTransactionItem({
  event,
  showDomain,
}: {
  event: any;
  showDomain?: boolean;
}) {
  const { findIndexOfTokenId, findDomainByIndex } = useContractData();
  const setEventDetails = useTransactionDetailsStore(
    (state) => state.setEventDetails
  );
  const setTransactionDetailsSheetOpen = useTransactionDetailsStore(
    (state) => state.setTransactionDetailsSheetOpen
  );
  const minted = event.args.from === ZERO_ADDRESS;
  const index = findIndexOfTokenId(event.args.tokenId);
  const domain = findDomainByIndex(index ?? 0);
  const onPress = () => {
    setEventDetails(event);
    setTransactionDetailsSheetOpen(true);
  };
  return (
    <TransactionInfoCard
      onPress={onPress}
      icon={minted ? "minted" : "transactions"}
      title={minted ? "Minted" : "Transferred"}
    >
      <View gap="$1.5">
        {showDomain && (
          <ThemedText type="info">
            {`Domain: `}
            <ThemedText>{domain}</ThemedText>
          </ThemedText>
        )}
        {!minted && (
          <ThemedText type="info">
            {`From: `}
            <ThemedText>{shortenAddress(event.args.from)}</ThemedText>
          </ThemedText>
        )}
        <ThemedText type="info">
          {`To: `}
          <ThemedText>{shortenAddress(event.args.to)}</ThemedText>
        </ThemedText>
      </View>
    </TransactionInfoCard>
  );
}
