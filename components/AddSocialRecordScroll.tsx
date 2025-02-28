import { XStack, ScrollView, YStack } from "tamagui";
import { ThemedText } from "@/components/ThemedText";
import { SocialLinks } from "social-links";
import { LucideIcon } from "@/components/LucideIcons";

export function AddSocialRecordScroll({
  recordKeys,
  isLoading,
  onSelect,
}: {
  recordKeys: string[];
  isLoading: boolean;
  onSelect: ({ key }: { key: string }) => void;
}) {
  const socialLinks = new SocialLinks();
  const profileNames = socialLinks.getProfileNames();
  const socialRecordKeys = recordKeys
    .filter((record) => {
      return profileNames.includes(record.toLowerCase());
    })
    .map((record) => record.toLowerCase());
  const unUsedProfileNames = profileNames.filter(
    (profileName) => !socialRecordKeys.includes(profileName)
  );
  return (
    <YStack gap={"$1"} f={1}>
      <ThemedText type="subtext">Add a Social profile record</ThemedText>
      <ScrollView horizontal f={1}>
        <XStack f={1} gap="$2" p="$1">
          {!isLoading &&
            unUsedProfileNames.map((socialKey) => (
              <XStack
                key={socialKey}
                themeInverse
                f={1}
                gap="$2"
                br="$5"
                bg={"$color7"}
                p="$2"
                alignItems="center"
                onPress={() => onSelect({ key: socialKey })}
              >
                <ThemedText type="default">{socialKey}</ThemedText>
                <LucideIcon defaultIcon="addRecord" size="$1" />
              </XStack>
            ))}
        </XStack>
      </ScrollView>
    </YStack>
  );
}
