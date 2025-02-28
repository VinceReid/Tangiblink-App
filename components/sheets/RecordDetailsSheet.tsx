import { Sheet } from "@tamagui/sheet";
import { useState, useEffect } from "react";
import {
  View,
  YStack,
  XStack,
  Separator,
  ScrollView,
  Spinner,
  Theme,
} from "tamagui";
import useContractData from "@/hooks/useContractData";
import { ThemedText } from "@/components/ThemedText";
import { useRecordDetailsStore } from "@/store/recordDetailsStore";
import { BackHandler } from "react-native";
import { router } from "expo-router";
import { SheetHeader } from "@/components/SheetHeader";
import { Copy } from "../ClipboardCopyPaste";

export const RecordDetailsSheet = () => {
  // Destructuring the store
  const recordDetailsSheetOpen = useRecordDetailsStore(
    (state) => state.recordDetailsSheetOpen
  );
  const setRecordDetailsSheetOpen = useRecordDetailsStore(
    (state) => state.setRecordDetailsSheetOpen
  );
  const recordDetailsDomain = useRecordDetailsStore(
    (state) => state.recordDetailsDomain
  );
  const recordKey = useRecordDetailsStore((state) => state.recordKey) ?? "";

  const recordTokenId =
    useRecordDetailsStore((state) => state.recordTokenId) ?? 0n;

  const [position, setPosition] = useState(0);
  const { getRecord } = useContractData();

  const value = getRecord(recordKey, recordTokenId);

  useEffect(() => {
    const onBackPress = () => {
      if (recordDetailsSheetOpen) {
        setRecordDetailsSheetOpen(false);
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
  }, [recordDetailsSheetOpen]);

  return (
    <Sheet
      forceRemoveScrollEnabled={recordDetailsSheetOpen}
      open={recordDetailsSheetOpen}
      onOpenChange={setRecordDetailsSheetOpen}
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
      <Sheet.Frame padding="$2" justifyContent="center" gap="$4">
        {recordKey && recordTokenId ? (
          <YStack f={1} p="$1" gap="$3.5" ov={"hidden"}>
            <SheetHeader
              title="Record Details"
              defaultIcon="recordDetails"
              domain={recordDetailsDomain}
            />
            <ScrollView>
              <Theme name={"accent"}>
                <View f={1} br={"$5"} bg={"$background"} gap="$1" p={"$3"}>
                  <XStack gap="$2">
                    <Copy type="any" value={recordKey} />
                    <ThemedText type="subtext">Record key</ThemedText>
                  </XStack>
                  <Separator />
                  <ThemedText type="default">{recordKey}</ThemedText>
                  <Separator />
                  <XStack gap="$2">
                    {value.data && <Copy type="any" value={value.data} />}
                    <ThemedText type="subtext">Record value</ThemedText>
                  </XStack>
                  <Separator />
                  <ThemedText type="default">
                    {value.isLoading ? "Loading..." : value.data}
                  </ThemedText>
                  {value.isLoading && <Spinner m={"$2"} />}
                </View>
              </Theme>
              {!value.isLoading && value.data && (
                <XStack gap="$2" p="$2" bg={"$background"} br={"$5"}>
                  <Copy
                    type="record"
                    value={JSON.stringify({
                      value: value.data,
                      key: recordKey,
                    })}
                  />
                  <ThemedText type="subtext">Copy key and value</ThemedText>
                </XStack>
              )}
            </ScrollView>
          </YStack>
        ) : (
          <View gap="$3" alignItems="center">
            <ThemedText type="subtitle">No record details found</ThemedText>
          </View>
        )}
      </Sheet.Frame>
    </Sheet>
  );
};
