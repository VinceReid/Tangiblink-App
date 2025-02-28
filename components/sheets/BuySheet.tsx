import { chain } from "@/constants/thirdweb";
import { LucideIcon } from "@/components/LucideIcons";
import { Sheet } from "@tamagui/sheet";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Text, useTheme, Spinner } from "tamagui";
import mintTx from "@/components/transactions/mintTx";
import mintWithRecordsTx from "@/components/transactions/mintWithRecordsTx";
import { ThemedButton } from "@/components/ThemedButton";
import { TransactionButton, useActiveAccount } from "thirdweb/react";
import { toEther } from "thirdweb";
import useContractData from "@/hooks/useContractData";
import { ConnectWalletButton } from "@/components/ConnectWallet";
import { useToastController } from "@tamagui/toast";
import { ThemedText } from "@/components/ThemedText";
import { useSetRecordsStore } from "@/store/setRecordsStore";
import { useBuyDomainStore } from "@/store/buyDomainStore";
import { SheetHeader } from "@/components/SheetHeader";
import { ExternalLinkOnPress } from "@/components/ExternalLink";
import { useConfettiStore } from "@/components/ConfettiAnimation";

export const BuySheet = () => {
  // Destructuring the store
  const domain = useBuyDomainStore((state) => state.buyDomain);
  const buySheetOpen = useBuyDomainStore((state) => state.buySheetOpen);
  const setBuySheetOpen = useBuyDomainStore((state) => state.setBuySheetOpen);
  const setBuyWithRecordSheetOpen = useBuyDomainStore(
    (state) => state.setBuyWithRecordSheetOpen
  );
  const deleteAllRecords = useSetRecordsStore(
    (state) => state.deleteAllRecords
  );
  const records = useSetRecordsStore((state) => state.records);
  const setPlayConfetti = useConfettiStore((state) => state.setPlayConfetti);

  const router = useRouter();
  const theme = useTheme();
  const themeName = "dark";
  const [position, setPosition] = useState(0);
  const [transactionConfirmed, setTransactionConfirmed] = useState(false);
  const {
    checkPrice,
    domainsArray,
    ownersArray,
    findIndexOfDomain,
    findOwnerByIndex,
  } = useContractData();
  const price = checkPrice.data;
  const adjustedPrice = price ? price * BigInt(11) / BigInt(10) : 0n;
  const priceLoading = checkPrice.isLoading;
  const account = useActiveAccount();
  const toast = useToastController();

  const onSendTransaction = (adjustedPrice: bigint) => {
    if (records.length > 0) {
      const transaction = mintWithRecordsTx({
        domain,
        payable: toEther(adjustedPrice),
        keys: records.map((record) => record.key),
        values: records.map((record) => record.value),
      });
      return transaction;
    }
    const transaction = mintTx({ domain, payable: toEther(adjustedPrice) });
    return transaction;
  };

  useEffect(() => {
    if (!domainsArray.data?.includes(domain)) {
      return;
    }
    if (ownersArray.data?.length === domainsArray.data?.length) {
      const domainIndex = findIndexOfDomain(domain);
      const owner = findOwnerByIndex(domainIndex ?? 0);
      if (owner === account) {
        setTransactionConfirmed(true);
        setPlayConfetti(true);
      } else {
        setBuyWithRecordSheetOpen(false);
        setBuySheetOpen(false);
      }
    }
  }, [domainsArray]);

  useEffect(() => {
    if (!buySheetOpen) {
      setTransactionConfirmed(false);
      return;
    }
    checkPrice.refetch();
  }, [buySheetOpen]);

  // Reset the transaction state when domain changes
  useEffect(() => {
    setTransactionConfirmed(false);
  }, [domain]);

  const onClick = () => {
    toast.show("Confirm the transaction with your wallet provider", {
      message: `You are about to purchase ${domain} for ${toEther(
        adjustedPrice ?? 0n
      )} ${chain.nativeCurrency?.symbol}.`,
      type: "info",
      duration: 5000,
    });
  };

  const onTransactionSent = (result: any) => {
    const url = `${chain.blockExplorers?.[0]?.url}/tx/${result.transactionHash}`;
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
    toast.show("Congratulations! 🎉", {
      message: `You are the proud owner of ${domain}.\n\nHead to your account to manage your new domain.`,
      type: "success",
      duration: 5000,
      action: {
        label: "Navigate to account",
        onPress: () => router && router.navigate("/(tabs)/"),
      },
    });
    deleteAllRecords();
    setPlayConfetti(true);
    setTransactionConfirmed(true);
  };

  const onError = (error: any) => {
    console.error("Transaction error!", error);
    toast.show("Transaction failed!", {
      message: `There was an error processing your transaction.\n\n${error.message}`,
      type: "error",
      duration: 5000,
    });
  };

  return (
    <Sheet
      forceRemoveScrollEnabled={buySheetOpen}
      open={buySheetOpen}
      onOpenChange={setBuySheetOpen}
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
        p="$4"
        justifyContent="center"
        alignItems="center"
        gap="$5"
      >
        {transactionConfirmed ? (
          <>
            <ThemedText type="title">Success! 🎉</ThemedText>
            <ThemedButton
              iconAfter={<LucideIcon defaultIcon="viewDomain" />}
              onPress={() => router && router.navigate(`/${domain}`)}
              title={`View ${domain}`}
              variant="primary"
              centered
              size="medium"
            />
          </>
        ) : (
          <>
            <SheetHeader title="Buy Domain" defaultIcon="buy" domain={domain} />
            <ThemedText type="subtext">
              Price (~$0.5 USD):{" "}
              {adjustedPrice ? (
                `${toEther(adjustedPrice)} ${chain.nativeCurrency?.symbol}`
              ) : priceLoading ? (
                <Spinner size={"small"} />
              ) : (
                "Error fetching price"
              )}
            </ThemedText>
            {adjustedPrice && account ? (
              <TransactionButton
                key={`buy-${domain}`}
                style={{ backgroundColor: theme.accentBackground.get() }}
                theme={themeName}
                onClick={() => onClick()}
                transaction={() => onSendTransaction(adjustedPrice)}
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
            )}
            <ThemedButton
              iconAfter={<LucideIcon defaultIcon="chevronUp" />}
              onPress={() => setBuyWithRecordSheetOpen(true)}
              title={`Add records (${records.length})`}
              variant="primary"
              centered
              size="medium"
            />
          </>
        )}
      </Sheet.Frame>
    </Sheet>
  );
};
