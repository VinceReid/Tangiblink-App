import { router } from "expo-router";
import { useRef, useState, useEffect } from "react";
import { FlashList } from "@shopify/flash-list";
import { YStack, Separator, XStack, Spinner, Input } from "tamagui";
import useContractData from "@/hooks/useContractData";
import { useTransferDomainStore } from "@/store/transferDomainStore";
import { ThemedText } from "@/components/ThemedText";
import { shortenAddress } from "thirdweb/utils";
import { Image } from "react-native";
import { useLocationPermissionStore } from "@/components/LocationPermissionRequest";
import { useAppSettings } from "@/store/settingsStore";
import OpenLocationCode from "@/utils/openlocationcode";
import { isAddress } from "thirdweb";
import { getDistance, formatDistance } from "@/utils/haversine";
import LocationPermissionRequest from "@/components/LocationPermissionRequest";
import { FlashSheetScrollButton } from "@/components/FlashListScrollButton";
import { useBuyDomainStore } from "@/store/buyDomainStore";

export function SearchDomainsFlashList() {
  const flashListRef = useRef<FlashList<any>>(null);
  const { domainInfoLoading, getDomainInfo } = useContractData();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState<string[]>([]);
  const [sortedByNearest, setSortedByNearest] = useState<string[]>([]);
  const [availableDomain, setAvailableDomain] = useState<string | null>(null);
  const [buyLocation, setBuyLocation] = useState<string | null>(null);
  const { domainsArray, getAccountDomains, domainsInfo } = useContractData();
  const location = useLocationPermissionStore((state) => state.location);
  const locationPermission = useAppSettings(
    (state) => state.locationPermission
  );
  const [scrollButtonVisible, setScrollButtonVisible] = useState(false);

  const scrollToTop = () => {
    flashListRef.current?.scrollToIndex({
      animated: true,
      index: 0,
    });
  };

  function visibleItemsChanged(info: any) {
    if (info.viewableItems.length < 1) {
      setScrollButtonVisible(false);
      return;
    }
    const firstVisibleItem = info.viewableItems[0];
    if (firstVisibleItem.index > 10) {
      setScrollButtonVisible(true);
    } else {
      setScrollButtonVisible(false);
    }
  }

  const onValueChange = (value: string) => {
    const startsWith = value
      ? domainsArray.data?.filter((domain) => {
          return domain.toLowerCase().startsWith(value.toLowerCase());
        }) ?? []
      : [];
    const includes = value
      ? domainsArray.data?.filter((domain) => {
          return (
            !startsWith.includes(domain) &&
            domain.toLowerCase().includes(value.toLowerCase())
          );
        }) ?? []
      : [];

    let result = [...startsWith, ...includes];
    const isFullPlusCode = OpenLocationCode.isFull(value);
    const isShortPlusCode = OpenLocationCode.isShort(value);
    const isValidAddress = isAddress(value);
    const isValidAccount = value.toLowerCase().startsWith("0x");
    if (isValidAddress) {
      result = getAccountDomains(value).map((item) => item.domain);
    } else if (isValidAccount) {
      result =
        domainsInfo
          ?.filter(
            (item) =>
              item.owner.startsWith(value) || item.user.startsWith(value)
          )
          .map((item) => item.domain) ?? [];
    } else if (isFullPlusCode || isShortPlusCode) {
      let checkDomain;
      if (isShortPlusCode && location && locationPermission) {
        checkDomain = OpenLocationCode.recoverNearest(
          value,
          location.coords.latitude,
          location.coords.longitude
        );
      } else if (isFullPlusCode) {
        checkDomain = value;
      } else {
        return;
      }
      // Find nearest matching domains not owned or near the user location
      const point = OpenLocationCode.decode(checkDomain) as any;
      const domain = OpenLocationCode.encode(
        point.latitudeCenter,
        point.longitudeCenter,
        11
      );
      if (!domainsArray.data?.includes(domain)) {
        setAvailableDomain(domain);
      }
    }
    const sorted =
      location && locationPermission
        ? sortedByNearest.filter((item) => result.includes(item))
        : result;
    setSearchResult(sorted);
    setSearchQuery(value.toUpperCase());
  };

  useEffect(() => {
    if (location && locationPermission) {
      const domain = OpenLocationCode.encode(
        location.coords.latitude,
        location.coords.longitude,
        11
      );
      if (!domainsArray.data?.includes(domain)) {
        setBuyLocation(domain);
      }
      if (domainsArray.data?.includes(domain)) {
        setBuyLocation(null);
      }
      if (availableDomain && domainsArray.data?.includes(availableDomain)) {
        setAvailableDomain(null);
      }
      if (domainsArray.data) {
        const sorted = [...domainsArray.data].sort((a, b) => {
          const aDistance = getDistance(location, a);
          const bDistance = getDistance(location, b);
          return aDistance - bDistance;
        });
        setSortedByNearest(sorted);
      }
    }
  }, [location, locationPermission, domainsArray.data]);

  const AvailableDomainsComponent = () => {
    return (
      <YStack gap={2}>
        {availableDomain && <NewDomain domain={availableDomain} />}
        {buyLocation && <NewDomain domain={buyLocation} isUserLocation />}
      </YStack>
    );
  };

  return (
    <>
      <YStack gap={1}>
        <ThemedText type="subtitle">Find a Tangiblink Domain</ThemedText>
        <ThemedText type="subtext">
          Search domains by plus codes or account addresses
        </ThemedText>
        <Input
          value={searchQuery}
          onChangeText={onValueChange}
          placeholder="Search..."
          style={{ marginVertical: 10 }}
        />
        <ThemedText type="info">
          Filtered search results: {searchResult.length}
        </ThemedText>
        <LocationPermissionRequest />
      </YStack>
      <FlashList
        ref={flashListRef}
        onViewableItemsChanged={visibleItemsChanged}
        ListHeaderComponent={AvailableDomainsComponent}
        initialScrollIndex={0}
        data={
          searchResult.length > 0
            ? searchResult
            : location && locationPermission
            ? sortedByNearest
            : domainsArray.data
            ? [...domainsArray.data]
            : []
        }
        renderItem={({ item }) => <DomainItem item={getDomainInfo(item)} />}
        estimatedItemSize={50}
        ListEmptyComponent={
          <>
            <YStack p="$2" mih={50} ai={"center"}>
              <ThemedText type="subtitle">
                {domainInfoLoading ? "Loading..." : "No domains found."}
              </ThemedText>
              {domainInfoLoading && <Spinner m={"$2"} />}
            </YStack>
            <Separator themeInverse />
          </>
        }
      />
      <FlashSheetScrollButton
        onPress={scrollToTop}
        showButton={scrollButtonVisible}
      />
    </>
  );
}

export function DomainItem({ item }: { item: any }) {
  const domainsPendingTransfer = useTransferDomainStore(
    (state) => state.domainsPendingTransfer
  );
  const location = useLocationPermissionStore((state) => state.location);
  const locationPermission = useAppSettings(
    (state) => state.locationPermission
  );
  const pendingTransfer = domainsPendingTransfer.includes(item.domain);

  return (
    <YStack
      br="$5"
      bw={1}
      boc={"$accentColor"}
      p="$2"
      mb="$1"
      mih={50}
      onPress={() => {
        !pendingTransfer && router.navigate(`/${item.domain}`);
      }}
    >
      <XStack gap="$4" alignItems="center">
        <Image
          source={require("@/assets/images/logoIcon.png")}
          style={{ width: 50, height: 50 }}
        />
        <YStack gap="$1.5">
          <ThemedText type="subtitle">{item.domain}</ThemedText>
          <ThemedText type="subtext">
            {`Owner: ${shortenAddress(item.owner)}`}
          </ThemedText>
          {location && locationPermission && (
            <ThemedText type="info">
              {`Distance: ${formatDistance(
                getDistance(location, item.domain)
              )}`}
            </ThemedText>
          )}
          {pendingTransfer && (
            <ThemedText type="subtext">
              Pending transfer of ownership!
            </ThemedText>
          )}
        </YStack>
      </XStack>
    </YStack>
  );
}

// New domain type
type NewDomainProps = {
  domain: string;
  isUserLocation?: boolean;
};

export function NewDomain({ domain, isUserLocation }: NewDomainProps) {
  const location = useLocationPermissionStore((state) => state.location);
  const setBuyDomain = useBuyDomainStore((state) => state.setBuyDomain);
  const setBuySheetOpen = useBuyDomainStore((state) => state.setBuySheetOpen);
  function onPress() {
    setBuyDomain(domain);
    setBuySheetOpen(true);
  }

  return (
    <YStack
      br="$5"
      bw={1}
      boc={"$accentColor"}
      bc={"$green5Dark"}
      p="$2"
      m="$1"
      mih={50}
      onPress={() => {
        onPress();
      }}
    >
      <XStack gap="$4" alignItems="center">
        <Image
          source={require("@/assets/images/logoIcon.png")}
          style={{ width: 50, height: 50 }}
        />
        <YStack gap="$1.5">
          {isUserLocation && (
            <ThemedText type="subtitle">Your location is available!</ThemedText>
          )}
          {!isUserLocation && (
            <ThemedText type="subtitle">New domain available!</ThemedText>
          )}
          <ThemedText type="defaultSemiBold">{`Purchase ${domain}`}</ThemedText>
          {location && (
            <ThemedText type="info">
              {`Distance: ${formatDistance(getDistance(location, domain))}`}
            </ThemedText>
          )}
        </YStack>
      </XStack>
    </YStack>
  );
}
