import { type TextProps } from "react-native";
import { SizableText, useTheme, H4, H2 } from "tamagui";

export type ThemedTextProps = TextProps & {
  type?:
    | "default"
    | "title"
    | "defaultSemiBold"
    | "subtitle"
    | "link"
    | "subtext"
    | "info"
    | "warning";
  color?: string;
  disabled?: boolean;
};

export function ThemedText({
  type = "default",
  color,
  disabled,
  ...rest
}: ThemedTextProps) {
  const theme = useTheme();
  const colorFocus = theme.color10.get();
  const infoColor = theme.accentColor.get();
  switch (type) {
    case "subtext":
      return (
        <SizableText
          {...rest}
          size={"$4"}
          color={color ?? colorFocus}
          o={disabled ? 0.5 : 1}
        />
      );
    case "link":
      return (
        <SizableText
          {...rest}
          size={"$5"}
          color={color ?? "#0a7ea4"}
          o={disabled ? 0.5 : 1}
        />
      );
    case "info":
      return (
        <SizableText
          {...rest}
          size={"$4"}
          color={color ?? infoColor}
          o={disabled ? 0.5 : 1}
        />
      );
    case "title":
      return <H2 {...rest} color={color ?? undefined} o={disabled ? 0.5 : 1} />;
    case "subtitle":
      return <H4 {...rest} color={color ?? undefined} o={disabled ? 0.5 : 1} />;
    case "defaultSemiBold":
      return (
        <SizableText
          {...rest}
          size={"$4"}
          fontWeight="600"
          color={color ?? undefined}
          o={disabled ? 0.5 : 1}
        />
      );
    case "warning":
      return (
        <SizableText
          {...rest}
          size={"$4"}
          color={color ?? "#ff0000"}
          o={disabled ? 0.5 : 1}
        />
      );
    case "default":
      return (
        <SizableText
          {...rest}
          size={"$4"}
          color={color ?? undefined}
          o={disabled ? 0.5 : 1}
        />
      );
    default:
      return (
        <SizableText
          {...rest}
          size={"$4"}
          color={color ?? undefined}
          o={disabled ? 0.5 : 1}
        />
      );
  }
}
