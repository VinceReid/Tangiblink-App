import { useRouter } from "expo-router";
import { XStack, YStack, Image } from "tamagui";
import useContractData, { type DomainInfo } from "@/hooks/useContractData";
import { ThemedText } from "@/components/ThemedText";
import {
  shortenedPlusCodeToTokenId,
  plusCodeToTokenId,
} from "@/utils/plusCodeToTokenId";
import { openSeaUrl } from "@/constants/thirdweb";
import { ExternalLinkOnPress } from "@/components/ExternalLink";

export const DomainInformation = ({
  domain,
  domainInfo,
}: {
  domain: string;
  domainInfo?: DomainInfo;
}) => {
  const router = useRouter();
  const owner = domainInfo?.owner;
  const user = domainInfo?.user;
  const isLoaned = domainInfo?.isLoaned;
  const shortenedTokenId = shortenedPlusCodeToTokenId(domain);
  const tokenId = plusCodeToTokenId(domain);

  // Function to open open sea external link
  function openOpenSea() {
    const url = `${openSeaUrl}${tokenId}`;
    ExternalLinkOnPress(`${openSeaUrl}${tokenId}`);
  }
  return (
    <YStack gap="$2">
      <YStack
        onPress={() => router.navigate(`/account/${owner}`)}
        br="$5"
        bw={1}
        boc={"$accentColor"}
        p="$2"
        m="$1"
      >
        <ThemedText type="subtitle">Owner:</ThemedText>
        <ThemedText type="subtext">{owner}</ThemedText>
      </YStack>
      {isLoaned && (
        <YStack
          onPress={() => router.navigate(`/account/${user}`)}
          br="$5"
          bw={1}
          boc={"$accentColor"}
          p="$2"
          m="$1"
        >
          <ThemedText type="subtitle">Loaned to:</ThemedText>
          <ThemedText type="subtext">{user}</ThemedText>
        </YStack>
      )}
      <XStack
        gap="$2"
        justifyContent="space-between"
        alignItems="center"
        onPress={openOpenSea}
        br="$5"
        bw={1}
        boc={"$accentColor"}
        p="$2"
        m="$1"
      >
        <YStack>
          <ThemedText type="subtitle">Token ID:</ThemedText>
          <ThemedText type="subtext">{shortenedTokenId}</ThemedText>
        </YStack>
        <XStack gap="$2" mr="$2">
          <ThemedText type="subtitle">OpenSea</ThemedText>
          <Image
            source={require("@/assets/images/opensea.png")}
            style={{ width: 40, height: 40 }}
          />
        </XStack>
      </XStack>
    </YStack>
  );
};
