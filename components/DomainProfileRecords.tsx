import {
  YStack,
  XStack,
  Spinner,
  Theme,
  ScrollView,
  Image,
  Separator,
} from "tamagui";
import { useRouter } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import { plusCodeToTokenId } from "@/utils/plusCodeToTokenId";
import useContractData from "@/hooks/useContractData";
import { SocialLinks } from "social-links";
import { useState, useEffect } from "react";
import { useActiveAccount } from "thirdweb/react";
import { AddSocialRecordScroll } from "@/components/AddSocialRecordScroll";
import { AddDescriptionRecordScroll } from "@/components/AddDescriptionRecordScroll";
import { useSetRecordsStore } from "@/store/setRecordsStore";
import { ExternalLinkOnPress } from "@/components/ExternalLink";
import {
  normalizeSocialURL,
  getSocialProfileId,
  SocialRecord,
  isSocialProfile,
  isSocialValid,
} from "@/utils/socialRecordChecks";
import {
  descriptionRecordKeys,
  isImageUrl,
} from "@/utils/descriptionRecordChecks";
import { KeyValue } from "@/store/setRecordsStore";
import { isValidURL } from "@/utils/urlCheck";
import { usePreviewStore } from "@/components/PreviewSwitch";

export function DomainProfileRecords({
  domain,
  recordKeys,
  isLoading,
}: {
  domain: string;
  recordKeys: string[];
  isLoading: boolean;
}) {
  const router = useRouter();
  const account = useActiveAccount();
  const { getManyRecords, getDomainInfo } = useContractData();
  const domainInfo = getDomainInfo(domain);
  const isUser =
    domainInfo && account
      ? domainInfo.user?.toLowerCase() === account.address.toLowerCase()
      : false;
  const [socialRecords, setSocialRecords] = useState<SocialRecord[]>([]);
  const [descriptionRecords, setDescriptionRecords] = useState<KeyValue[]>([]);
  const socialLinks = new SocialLinks();
  const profileNames = socialLinks.getProfileNames();
  const preview = usePreviewStore((state) => state.preview);
  const setRecordsDomain = useSetRecordsStore(
    (state) => state.setRecordsDomain
  );
  const setDefinedKey = useSetRecordsStore((state) => state.setDefinedKey);

  const socialKeys = recordKeys.filter((record) => {
    return profileNames.includes(record.toLowerCase());
  });
  const descriptionKeys = recordKeys.filter((record) => {
    return descriptionRecordKeys.includes(record.toLowerCase());
  });
  const tokenId = plusCodeToTokenId(domain);
  const socialValues = getManyRecords(socialKeys, tokenId);
  const descriptionValues = getManyRecords(descriptionKeys, tokenId);

  useEffect(() => {
    if (socialValues.data && socialValues.data.length > 0) {
      const values = socialValues.data.map((value, index) => {
        const isSocial = isSocialProfile(socialKeys[index]);
        const isValid = isSocial && isSocialValid(socialKeys[index], value);
        return {
          socialName: socialKeys[index],
          socialValue: value,
          isValid: isSocial && isValid,
        };
      });
      const socialRecords = values
        .filter((value) => {
          return value.isValid;
        })
        .map((value) => {
          return {
            socialName: value.socialName,
            socialValue: value.socialValue,
          };
        });
      setSocialRecords(socialRecords);
    }
  }, [socialValues.data]);

  useEffect(() => {
    if (descriptionValues.data && descriptionValues.data.length > 0) {
      const values = descriptionValues.data;
      const descriptionRecords = values.map((value, index) => {
        return {
          key: descriptionKeys[index],
          value,
        };
      });
      setDescriptionRecords(descriptionRecords);
    }
  }, [descriptionValues.data]);

  // Function to add a defined record to the domain
  function onAddDefinedRecord({ key }: { key: string }) {
    setDefinedKey(key);
    setRecordsDomain(domain);
    router.navigate(`/add-records`);
  }

  return (
    <Theme name={"accent"}>
      <YStack gap="$2" f={1}>
        <YStack br="$5" p="$2" gap="$2" mih={50} bg={"$background"}>
          <ThemedText type="subtitle">Description:</ThemedText>
          <Separator />
          {isLoading || descriptionValues.isLoading ? (
            <ThemedText type="subtitle">Loading...</ThemedText>
          ) : descriptionRecords.length === 0 ? (
            <ThemedText type="info">No description records</ThemedText>
          ) : (
            <ScrollView f={1}>
              <DescriptionSection records={descriptionRecords} />
            </ScrollView>
          )}
          {isUser && !preview && (
            <AddDescriptionRecordScroll
              recordKeys={descriptionKeys}
              isLoading={isLoading}
              onSelect={onAddDefinedRecord}
            />
          )}
          {isLoading && <Spinner m={"$2"} />}
        </YStack>
        <YStack br="$5" p="$2" gap="$2" mih={50} bg={"$background"}>
          <ThemedText type="subtitle">Socials:</ThemedText>
          <Separator />
          {isLoading || socialValues.isLoading ? (
            <ThemedText type="subtitle">Loading...</ThemedText>
          ) : socialRecords.length === 0 ? (
            <ThemedText type="info">No social records</ThemedText>
          ) : (
            <YStack f={1} alignItems="center">
              <ScrollView horizontal f={1}>
                <XStack f={1} gap="$2" p="$1">
                  {socialRecords.map((record) => (
                    <SocialRecordItem key={record.socialName} record={record} />
                  ))}
                </XStack>
              </ScrollView>
            </YStack>
          )}
          {isUser && !preview && (
            <AddSocialRecordScroll
              recordKeys={socialKeys}
              isLoading={isLoading}
              onSelect={onAddDefinedRecord}
            />
          )}
          {isLoading && <Spinner m={"$2"} />}
        </YStack>
      </YStack>
    </Theme>
  );
}

export function SocialRecordItem({ record }: { record: SocialRecord }) {
  const normalizedURL = normalizeSocialURL({
    profile: record.socialName,
    url: record.socialValue,
  });
  const ProfileId = getSocialProfileId(record.socialName, record.socialValue);
  return (
    <YStack
      f={1}
      gap="$1"
      br="$5"
      bg={"$color3"}
      p="$2"
      alignItems="center"
      onPress={() => ExternalLinkOnPress(normalizedURL)}
    >
      <ThemedText type="default">{record.socialName}</ThemedText>
      <Separator themeInverse width={100} />
      <ThemedText type="default">{ProfileId}</ThemedText>
    </YStack>
  );
}

export function DescriptionSection({ records }: { records: KeyValue[] }) {
  const logo = records.find((record) => record.key === "logo");
  // check if logo is image
  const isLogoUrl = logo?.value && isImageUrl(logo.value);
  const description = records.find((record) => record.key === "description");
  const title = records.find((record) => record.key === "title");
  // check if website is valid
  const website = records.find((record) => record.key === "website");
  const isValidWebsite = website?.value && isValidURL(website.value);

  return (
    <YStack gap="$2" f={1}>
      <XStack f={1} gap="$2" justifyContent="flex-start" alignItems="center">
        {logo && isLogoUrl && (
          <Image source={{ uri: logo.value }} width={80} height={80} />
        )}
        {title && <ThemedText type="title">{title.value}</ThemedText>}
      </XStack>
      {description && (
        <ThemedText type="default">{description.value}</ThemedText>
      )}
      {website && isValidWebsite && (
        <YStack
          f={1}
          gap="$1"
          br="$5"
          bg={"$color3"}
          p="$2"
          alignItems="center"
          onPress={() => ExternalLinkOnPress(website.value)}
        >
          <ThemedText type="default">{website.key}</ThemedText>
          <Separator themeInverse width={100} />
          <ThemedText type="default">{website.value}</ThemedText>
        </YStack>
      )}
    </YStack>
  );
}
