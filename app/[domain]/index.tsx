import { Stack, useRouter, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Container } from "@/components/Container";
import { Content } from "@/components/Content";

import { useTheme, XStack, YStack, Separator, View, ScrollView } from "tamagui";
import { Pressable } from "react-native";
import useContractData from "@/hooks/useContractData";
import { ThemedText } from "@/components/ThemedText";
import { plusCodeToTokenId } from "@/utils/plusCodeToTokenId";
import { MapDomainView } from "@/components/MapDomainView";
import { useSetRecordsStore } from "@/store/setRecordsStore";
import { useActiveAccount } from "thirdweb/react";
import {
  DomainActions,
  ViewOnMapAction,
  MapDirectionsAction,
} from "@/components/DomainActions";
import { DomainInformation } from "@/components/DomainInformation";
import { DomainProfileRecords } from "@/components/DomainProfileRecords";
import { useScreenIndexStore } from "@/store/screenIndexStore";
import {
  GestureDetector,
  Gesture,
  Directions,
} from "react-native-gesture-handler";
import Animated, {
  SlideOutLeft,
  SlideInRight,
  SlideOutRight,
  SlideInLeft,
} from "react-native-reanimated";
import { PreviewSwitch } from "@/components/PreviewSwitch";

export default function Domain() {
  const { domain } = useLocalSearchParams() as { domain: string };
  const theme = useTheme();
  const color = theme.color.get();
  const router = useRouter();
  const { domainsArray, getDomainInfo, keysOf } = useContractData();
  const domainInfo = getDomainInfo(domain);
  const tokenId = plusCodeToTokenId(domain);
  const recordKeys = keysOf(tokenId);
  const account = useActiveAccount();
  const isOwner =
    domainInfo && account
      ? domainInfo.owner?.toLowerCase() === account.address.toLowerCase()
      : false;
  const isUser =
    domainInfo && account
      ? domainInfo.user?.toLowerCase() === account.address.toLowerCase()
      : false;
  const isAdmin = isOwner || isUser;

  // Destructuring the store
  const setExistingKeys = useSetRecordsStore((state) => state.setExistingKeys);
  const domainScreenIndex = useScreenIndexStore(
    (state) => state.domainScreenIndex
  );
  const setDomainScreenIndex = useScreenIndexStore(
    (state) => state.setDomainScreenIndex
  );
  useEffect(() => {
    if (recordKeys.data) {
      setExistingKeys([...recordKeys.data.slice()]);
    }
  }, [recordKeys.data]);

  // State to track moving forward and backward in the domain pages
  const [movingForward, setMovingForward] = useState(false);

  function onForward() {
    const isLastScreen = domainScreenIndex === domainPages.length - 1;
    if (isLastScreen) {
      return;
    } else {
      setMovingForward(true);
      setDomainScreenIndex(domainScreenIndex + 1);
    }
  }
  function onBack() {
    const isFirstScreen = domainScreenIndex === 0;
    if (isFirstScreen) {
      return;
    } else {
      setMovingForward(false);
      setDomainScreenIndex(domainScreenIndex - 1);
    }
  }

  const swipes = Gesture.Simultaneous(
    Gesture.Fling().runOnJS(true).direction(Directions.RIGHT).onStart(onBack),
    Gesture.Fling().runOnJS(true).direction(Directions.LEFT).onStart(onForward)
  );

  const domainPages = [
    {
      step: "Profile",
      content: (
        <DomainProfileRecords
          domain={domain}
          recordKeys={recordKeys.data ? [...recordKeys.data.slice()] : []}
          isLoading={recordKeys.isLoading}
        />
      ),
    },
    {
      step: "Actions",
      content: (
        <DomainActions
          domain={domain}
          recordKeys={recordKeys.data ? [...recordKeys.data.slice()] : []}
        />
      ),
    },
    {
      step: "Details",
      content: <DomainInformation domain={domain} domainInfo={domainInfo} />,
    },
    {
      step: "Map",
      content: (
        <YStack gap="$4">
          <MapDomainView domain={domain} />
          <XStack gap="$4" justifyContent="center">
            <ViewOnMapAction domain={domain} />
            <MapDirectionsAction domain={domain} />
          </XStack>
        </YStack>
      ),
    },
  ];
  const data = domainPages[domainScreenIndex].content;

  return !domainsArray.data?.includes(domain) ? (
    router.replace(`/${domain}/domain-not-found`)
  ) : (
    <Container>
      <Stack.Screen
        options={{
          title: domain,
          headerShown: true,
          headerTransparent: true,
          headerTitleAlign: "center",
          headerTitleStyle: { color: color },
          headerTintColor: color,
        }}
      />
      <Content>
        {/* <ModalHeader defaultIcon="viewDomain" domain={domain} /> */}
        <PreviewSwitch isAdmin={isAdmin} />
        <Separator />
        <GestureDetector gesture={swipes}>
          <YStack gap="$2" f={1}>
            <XStack gap="$2" mx="$3.5">
              {domainPages.map((item, index) => (
                <YStack f={1} key={index}>
                  <Pressable onPress={() => setDomainScreenIndex(index)}>
                    <View alignItems="center">
                      <ThemedText
                        type={
                          index === domainScreenIndex ? "subtext" : "default"
                        }
                      >
                        {item.step}
                      </ThemedText>
                    </View>
                    <View
                      h="$0.5"
                      bg={index === domainScreenIndex ? "$color10" : "gray"}
                      br="$5"
                    />
                  </Pressable>
                </YStack>
              ))}
            </XStack>
            <ScrollView>
              <YStack f={1} key={domainScreenIndex}>
                <Animated.View
                  entering={movingForward ? SlideInRight : SlideInLeft}
                  exiting={movingForward ? SlideOutLeft : SlideOutRight}
                >
                  {data}
                </Animated.View>
              </YStack>
            </ScrollView>
          </YStack>
        </GestureDetector>
      </Content>
    </Container>
  );
}
