import { XStack, YStack, Separator } from "tamagui";
import { LucideIcon, type DefaultIcon } from "@/components/LucideIcons";
import { ThemedText } from "@/components/ThemedText";
import { Copy } from "@/components/ClipboardCopyPaste";
import { shortenAddress } from "thirdweb/utils";

type ModalHeaderProps = {
  defaultIcon: DefaultIcon;
  history?: boolean;
} & (
  | { domain: string; account?: never; title?: never }
  | { domain?: never; account: string; title?: never }
  | { domain?: never; account?: never; title: string }
);

// This component is used to display a header in a modal

export const ModalHeader = ({
  defaultIcon,
  domain,
  account,
  title,
  history,
}: ModalHeaderProps) => {
  return (
    <YStack gap="$2">
      <XStack gap="$3" alignItems="center">
        <XStack gap="$1" alignItems="center">
          {history && <LucideIcon defaultIcon="history" size="$3" />}
          <LucideIcon defaultIcon={defaultIcon} size="$3" />
        </XStack>
        {(domain || account || title) && (
          <ThemedText type="subtitle">
            {domain || (account && shortenAddress(account)) || title}
          </ThemedText>
        )}
        {account && <Copy type="address" value={account} />}
        {domain && <Copy type="domain" value={domain} />}
      </XStack>
    </YStack>
  );
};
