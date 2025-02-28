import { Stack, useRouter, useLocalSearchParams } from "expo-router";
import { Container } from "@/components/Container";
import { Content } from "@/components/Content";
import { useTheme, Separator, XStack } from "tamagui";
import useContractData from "@/hooks/useContractData";
import { ThemedText } from "@/components/ThemedText";
import { plusCodeToTokenId } from "@/utils/plusCodeToTokenId";
import { useActiveAccount } from "thirdweb/react";
import { ModalHeader } from "@/components/ModalHeader";
import {
  AddRecordsAction,
  EditRecordsAction,
} from "@/components/DomainActions";
import { RecordsFlashList } from "@/components/RecordsFlashList";

export default function DomainRecords() {
  const { domain } = useLocalSearchParams() as { domain: string };
  const account = useActiveAccount();
  const theme = useTheme();
  const color = theme.color.get();
  const router = useRouter();
  const { domainsArray, keysOf, getDomainInfo } = useContractData();
  const domainInfo = getDomainInfo(domain);
  const isUser =
    domainInfo && account
      ? domainInfo.user?.toLowerCase() === account.address.toLowerCase()
      : false;
  const tokenId = plusCodeToTokenId(domain);
  const recordKeys = keysOf(tokenId);

  return !domainsArray.data?.includes(domain) ? (
    router.replace(`/${domain}/domain-not-found`)
  ) : (
    <Container>
      <Stack.Screen
        options={{
          title: "Domain records",
          headerShown: true,
          headerTransparent: true,
          headerTitleAlign: "center",
          headerTitleStyle: { color: color },
          headerTintColor: color,
        }}
      />
      <Content>
        <ModalHeader defaultIcon="records" domain={domain} />
        {isUser && (
          <XStack gap="$2">
            <EditRecordsAction
              domain={domain}
              recordKeys={recordKeys.data ? [...recordKeys.data.slice()] : []}
              isUser={isUser}
            />
            <AddRecordsAction
              domain={domain}
              recordKeys={recordKeys.data ? [...recordKeys.data.slice()] : []}
              isUser={isUser}
            />
          </XStack>
        )}
        <ThemedText type="subtitle">Available Records</ThemedText>
        <ThemedText type="subtext">
          Select a record to view more details.
        </ThemedText>
        <Separator />
        <RecordsFlashList
          domain={domain}
          recordKeys={recordKeys.data ? [...recordKeys.data.slice()] : []}
          isLoading={recordKeys.isLoading}
        />
      </Content>
    </Container>
  );
}
