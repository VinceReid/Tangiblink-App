import { YStack, Button, AlertDialog, XStack } from "tamagui";
import { LucideIcon } from "@/components/LucideIcons";
import { ThemedText } from "@/components/ThemedText";
import { BackHandler } from "react-native";
import { useRouter } from "expo-router";
import React from "react";

// Alert dialog for unsaved changes
export function UnsavedDialog({
  message,
  isDialogOpen,
  setIsDialogOpen,
  setPopUpOpen,
}: {
  message: string;
  isDialogOpen: boolean;
  setIsDialogOpen: (value: boolean) => void;
  setPopUpOpen?: (value: boolean) => void;
}) {
  const router = useRouter();
  // Function to handle closing the dialog
  const handleClose = () => {
    setIsDialogOpen(false);
  };

  const handleContinue = () => {
    setIsDialogOpen(false);
    setPopUpOpen && setPopUpOpen(false);
    !setPopUpOpen && router.back();
  };

  return (
    <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay
          key="AddRecordForm-error-dialog-overlay"
          animation="quick"
          opacity={0.5}
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />
        <AlertDialog.Content
          bordered
          elevate
          key="AddRecordForm-error-dialog-content"
          animation={[
            "quick",
            {
              opacity: {
                overshootClamping: true,
              },
            },
          ]}
          enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
          exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
          x={0}
          scale={1}
          opacity={1}
          y={0}
        >
          <YStack gap="$2">
            <XStack gap="$2">
              <LucideIcon defaultIcon="unsaved" size={24} />
              <ThemedText type="subtitle">Unsaved changes</ThemedText>
            </XStack>
            <ThemedText type="subtext">{message}</ThemedText>
            <AlertDialog.Cancel asChild>
              <Button onPress={handleClose}>Cancel</Button>
            </AlertDialog.Cancel>
            <AlertDialog.Action asChild>
              <Button theme="active" onPress={handleContinue}>
                Continue without saving
              </Button>
            </AlertDialog.Action>
          </YStack>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog>
  );
}
