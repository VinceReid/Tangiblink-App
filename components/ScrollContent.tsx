import { YStack, ScrollView } from "tamagui";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

export const ScrollContent = ({ children }: { children: React.ReactNode }) => {
  return (
    <ScrollView keyboardShouldPersistTaps={"handled"} mb="$5" >
      <YStack f={1} p="$2" gap="$3.5" ov={"hidden"}>
        {children}
      </YStack>
    </ScrollView>
  );
};

export const KeyboardAwareScrollContent = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <KeyboardAwareScrollView bottomOffset={70} keyboardShouldPersistTaps={"handled"}>
      <YStack f={1} p="$2" gap="$3.5" ov={"hidden"} mb="$5">
        {children}
      </YStack>
    </KeyboardAwareScrollView>
  );
};
