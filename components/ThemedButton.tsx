import { Button, Spinner, Text } from "tamagui";
import { type PressableProps } from "react-native";

export type ThemedButtonProps = {
  onPress?: PressableProps["onPress"];
  title?: string;
  disabled?: boolean;
  loading?: boolean;
  loadingTitle?: string;
  icon?: JSX.Element;
  iconAfter?: JSX.Element;
  variant?: "primary" | "secondary";
  size?: "small" | "medium" | "large";
  chromeless?: boolean;
  themeInverse?: boolean;
  centered?: boolean;
  outlined?: boolean;
};

export function ThemedButton(props: ThemedButtonProps) {
  const outlined = props.outlined ? "outlined" : undefined;
  const size =
    props.size === "small" ? "$2" : props.size === "large" ? "$6" : "$3";
  const spinnerSize = props.size === "small" ? "small" : "large";
  const color =
    props.variant === "secondary" && !props.outlined
      ? "$accentColor"
      : undefined;
  const borderColor =
    props.variant === "secondary" ? "$accentColor" : undefined;
  const disabled = props.loading || props.disabled ? true : false;
  const align = props.centered ? "center" : undefined;

  return (
    <Button
      bg={color}
      br={"$5"}
      borderColor={borderColor}
      variant={outlined}
      size={size}
      onPress={props.onPress}
      disabled={disabled}
      opacity={disabled ? 0.5 : 1}
      chromeless={props.chromeless}
      themeInverse={props.themeInverse}
      alignSelf={align}
      icon={
        props.loading ? <Spinner size={spinnerSize} /> : props.icon ?? undefined
      }
      iconAfter={props.iconAfter ? props.iconAfter : undefined}
    >
      {props.title && (
        <Text >
          {props.loading ? props.loadingTitle : props.title}
        </Text>
      )}
    </Button>
  );
}
