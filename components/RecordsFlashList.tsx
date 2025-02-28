import { useRef } from "react";
import { FlashList } from "@shopify/flash-list";
import { LucideIcon } from "@/components/LucideIcons";
import { YStack, View, XStack, Spinner, Theme } from "tamagui";
import { ThemedText } from "@/components/ThemedText";
import { plusCodeToTokenId } from "@/utils/plusCodeToTokenId";
import { useRecordDetailsStore } from "@/store/recordDetailsStore";

export function RecordsFlashList({ domain, recordKeys, isLoading }: { domain: string, recordKeys: string[], isLoading: boolean }) {
  const flashListRef = useRef<FlashList<any>>(null);
  const tokenId = plusCodeToTokenId(domain);

  return (
    <FlashList
      ref={flashListRef}
      initialScrollIndex={0}
      data={recordKeys}
      renderItem={({ item, index }) => (
        <RecordItem
          record={item}
          tokenId={tokenId}
          index={index}
          dataLength={recordKeys.length}
        />
      )}
      estimatedItemSize={50}
      ListEmptyComponent={
        <Theme name={"accent"}>
          <YStack br="$5" p="$2" mih={50} bg={"$background"}>
            <View ai={"center"}>
              <ThemedText type="subtitle">
                {isLoading ? "Loading..." : "No records found"}
              </ThemedText>
              {isLoading && <Spinner m={"$2"} />}
            </View>
          </YStack>
        </Theme>
      }
    />
  );
}

export function RecordItem({
  record,
  tokenId,
  index,
  dataLength,
}: {
  record: any;
  tokenId: bigint;
  index: number;
  dataLength: number;
}) {
  const setRecordKey = useRecordDetailsStore((state) => state.setRecordKey);
  const setRecordTokenId = useRecordDetailsStore(
    (state) => state.setRecordTokenId
  );
  const setRecordDetailsSheetOpen = useRecordDetailsStore(
    (state) => state.setRecordDetailsSheetOpen
  );

  // Function to open the RecordDetailsSheet
  function openRecordDetailsSheet() {
    setRecordKey(record);
    setRecordTokenId(tokenId);
    setRecordDetailsSheetOpen(true);
  }

  return (
    <Theme name={"accent"}>
      <YStack
        br="$5"
        borderTopLeftRadius={index === 0 ? "$4" : 0}
        borderTopRightRadius={index === 0 ? "$4" : 0}
        borderBottomLeftRadius={index === dataLength - 1 ? "$4" : 0}
        borderBottomRightRadius={index === dataLength - 1 ? "$4" : 0}
        bg={"$background"}
        p="$2"
        mb="$1"
        mih={50}
        onPress={() => openRecordDetailsSheet()}
      >
        <XStack gap="$4" alignItems="center">
          <LucideIcon defaultIcon="recordKey" size={"$2"} />
          <YStack gap="$1.5">
            <ThemedText type="subtext">Key</ThemedText>
            <ThemedText type="subtitle">{record}</ThemedText>
          </YStack>
        </XStack>
      </YStack>
    </Theme>
  );
}
