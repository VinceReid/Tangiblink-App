import { type ViewProps, StyleSheet } from "react-native";
import { styled, View } from "tamagui";

export type ViewArrowProps = ViewProps & {
  color?: string;
};

// Displays an arrow pointing down below a view
export function ViewArrow({ style, color, ...rest }: ViewArrowProps) {
  const StyledView = styled(View, {
    borderTopColor: color ?? "grey",
    ...styles.arrow,
    style,
  });
  return <StyledView {...rest} />;
}

const styles = StyleSheet.create({
  arrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderTopWidth: 20,
    borderStyle: "solid",
    backgroundColor: "transparent",
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    position: 'absolute', // Set position to absolute
    bottom: -20, // Position it below the parent view
    left: '50%', // Center it horizontally
    transform: [{ translateX: -5 }] // Adjust for the width of the arrow
  },
});
