import { Sheet } from "@tamagui/sheet";
import { useRouter, useSegments } from "expo-router";
import { useState, useEffect } from "react";
import { YStack, XStack } from "tamagui";
import { BackHandler } from "react-native";
import { usePayStore } from "@/store/payStore";
import { ActionButton } from "@/components/ActionButton";
import {
  PayDomainAction,
  ViewDomainAction,
  MapDirectionsAction,
} from "@/components/DomainActions";
import { useActionsSheetStore } from "@/store/actionsSheetStore";
import { SheetHeader } from "@/components/SheetHeader";

export const ActionsSheet = () => {
  // Destructuring the store
  const actionsSheetOpen = useActionsSheetStore(
    (state) => state.actionsSheetOpen
  );
  const setActionsSheetOpen = useActionsSheetStore(
    (state) => state.setActionsSheetOpen
  );
  const domain = useActionsSheetStore((state) => state.actionsDomain);
  const paySheetOpen = usePayStore((state) => state.paySheetOpen);
  const router = useRouter();
  const segments = useSegments();
  const [position, setPosition] = useState(0);
  const [currentSegment, setCurrentSegment] = useState(segments[0]);

  // useEffect to close the ActionsSheet when the segment changes or the PaySheet is open
  useEffect(() => {
    if (segments[0] !== currentSegment) {
      setActionsSheetOpen(false);
      setCurrentSegment(segments[0]);
    }
    if (actionsSheetOpen && paySheetOpen) {
      setActionsSheetOpen(false);
    }
  }, [segments, currentSegment, paySheetOpen, actionsSheetOpen]);

  // useEffect to handle the back button press
  useEffect(() => {
    const onBackPress = () => {
      if (segments[0] !== "(tabs)") {
        router.back();
        return true;
      }
      if (actionsSheetOpen && !paySheetOpen) {
        setActionsSheetOpen(false);
        return true;
      }

      !paySheetOpen && router.back();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      onBackPress
    );
    if (paySheetOpen) {
      backHandler.remove();
    }

    return () => backHandler.remove();
  }, [actionsSheetOpen, paySheetOpen, segments]);

  return (
    <Sheet
      forceRemoveScrollEnabled={actionsSheetOpen}
      open={actionsSheetOpen}
      onOpenChange={setActionsSheetOpen}
      snapPointsMode={"fit"}
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
      <Sheet.Frame
        padding="$4"
        justifyContent="center"
        alignItems="center"
        gap="$5"
      >
        <SheetHeader title="Actions" defaultIcon="actions" domain={domain} />
        <YStack f={1} gap="$3" mb="$3">
          <XStack gap="$3" mb="$2">
            <ViewDomainAction domain={domain} />
            <PayDomainAction domain={domain} />
            <MapDirectionsAction domain={domain} />
          </XStack>
        </YStack>
      </Sheet.Frame>
    </Sheet>
  );
};
