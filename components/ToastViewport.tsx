import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ToastViewport, Toast, useToastState } from "@tamagui/toast";
import { YStack } from "tamagui";

declare module "@tamagui/toast" {
  interface CustomData {
    type: "error" | "success" | "warning" | "info";
  }
}

export type SafeToastViewportProps = {
  name?: string;
  position?: "top" | "bottom";
};

export const SafeToastViewport = ({
  name,
  position,
}: SafeToastViewportProps) => {
  const { left, top, right, bottom } = useSafeAreaInsets();
  return name ? (
    <ToastViewport
      name={name}
      flexDirection="column-reverse"
      top={position !== "bottom" ? top : undefined}
      left={left}
      right={right}
      bottom={position && position === "bottom" && bottom}
      zIndex={100_001}
      portalToRoot
    />
  ) : (
    <ToastViewport
      flexDirection="column-reverse"
      top={position !== "bottom" ? top : undefined}
      left={left}
      right={right}
      bottom={position && position === "bottom" && bottom}
      zIndex={100_001}
      portalToRoot
    />
  );
};

export const CurrentToast = () => {
  const currentToast = useToastState();
  if (!currentToast || currentToast.isHandledNatively) return null;
  const toastType = currentToast.type;
  const color =
    toastType === "error"
      ? "$red10Dark"
      : toastType === "success"
      ? "$green9Dark"
      : toastType === "warning"
      ? "$purple8Dark"
      : toastType === "info"
      ? "$accentColor"
      : undefined;

  return (
    <Toast
      key={currentToast.id}
      duration={currentToast.duration}
      enterStyle={{ opacity: 0, scale: 0.5, y: -25 }}
      exitStyle={{ opacity: 0, scale: 1, y: -20 }}
      y={0}
      opacity={1}
      scale={1}
      animation="lazy"
      viewportName={currentToast.viewportName}
      bg={color}
      zIndex={100_000}
    >
      <YStack>
        <Toast.Title>{currentToast.title}</Toast.Title>
        {!!currentToast.message && (
          <Toast.Description>{currentToast.message}</Toast.Description>
        )}
      </YStack>
    </Toast>
  );
};
