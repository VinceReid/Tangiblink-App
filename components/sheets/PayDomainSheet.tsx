import { chain } from "@/constants/thirdweb";
import { LucideIcon } from "@/components/LucideIcons";
import { Sheet } from "@tamagui/sheet";
import { useRouter, useSegments } from "expo-router";
import { useState, useEffect } from "react";
import { BackHandler } from "react-native";
import { Text, useTheme, Spinner, Input, YStack } from "tamagui";
import payDomainTx from "@/components/transactions/payDomainTx";
import { ThemedButton } from "@/components/ThemedButton";
import { TransactionButton, useActiveAccount } from "thirdweb/react";
import useContractData from "@/hooks/useContractData";
import { ConnectWalletButton } from "@/components/ConnectWallet";
import { useToastController } from "@tamagui/toast";
import { ThemedText } from "@/components/ThemedText";
import { usePayStore } from "@/store/payStore";
import { KeyboardAwareScrollContent } from "@/components/ScrollContent";
import { UnsavedDialog } from "@/components/UnsavedDialog";
import { SheetHeader } from "@/components/SheetHeader";
import { ExternalLinkOnPress } from "@/components/ExternalLink";
import { useConfettiStore } from "@/components/ConfettiAnimation";

export const PayDomainSheet = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  // Destructuring the store
  const domainToPay = usePayStore((state) => state.domainToPay);
  const paySheetOpen = usePayStore((state) => state.paySheetOpen);
  const setPaySheetOpen = usePayStore((state) => state.setPaySheetOpen);
  const data = usePayStore((state) => state.data);
  const setData = usePayStore((state) => state.setData);
  const amountToPay = usePayStore((state) => state.amountToPay);
  const setAmountToPay = usePayStore((state) => state.setAmountToPay);
  const setPlayConfetti = useConfettiStore((state) => state.setPlayConfetti);
  const router = useRouter();
  const segments = useSegments();
  const theme = useTheme();
  const themeName = "dark";
  const [position, setPosition] = useState(0);
  const [confirmTransaction, setConfirmTransaction] = useState(false);
  const [transactionSent, setTransactionSent] = useState(false);
  const [transactionConfirmed, setTransactionConfirmed] = useState(false);
  const [transactionError, setTransactionError] = useState<String>("");
  const [currentSegment, setCurrentSegment] = useState(segments[0]);
  const { domainsInfo, domainInfoLoading } = useContractData();
  const domainInfo = domainsInfo.filter(
    (item) => item.domain === domainToPay
  )[0] ?? { domain: "", tokenId: 0n, owner: "", user: "", isLoaned: false };
  const account = useActiveAccount();
  const toast = useToastController();

  // useEffect to close the PaySheet when the segment changes
  useEffect(() => {
    if (segments[0] !== currentSegment) {
      setPaySheetOpen(false);
      setCurrentSegment(segments[0]);
    }
  }, [segments, currentSegment, paySheetOpen]);

  useEffect(() => {
    const onBackPress = () => {
      if (paySheetOpen) {
        if (amountToPay && !isDialogOpen && !transactionConfirmed) {
          setIsDialogOpen(true);
          return true;
        }
        if (amountToPay && isDialogOpen && !transactionConfirmed) {
          setIsDialogOpen(false);
          return true;
        }
        setPaySheetOpen(false);
        return true;
      }
      router.back();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      onBackPress
    );

    return () => backHandler.remove();
  }, [paySheetOpen, isDialogOpen, transactionConfirmed]);

  // UseEffect to reset the amount to pay when the domain changes
  useEffect(() => {
    resetTransactionState();
    if (!domainToPay) {
      setPaySheetOpen(false);
    }
  }, [domainToPay]);

  // Returns the prepared transaction
  const onSendTransaction = () => {
    setConfirmTransaction(true);
    const transaction = payDomainTx({
      domain: domainToPay,
      data: data,
      value: amountToPay,
    });
    return transaction;
  };

  const onClick = () => {
    toast.show("Confirm the transaction with your wallet provider", {
      message: `You are about to pay ${domainToPay} ${amountToPay} ${chain.nativeCurrency?.symbol}.`,
      type: "info",
      duration: 5000,
    });
  };

  const onTransactionSent = (result: any) => {
    const url = `${chain.blockExplorers?.[0]?.url}/tx/${result.transactionHash}`;
    setTransactionSent(true);
    toast.show("Transaction submitted", {
      message: `Your transaction has been submitted to the blockchain.`,
      type: "info",
      duration: 5000,
      action: {
        label: "View on Etherscan",
        onPress: () => ExternalLinkOnPress(url),
      },
    });
  };

  const onTransactionConfirmed = (result: any) => {
    toast.show("Payment sent! 🎉", {
      message: `${domainToPay} has received payment.\n\nHead to your account to view your transaction.`,
      type: "success",
      duration: 5000,
      action: {
        label: "Navigate to account",
        onPress: () => router && router.navigate("/(tabs)/"),
      },
    });
    setPlayConfetti(true);
    setConfirmTransaction(false);
    setTransactionConfirmed(true);
  };

  const onError = (error: any) => {
    console.error("Transaction error!", error);
    setTransactionError(error.message);
    toast.show("Transaction failed!", {
      message: `There was an error processing your transaction.\n\n${error.message}`,
      type: "error",
      duration: 5000,
    });
  };

  // Check the input for the payment reference
  const onChangePaymentReference = (text: string) => {
    // Max 100 characters
    if (text.length > 100) {
      return;
    }
    setData(text);
  };
  // Check the input for the amount to pay
  const onChangeAmountCrypto = (text: string) => {
    let amount = text;
    // if the text is '.' or starts with '.' add a '0' before it
    if (text === "." || text.startsWith(".")) {
      amount = "0" + text;
    }
    // Only allow numbers
    if (isNaN(Number(amount))) {
      return;
    }
    // Max 18 decimals
    if (amount.split(".")[1]?.length > 18) {
      return;
    }
    setAmountToPay(amount);
  };

  // Reset the transaction state
  function resetTransactionState() {
    setAmountToPay("");
    setData("");
    setConfirmTransaction(false);
    setTransactionSent(false);
    setTransactionConfirmed(false);
  }

  return (
    <Sheet
      forceRemoveScrollEnabled={paySheetOpen}
      open={paySheetOpen}
      onOpenChange={setPaySheetOpen}
      snapPointsMode={"fit"}
      dismissOnSnapToBottom
      position={position}
      onPositionChange={setPosition}
      zIndex={100_000}
    >
      <Sheet.Overlay
        animation="lazy"
        enterStyle={{ opacity: 0 }}
        exitStyle={{ opacity: 0 }}
      />
      <Sheet.Handle bg={"$color"} />
      <Sheet.Frame
        padding="$2"
        pb="$5"
        justifyContent="center"
        alignItems="center"
        gap="$4"
      >
        <KeyboardAwareScrollContent>
          {transactionConfirmed && !transactionError ? (
            <YStack
              flex={1}
              justifyContent="center"
              alignItems="center"
              gap="$4"
              padding="$2"
            >
              <ThemedText type="title">Success! 🎉</ThemedText>
              <ThemedButton
                iconAfter={<LucideIcon defaultIcon="pay" />}
                onPress={() =>
                  router &&
                  router.navigate(`/${domainToPay}/transactions/payments`)
                }
                title={`View ${domainToPay} transactions`}
                variant="primary"
                centered
                size="medium"
              />
              <ThemedButton
                variant="secondary"
                size="medium"
                centered
                onPress={resetTransactionState}
                title="Make another payment"
              />
            </YStack>
          ) : (
            <>
              <SheetHeader
                title="Pay Domain"
                defaultIcon="pay"
                domain={domainToPay}
              />
              {domainInfoLoading ? (
                <>
                  <Spinner size={"small"} />
                  <ThemedText type="defaultSemiBold">
                    Loading domain ownership info...
                  </ThemedText>
                </>
              ) : (
                <ThemedText type="defaultSemiBold">
                  {`Domain ${!domainInfo.isLoaned ? "owner" : "leaseholder"}: `}
                  <ThemedText type="subtext">{domainInfo.user}</ThemedText>
                </ThemedText>
              )}
              {!transactionError &&
              !transactionConfirmed &&
              !confirmTransaction ? (
                <>
                  <ThemedText type="defaultSemiBold">
                    {`Enter the amount to pay in ${chain.nativeCurrency?.symbol}:`}
                  </ThemedText>
                  <Input
                    flex={1}
                    size={"$4"}
                    placeholder={`* Amount... ${chain.nativeCurrency?.symbol}`}
                    alignSelf={"stretch"}
                    disabled={transactionSent}
                    value={amountToPay}
                    onChangeText={onChangeAmountCrypto}
                    keyboardType="numeric"
                  />
                  <ThemedText type="defaultSemiBold">
                    {`Payment reference: (Optional)`}
                  </ThemedText>
                  <Input
                    flex={1}
                    size={"$4"}
                    placeholder={`e.g. Gift payment...`}
                    alignSelf={"stretch"}
                    value={data}
                    onChangeText={onChangePaymentReference}
                  />
                  <ThemedText type="info">
                    {`* 1% fee will be deducted during processing.`}
                  </ThemedText>
                </>
              ) : (
                <>
                  <ThemedText type="defaultSemiBold">Paying:</ThemedText>
                  <ThemedText type="defaultSemiBold">
                    {`${amountToPay} ${chain.nativeCurrency?.symbol}:`}
                  </ThemedText>
                  <ThemedText type="defaultSemiBold">
                    Payment reference:
                  </ThemedText>
                  <ThemedText type="defaultSemiBold">
                    {`${data ?? "No reference"}`}
                  </ThemedText>
                  {transactionError && (
                    <>
                      <ThemedText type="warning">
                        A transaction error has occurred please check your
                        transaction history before processing another payment.
                      </ThemedText>
                      <ThemedText type="info">{transactionError}</ThemedText>
                    </>
                  )}
                </>
              )}

              {amountToPay ? (
                account && domainInfo.user ? (
                  <TransactionButton
                    key={`pay-${domainToPay}`}
                    style={{ backgroundColor: theme.accentBackground.get() }}
                    theme={themeName}
                    onClick={() => onClick()}
                    transaction={() => onSendTransaction()}
                    onTransactionSent={onTransactionSent}
                    onTransactionConfirmed={onTransactionConfirmed}
                    onError={onError}
                  >
                    <Text>Confirm Transaction</Text>
                  </TransactionButton>
                ) : !account ? (
                  <ConnectWalletButton />
                ) : (
                  <Spinner size={"small"} />
                )
              ) : (
                <ThemedText type="info">
                  {`* Transaction amount required`}
                </ThemedText>
              )}
            </>
          )}
        </KeyboardAwareScrollContent>
      </Sheet.Frame>
      <UnsavedDialog
        message={"You have unsaved changes. Are you sure you want to leave?"}
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        setPopUpOpen={setPaySheetOpen}
      />
    </Sheet>
  );
};
