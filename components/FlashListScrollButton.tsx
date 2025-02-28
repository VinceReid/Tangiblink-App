import { LucideIcon } from "@/components/LucideIcons";
import { AnimatePresence, Button } from "tamagui";

interface FlashSheetScrollButtonProps {
  onPress: () => void;

  showButton: boolean;
}

// Button to scroll the flash list to the top
export const FlashSheetScrollButton = ({
  onPress,
  showButton,
}: FlashSheetScrollButtonProps) => {
  return (
    <AnimatePresence>
      {showButton && (
        <Button
          key={"buy-button"}
          pos={"absolute"}
          t={"50%"}
          r={"5%"}
          size={"$5"}
          animation="bouncy"
          circular
          icon={<LucideIcon defaultIcon="up" size={"$2"} />}
          onPress={() => onPress()}
          enterStyle={{
            opacity: 0,
            x: 50,
            y: 10,
            scale: 0.9,
          }}
          exitStyle={{
            opacity: 0,
            x: 50,
            y: 10,
            scale: 0.9,
          }}
        />
      )}
    </AnimatePresence>
  );
};
