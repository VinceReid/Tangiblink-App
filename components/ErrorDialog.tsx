import { YStack, Button, AlertDialog, XStack } from "tamagui";
import { LucideIcon } from "@/components/LucideIcons";
import { ThemedText } from "@/components/ThemedText";
import { BackHandler } from "react-native";
import { useRouter } from "expo-router";
import { useEffect } from "react";

// Alert dialog for errors
export function ErrorDialog({
  error,
  isDialogOpen,
  setIsDialogOpen,
}: {
  error: string;
  isDialogOpen: boolean;
  setIsDialogOpen: (value: boolean) => void;
}) {
  const router = useRouter();
  // Function to handle closing the dialog
  const handleClose = () => {
    setIsDialogOpen(false);
  };

  useEffect(() => {
    const onBackPress = () => {
      if (isDialogOpen) {
        setIsDialogOpen(false);
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
  }, [isDialogOpen]);

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
              <LucideIcon defaultIcon="alert" size={24} />
              <ThemedText type="subtitle">Error</ThemedText>
            </XStack>
            <ThemedText type="subtext">{error}</ThemedText>
            <AlertDialog.Cancel asChild>
              <Button onPress={handleClose}>Cancel</Button>
            </AlertDialog.Cancel>
          </YStack>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog>
  );
}
