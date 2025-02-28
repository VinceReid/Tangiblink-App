import { Pressable } from "react-native";
import { LucideIcon, type DefaultIcon } from "@/components/LucideIcons";
import { SizableText, Square, View } from "tamagui";
import type { IconProps } from "@tamagui/helpers-icon";

type ActionButtonProps = IconProps & {
  onPress?: () => void;
  title: string;
  icon: DefaultIcon;
  size?: "small" | "large";
  disabled?: boolean;
  manager?: boolean;
};

export const ActionButton = ({
  onPress,
  title,
  icon,
  size,
  disabled,
  manager,
  ...props
}: ActionButtonProps) => {
  return (
    <Pressable onPress={onPress} disabled={disabled}>
      {({ pressed }) => (
        <Square
          themeInverse
          alignItems="center"
          justifyContent="center"
          width={size === "small" ? "$7" : size === "large" ? "$12" : "$9"}
          height={size === "small" ? "$7" : size === "large" ? "$12" : "$9"}
          borderRadius="$5"
          bg={
            manager
              ? pressed
                ? "$color1"
                : "$color7"
              : pressed
              ? "$color1"
              : "$color4"
          }
          o={disabled ? 0.5 : pressed ? 0.9 : 1}
          p={size === "small" ? "$1" : size === "large" ? "$3" : "$2"}
        >
          <LucideIcon
            defaultIcon={icon}
            size={size === "small" ? "$1" : size === "large" ? "$5" : "$3"}
            o={pressed ? 0.5 : 1}
            col={disabled ? "$color4" : "$color"}
            {...props}
          />
          <SizableText
            size={size === "small" ? "$1" : size === "large" ? "$5" : "$2"}
            color={disabled ? "$color4" : "$color"}
          >
            {title}
          </SizableText>
        </Square>
      )}
    </Pressable>
  );
};
