import { XStack, ScrollView, YStack } from "tamagui";
import { ThemedText } from "@/components/ThemedText";
import { LucideIcon } from "@/components/LucideIcons";
import { descriptionRecordKeys } from "@/utils/descriptionRecordChecks";

export function AddDescriptionRecordScroll({
  recordKeys,
  isLoading,
  onSelect,
}: {
  recordKeys: string[];
  isLoading: boolean;
  onSelect: ({ key }: { key: string }) => void;
}) {
  const unUsedDescriptionKeys = descriptionRecordKeys.filter(
    (key) => !recordKeys.includes(key)
  );
  if (unUsedDescriptionKeys.length === 0) {
    return null;
  }
  return (
    <YStack gap={"$1"} f={1} >
      <ThemedText type="subtext">Add a Domain description record</ThemedText>
      <ScrollView horizontal f={1}>
        <XStack f={1} gap="$2" p="$1">
          {!isLoading &&
            unUsedDescriptionKeys.map((descriptionKey) => (
              <XStack
                key={descriptionKey}
                themeInverse
                f={1}
                gap="$2"
                br="$5"
                bg={"$color7"}
                p="$2"
                alignItems="center"
                onPress={() => onSelect({ key: descriptionKey })}
              >
                <ThemedText type="default">{descriptionKey}</ThemedText>
                <LucideIcon defaultIcon="addRecord" size="$1" />
              </XStack>
            ))}
        </XStack>
      </ScrollView>
    </YStack>
  );
}
