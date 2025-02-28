import { YStack } from "tamagui";

export const Container = ({ children }: { children: React.ReactNode }) => {
  return (
    <YStack f={1} bg="$background" pt="$13">
      {children}
    </YStack>
  );
};

export const OnboardingContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <YStack f={1} bg="$background" pt="$10">
      {children}
    </YStack>
  );
};
