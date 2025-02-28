import { router } from "expo-router";
import { useRef } from "react";
import { FlashList } from "@shopify/flash-list";
import { YStack, Separator, XStack, Spinner } from "tamagui";
import useContractData from "@/hooks/useContractData";
import { useTransferDomainStore } from "@/store/transferDomainStore";
import { ThemedText } from "@/components/ThemedText";
import { shortenAddress } from "thirdweb/utils";
import { Image } from "react-native";

export const AccountDomainsFlashList = ({ address }: { address: string }) => {
  const flashListRef = useRef<FlashList<any>>(null);
  const { domainInfoLoading, getAccountDomains } = useContractData();
  const accountDomains = getAccountDomains(address);

  return (
    <FlashList
      ref={flashListRef}
      initialScrollIndex={0}
      data={accountDomains}
      renderItem={({ item }) => (
        <AccountDomainItem item={item} address={address} />
      )}
      estimatedItemSize={50}
      ListEmptyComponent={
        <>
          <YStack p="$2" mb="$1" mih={50} ai={"center"}>
            <ThemedText type="subtitle">
              {domainInfoLoading
                ? "Loading..."
                : `No domains found. \nHead to the map to purchase a domain!`}
            </ThemedText>
            {domainInfoLoading && <Spinner m={"$2"} />}
          </YStack>
          <Separator themeInverse />
        </>
      }
    />
  );
};

export const AccountDomainItem = ({
  item,
  address,
}: {
  item: any;
  address: string;
}) => {
  const domainsPendingTransfer = useTransferDomainStore(
    (state) => state.domainsPendingTransfer
  );
  const pendingTransfer = domainsPendingTransfer.includes(item.domain);
  return (
    <YStack
      br="$5"
      bw={1}
      boc={"$accentColor"}
      p="$2"
      mb="$1"
      mih={50}
      onPress={() => {
        !pendingTransfer && router.navigate(`/${item.domain}`);
      }}
    >
      <XStack gap="$4" alignItems="center">
        <Image
          source={require("@/assets/images/logoIcon.png")}
          style={{ width: 50, height: 50 }}
        />
        <YStack gap="$1.5">
          <ThemedText type="info">Domain:</ThemedText>
          <ThemedText type="defaultSemiBold">{item.domain}</ThemedText>
          {item.owner.toLowerCase() !== address.toLowerCase() && (
            <ThemedText type="subtext">
              {`Loaned from: ${shortenAddress(item.owner)}`}
            </ThemedText>
          )}
          {item.isLoaned &&
            item.owner.toLowerCase() === address.toLowerCase() && (
              <ThemedText type="subtext">
                {`Loaned to: ${shortenAddress(item.user)}`}
              </ThemedText>
            )}
          {pendingTransfer && (
            <ThemedText type="subtext">
              Pending transfer of ownership!
            </ThemedText>
          )}
        </YStack>
      </XStack>
    </YStack>
  );
};
