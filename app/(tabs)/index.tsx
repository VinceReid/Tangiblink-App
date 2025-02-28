import { YStack, View, XStack, Separator, ScrollView } from "tamagui";
import { Container } from "@/components/Container";
import { ThemedText } from "@/components/ThemedText";
import { useActiveAccount } from "thirdweb/react";
import { AccountDomainsFlashList } from "@/components/AccountDomainsFlashList";
import useContractData from "@/hooks/useContractData";
import { ConnectWalletButton } from "@/components/ConnectWallet";
import { TransactionFlashList } from "@/components/TransactionFlashList";
import { useState } from "react";
import { Pressable } from "react-native";
import { useScreenIndexStore } from "@/store/screenIndexStore";
import { Content } from "@/components/Content";
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

export default function AccountScreen() {
  const account = useActiveAccount();
  const indexScreenIndex = useScreenIndexStore(
    (state) => state.indexScreenIndex
  );
  const setIndexScreenIndex = useScreenIndexStore(
    (state) => state.setIndexScreenIndex
  );

  // State to track moving forward and backward in the domain pages
  const [movingForward, setMovingForward] = useState(false);

  function onForward() {
    const isLastScreen = indexScreenIndex === accountPages.length - 1;
    if (isLastScreen) {
      return;
    } else {
      setMovingForward(true);
      setIndexScreenIndex(indexScreenIndex + 1);
    }
  }
  function onBack() {
    const isFirstScreen = indexScreenIndex === 0;
    if (isFirstScreen) {
      return;
    } else {
      setMovingForward(false);
      setIndexScreenIndex(indexScreenIndex - 1);
    }
  }

  const swipes = Gesture.Simultaneous(
    Gesture.Fling().runOnJS(true).direction(Directions.RIGHT).onStart(onBack),
    Gesture.Fling().runOnJS(true).direction(Directions.LEFT).onStart(onForward)
  );

  const accountPages = [
    { step: "Domains", content: <AccountDomains /> },
    { step: "Payments", content: <PaymentHistory /> },
  ];
  const data = accountPages[indexScreenIndex].content;

  return (
    <Container>
      <Content>
        {account && <ThemedText type="subtext">Connected Account:</ThemedText>}
        {!account && (
          <ThemedText type="subtext">
            Log in to manage and interact with Tangiblink Domains
          </ThemedText>
        )}
        <ConnectWalletButton />
        <Separator />
        <GestureDetector gesture={swipes}>
          <YStack gap="$2" f={1}>
            <XStack gap="$2" mx="$3.5">
              {accountPages.map((item, index) => (
                <YStack f={1} key={index}>
                  <Pressable onPress={() => setIndexScreenIndex(index)}>
                    <View alignItems="center">
                      <ThemedText
                        type={
                          index === indexScreenIndex ? "subtext" : "default"
                        }
                      >
                        {item.step}
                      </ThemedText>
                    </View>
                    <View
                      h="$0.5"
                      bg={index === indexScreenIndex ? "$color10" : "gray"}
                      br="$5"
                    />
                  </Pressable>
                </YStack>
              ))}
            </XStack>
            <YStack f={1} key={indexScreenIndex}>
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

const AccountDomains = () => {
  const account = useActiveAccount();
  const address = account?.address;
  return (
    <YStack f={1}>
      {/* <ModalHeader defaultIcon="accountDomains" title="My domains" /> */}
      <ThemedText type="subtext">Select a domain to view or manage</ThemedText>
      {address && <AccountDomainsFlashList address={address} />}
      {!address && (
        <YStack br="$5" p="$2" mx="$2" mih={50}>
          <View ai={"center"}>
            <ThemedText type="subtitle">Log in to view your domains</ThemedText>
          </View>
        </YStack>
      )}
    </YStack>
  );
};

const PaymentHistory = () => {
  const account = useActiveAccount();
  const address = account?.address;
  const { paymentsReceived, paymentsReceivedLoading } = useContractData();

  return (
    <YStack f={1}>
      <ThemedText type="subtext">
        All payments received to your domains
      </ThemedText>
      {address && (
        <TransactionFlashList
          showDomain
          isLoading={paymentsReceivedLoading}
          events={paymentsReceived}
          type="payments"
        />
      )}
      {!address && (
        <YStack br="$5" p="$2" mx="$2" mih={50}>
          <View ai={"center"}>
            <ThemedText type="subtitle">
              Log in to view your received payments
            </ThemedText>
          </View>
        </YStack>
      )}
    </YStack>
  );
};
