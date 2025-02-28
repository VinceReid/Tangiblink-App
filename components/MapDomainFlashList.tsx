import { View, YStack, XStack, Spinner } from "tamagui";
import { ThemedText } from "@/components/ThemedText";
import useContractData from "@/hooks/useContractData";
import { FlashList } from "@shopify/flash-list";
import { shortenAddress } from "thirdweb/utils";
import { LucideIcon } from "@/components/LucideIcons";
import { ThemedButton } from "@/components/ThemedButton";
import { useEffect, useRef, useState } from "react";
import { useMapStore } from "@/store/mapStore";
import { useActionsSheetStore } from "@/store/actionsSheetStore";

interface DomainFlashListProps {
  address: string | undefined;
  domains: string[];
  focusedDomainCard: string | null;
  onFocusClick: (domain: string) => void;
}

export function MapDomainFlashList({
  address,
  domains,
  focusedDomainCard,
  onFocusClick,
}: DomainFlashListProps) {
  const domainFlashListOpen = useMapStore((state) => state.domainFlashListOpen);
  const { domainsArray } = useContractData();
  const sortedDomains = domains.sort();
  const flashListRef = useRef<FlashList<any>>(null);
  const viewRef = useRef<any>(null);
  const [isLayoutReady, setIsLayoutReady] = useState(false);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (!viewRef.current || !isLayoutReady) return;
    viewRef?.current?.measure(
      (x: number, y: number, width: number, height: number) => {
        setHeight(height);
      }
    );
  }, [viewRef, isLayoutReady]);

  const positions = [
    {
      y: 0,
    },
    {
      y: height ? height * 2 : 200,
    },
  ];
  const position = positions[domainFlashListOpen ? 0 : 1];

  //   Function to scrollToIndex and focus on the domain
  const scrollToDomain = (domain: string) => {
    flashListRef.current?.scrollToItem({
      animated: true,
      item: domain,
      viewPosition: 0.5,
    });
  };

  useEffect(() => {
    if (focusedDomainCard) {
      scrollToDomain(focusedDomainCard);
    }
  }, [focusedDomainCard]);
  return (
    <XStack
      onLayout={() => setIsLayoutReady(true)}
      ref={viewRef}
      animation={"bouncy"}
      animateOnly={["transform"]}
      {...position}
    >
      <FlashList
        ref={flashListRef}
        keyExtractor={(item) => item}
        initialScrollIndex={0}
        horizontal
        data={sortedDomains}
        renderItem={({ item }) => (
          <DomainCard
            address={address}
            domain={item}
            onFocusClick={onFocusClick}
            focusedDomainCard={focusedDomainCard}
          />
        )}
        estimatedItemSize={150}
        ListEmptyComponent={
          <YStack
            br="$5"
            borderColor={"$color10"}
            bw={1}
            backgroundColor={"$background075"}
            p="$1"
            mx="$2"
            mih={100}
            miw={150}
          >
            <View ai={"center"}>
              <ThemedText type="subtitle">
                {domainsArray.isLoading
                  ? "Loading domains"
                  : "No domains found"}
              </ThemedText>
              {domainsArray.isLoading && <Spinner m={"$2"} size="large" />}
            </View>
          </YStack>
        }
      />
    </XStack>
  );
}

export function DomainCard({
  address,
  domain,
  onFocusClick,
  focusedDomainCard,
}: {
  address: string | undefined;
  domain: string;
  onFocusClick: (domain: string) => void;
  focusedDomainCard: string | null;
}) {
  const { getDomainInfo } = useContractData();
  const setActionsSheetOpen = useActionsSheetStore(
    (state) => state.setActionsSheetOpen
  );
  const setActionsDomain = useActionsSheetStore(
    (state) => state.setActionsDomain
  );
  const domainInfo = getDomainInfo(domain);
  const owner = domainInfo?.owner;
  const isFocusedDomainCard = focusedDomainCard === domain;
  const isOwner = owner?.toLowerCase() === address?.toLowerCase()

  const onOpenActionsSheet = () => {
    setActionsDomain(domain);
    setActionsSheetOpen(true);
  };

  return (
    <YStack
      br="$5"
      borderColor={isFocusedDomainCard ? "$color10" : "$accentColor"}
      bw={isFocusedDomainCard ? 2 : 1}
      backgroundColor={"$background075"}
      p="$2"
      mx="$2"
      mih={100}
      miw={150}
      onPress={() => onFocusClick(domain)}
    >
      <View ai={"center"}>
        <ThemedText type="defaultSemiBold">{domain}</ThemedText>
        <XStack ai={"center"} gap={"$1.5"}>
          <ThemedText type="subtext">
            {owner && shortenAddress(owner)}
          </ThemedText>
          {isOwner && (
            <LucideIcon defaultIcon="badgeCheck" size={20} color={"$yellow10Dark"} />
          )}
        </XStack>
      </View>
      <XStack f={1} p={"$2"} gap={"$1.5"} jc={"space-around"}>
        <ThemedButton
          disabled={!isFocusedDomainCard}
          onPress={() => onOpenActionsSheet()}
          icon={<LucideIcon defaultIcon="actions" size={"$1"} />}
          centered
          size="small"
          title="Actions"
        />
      </XStack>
    </YStack>
  );
}
