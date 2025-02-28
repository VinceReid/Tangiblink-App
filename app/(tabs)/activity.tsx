import { Spinner, Separator, YStack, XStack, View, Theme } from "tamagui";
import { useState } from "react";
import { ThemedText } from "@/components/ThemedText";
import { contract, chain } from "@/constants/thirdweb";
import { Container } from "@/components/Container";
import { Pressable } from "react-native";
import { Content } from "@/components/Content";
import useContractData from "@/hooks/useContractData";
import { DomainsFlashList } from "@/components/DomainFlashList";
import { TransactionFlashList } from "@/components/TransactionFlashList";
import { useScreenIndexStore } from "@/store/screenIndexStore";
import { ExternalLinkOnPress } from "@/components/ExternalLink";

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

export default function ActivityScreen() {
  const activityScreenIndex = useScreenIndexStore(
    (state) => state.activityScreenIndex
  );
  const setActivityScreenIndex = useScreenIndexStore(
    (state) => state.setActivityScreenIndex
  );
  // State to track moving forward and backward in the domain pages
  const [movingForward, setMovingForward] = useState(false);

  function onForward() {
    const isLastScreen = activityScreenIndex === activityPages.length - 1;
    if (isLastScreen) {
      return;
    } else {
      setMovingForward(true);
      setActivityScreenIndex(activityScreenIndex + 1);
    }
  }
  function onBack() {
    const isFirstScreen = activityScreenIndex === 0;
    if (isFirstScreen) {
      return;
    } else {
      setMovingForward(false);
      setActivityScreenIndex(activityScreenIndex - 1);
    }
  }
  const swipes = Gesture.Simultaneous(
    Gesture.Fling().runOnJS(true).direction(Directions.RIGHT).onStart(onBack),
    Gesture.Fling().runOnJS(true).direction(Directions.LEFT).onStart(onForward)
  );

  const activityPages = [
    {
      step: "Recent Domains",
      content: <DomainsSection />,
    },
    {
      step: "Recent Transfers",
      content: <EventsSection />,
    },
  ];
  const data = activityPages[activityScreenIndex].content;

  return (
    <Container>
      <Content>
        <ContractInfoSection />
        <Separator />
        <GestureDetector gesture={swipes}>
          <YStack gap="$2" f={1}>
            <XStack gap="$2" mx="$3.5">
              {activityPages.map((item, index) => (
                <YStack f={1} key={index}>
                  <Pressable onPress={() => setActivityScreenIndex(index)}>
                    <View alignItems="center">
                      <ThemedText
                        type={
                          index === activityScreenIndex ? "subtext" : "default"
                        }
                      >
                        {item.step}
                      </ThemedText>
                    </View>
                    <View
                      h="$0.5"
                      bg={index === activityScreenIndex ? "$color10" : "gray"}
                      br="$5"
                    />
                  </Pressable>
                </YStack>
              ))}
            </XStack>
            <YStack f={1} key={activityScreenIndex}>
              <Animated.View
                entering={movingForward ? SlideInRight : SlideInLeft}
                exiting={movingForward ? SlideOutLeft : SlideOutRight}
                style={{ flex: 1 }}
              >
                {data}
              </Animated.View>
            </YStack>
          </YStack>
        </GestureDetector>
      </Content>
    </Container>
  );
}

function ContractInfoSection() {
  const { nameQuery, totalMinted } = useContractData();

  return (
    <Theme name={"accent"}>
      <YStack
        gap="$2"
        br="$5"
        p="$2"
        mih={50}
        bg={"$background"}
        onPress={() =>
          ExternalLinkOnPress(
            `${chain.blockExplorers?.[0]?.url}/address/${contract.address}`
          )
        }
      >
        <ThemedText type="subtext">
          Tangiblink domain registry contract information.
        </ThemedText>
        <ThemedText type="info">
          Contract name: <ThemedText>{nameQuery.data}</ThemedText>{" "}
        </ThemedText>
        <ThemedText type="info">
          Contract address: <ThemedText>{contract.address}</ThemedText>{" "}
        </ThemedText>
        <ThemedText type="info">
          Network: <ThemedText>{contract.chain.name}</ThemedText>{" "}
        </ThemedText>
        <ThemedText type="info">
          Domains minted:{" "}
          <ThemedText>{totalMinted.data?.toString()}</ThemedText>{" "}
        </ThemedText>
      </YStack>
    </Theme>
  );
}

function EventsSection() {
  const { transfers, transfersLoading } = useContractData();
  const transfersSlice = transfers?.slice(0,10);
  return (
    <YStack f={1}>
      <ThemedText type="subtext">10 most recent transfers</ThemedText>
      <TransactionFlashList
        isLoading={transfersLoading}
        events={transfersSlice}
        type="transfers"
        showDomain
      />
    </YStack>
  );
}

function DomainsSection() {
  const { domainsArray } = useContractData();
  const domains = domainsArray.data?.slice(-10)?.reverse();
  return (
    <YStack f={1}>
      <ThemedText type="subtext">10 most recent domains.</ThemedText>
      <DomainsFlashList domains={domains ?? []} />
    </YStack>
  );
}
