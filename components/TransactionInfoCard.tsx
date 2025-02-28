import { LucideIcon, type DefaultIcon } from "@/components/LucideIcons";
import { YStack, View, XStack } from "tamagui";
import { ThemedText } from "@/components/ThemedText";

export function TransactionInfoCard({
  onPress,
  icon,
  title,
  children,
}: {
  onPress: () => void;
  icon: DefaultIcon;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <YStack br="$5" p="$2" mih={50} onPress={() => onPress()}>
      <XStack gap="$4" alignItems="center">
        <LucideIcon defaultIcon={icon} size="$2" />
        <YStack>
          <ThemedText type="subtitle">{title}</ThemedText>
          {children}
        </YStack>
      </XStack>
    </YStack>
  );
}
