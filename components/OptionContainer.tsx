import { Button, YStack } from "tamagui";
import { LucideIcon, type DefaultIcon } from "@/components/LucideIcons";
import { type PressableProps } from "react-native";
import { ThemedText } from "@/components/ThemedText";

export type OptionContainerProps = {
  onPress: PressableProps["onPress"];
  title: string;
  subtitle?: string;
  disabled?: boolean;
  icon: DefaultIcon;
};

export function OptionContainer(props: OptionContainerProps) {
  const disabled = props.disabled ? true : false;

  return (
    <Button
      my={"$1"}
      h={"$8"}
      boc={"$accentColor"}
      bw={1}
      br="$5"
      jc={"space-between"}
      variant={"outlined"}
      onPress={props.onPress}
      disabled={disabled}
      opacity={disabled ? 0.5 : 1}
      icon={
        props.icon ? <LucideIcon defaultIcon={props.icon} size={"$2"} /> : undefined
      }
      iconAfter={<LucideIcon defaultIcon="chevronRight" size={"$2"} />}
    >
      <YStack gap="$1">
      <ThemedText>{props.title}</ThemedText>
      {props.subtitle && <ThemedText type="subtext">{props.subtitle}</ThemedText>}
      </YStack>
    </Button>
  );
}
