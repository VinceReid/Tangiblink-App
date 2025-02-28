import { Separator, View, YStack } from "tamagui";
import { ThemedText } from "@/components/ThemedText";
import { SocialProfilesList } from "@/components/SocialProfileCard";
import { client } from "@/constants/thirdweb";
{
  /* test social address 0x2247d5d238d0f9d37184d8332aE0289d1aD9991b */
}

export function SocialSection({ address }: { address: string }) {
  return (
    <YStack gap="$1">
      <ThemedText type="subtitle">Blockchain Social Profiles</ThemedText>
      <ThemedText type="info">Farcaster | Lens | Ens</ThemedText>
      <SocialProfilesList address={address} client={client} />
      <Separator />
    </YStack>
  );
}
