import { YStack } from "tamagui";

export const Content = ({ children }: { children: React.ReactNode }) => {
  return (
    <YStack f={1} p="$2" gap="$3.5" ov={"hidden"}>
      {children}
    </YStack>
  );
};

export const ScanContent = ({ children }: { children: React.ReactNode }) => {
  return (
    <YStack f={1} ov={"hidden"}>
      {children}
    </YStack>
  );
};
