import { forwardRef } from "react";
import { Pressable } from "react-native";
import { LucideIcon } from "@/components/LucideIcons";

export const SettingsButton = forwardRef<
  typeof Pressable,
  { onPress?: () => void }
>(({ onPress }, ref) => {
  return (
    <Pressable onPress={onPress}>
      {({ pressed }) => (
        <LucideIcon
          defaultIcon={"settings"}
          size={"$2"}
          o={pressed ? 0.5 : 1}
          mr={15}
          ml={15}
        />
      )}
    </Pressable>
  );
});
