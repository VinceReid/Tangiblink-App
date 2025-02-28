import { XStack, YStack } from "tamagui";
import { LucideIcon, type DefaultIcon } from "@/components/LucideIcons";
import { ThemedText } from "@/components/ThemedText";

// This component is used to display a header in a sheet

export const SheetHeader = ({
  title,
  defaultIcon,
  domain,
}: {
  title: string;
  defaultIcon: DefaultIcon;
  domain?: string;
}) => {
  const capitalizedTitle = title.charAt(0).toUpperCase() + title.slice(1);
  return (
    <YStack alignItems="center" p="$2">
      <XStack gap="$2" alignItems="center">
        <LucideIcon defaultIcon={defaultIcon} size="$4" />
        <ThemedText type="subtitle">{capitalizedTitle}</ThemedText>
      </XStack>
      {domain && <ThemedText type="subtitle">{domain}</ThemedText>}
    </YStack>
  );
};
