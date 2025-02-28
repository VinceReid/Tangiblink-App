import { LucideIcon } from "@/components/LucideIcons";
import { Sheet } from "@tamagui/sheet";
import { Button } from "tamagui";
import { BackHandler } from "react-native";
import { useRouter } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import { AddRecordForm } from "@/components/AddRecordForm";
import { useBuyDomainStore } from "@/store/buyDomainStore";
import { KeyboardAwareScrollContent } from "@/components/ScrollContent";
import { SheetHeader } from "@/components/SheetHeader";
import { useEffect } from "react";

export function BuyWithRecordsSheet() {
  const router = useRouter();
  const buyWithRecordSheetOpen = useBuyDomainStore(
    (state) => state.buyWithRecordSheetOpen
  );
  const buyDomain = useBuyDomainStore((state) => state.buyDomain);
  const setBuyWithRecordSheetOpen = useBuyDomainStore(
    (state) => state.setBuyWithRecordSheetOpen
  );
  const setBuySheetOpen = useBuyDomainStore((state) => state.setBuySheetOpen);

  useEffect(() => {
    if (buyWithRecordSheetOpen) {
      setBuySheetOpen(false);
    }
  }, [buyWithRecordSheetOpen]);

  useEffect(() => {
    const onBackPress = () => {
      if (buyWithRecordSheetOpen) {
        setBuyWithRecordSheetOpen(false);
        setBuySheetOpen(true);
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
  }, [buyWithRecordSheetOpen]);

  function onOpenChange(open: boolean) {
    if (open) {
      setBuySheetOpen(false);
    } else {
      setBuySheetOpen(true);
    }
    setBuyWithRecordSheetOpen(open);
  }

  return (
    <Sheet
      forceRemoveScrollEnabled={buyWithRecordSheetOpen}
      open={buyWithRecordSheetOpen}
      onOpenChange={onOpenChange}
      dismissOnSnapToBottom
      snapPointsMode={"percent"}
      snapPoints={[90]}
      zIndex={100_000}
    >
      <Sheet.Overlay
        animation="lazy"
        enterStyle={{ opacity: 0 }}
        exitStyle={{ opacity: 0 }}
      />
      <Sheet.Handle bg={"$color"} />
      <Sheet.Frame justifyContent="center" gap="$5" >
        <KeyboardAwareScrollContent>
          <Button
            size="$6"
            circular
            alignSelf="center"
            icon={<LucideIcon defaultIcon="chevronDown" size={"$2"} />}
            onPress={() => onOpenChange(false)}
          />
          <SheetHeader
            title="Add Records"
            defaultIcon="addRecord"
            domain={buyDomain}
          />
          <ThemedText>
            Add records to store information with on your domain. Then minimize
            the sheet to confirm the transaction.
          </ThemedText>
          <AddRecordForm />
          <Button
            size="$4"
            alignSelf="center"
            icon={<LucideIcon defaultIcon="chevronDown" size={"$2"} />}
            onPress={() => onOpenChange(false)}
          >
            Done
          </Button>
        </KeyboardAwareScrollContent>
      </Sheet.Frame>
    </Sheet>
  );
}
