import { Stack, useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { BackHandler } from "react-native";
import { UnsavedDialog } from "@/components/UnsavedDialog";
import { Container } from "@/components/Container";
import { chain } from "@/constants/thirdweb";
import {
  useTheme,
  Separator,
  Text,
  Spinner,
  XStack,
  Theme,
} from "tamagui";
import { ThemedText } from "@/components/ThemedText";
import { useTransferDomainStore } from "@/store/transferDomainStore";
import { TransferDomainForm } from "@/components/TransferDomainForm";
import { KeyboardAwareScrollContent } from "@/components/ScrollContent";
import { useActiveAccount, TransactionButton } from "thirdweb/react";
import { ConnectWalletButton } from "@/components/ConnectWallet";
import transferDomainTx from "@/components/transactions/transferDomainTx";
import { useToastController } from "@tamagui/toast";
import { ModalHeader } from "@/components/ModalHeader";
import useContractData from "@/hooks/useContractData";
import { LoadingContent } from "@/components/LoadingContent";
import { ExternalLinkOnPress } from "@/components/ExternalLink";

export default function TransferDomain() {
  const account = useActiveAccount();
  const theme = useTheme();
  const color = theme.color.get();
  const router = useRouter();
  const toast = useToastController();
  const themeName = "dark";
  const [transactionConfirmed, setTransactionConfirmed] = useState(false);
  const [transactionSent, setTransactionSent] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { getDomainInfo, domainInfoLoading } = useContractData();
  const [loading, setLoading] = useState(true);
  // Destructuring the store
  const domain = useTransferDomainStore((state) => state.transferDomain);
  const transferTo = useTransferDomainStore((state) => state.transferTo);
  const setTransferTo = useTransferDomainStore((state) => state.setTransferTo);
  const isValidated = useTransferDomainStore((state) => state.isValidated);
  const setIsValidated = useTransferDomainStore(
    (state) => state.setIsValidated
  );
  const domainsPendingTransfer = useTransferDomainStore(
    (state) => state.domainsPendingTransfer
  );
  const setDomainsPendingTransfer = useTransferDomainStore(
    (state) => state.setDomainsPendingTransfer
  );

  const domainInfo = getDomainInfo(domain);
  const isOwner =
    domainInfo && account
      ? domainInfo?.owner.toLowerCase() === account.address.toLowerCase()
      : false;

  useEffect(() => {
    const onBackPress = () => {
      if (isValidated && !isDialogOpen && !transactionConfirmed) {
        setIsDialogOpen(true);
        return true;
      }
      if (isValidated && isDialogOpen && !transactionConfirmed) {
        setIsDialogOpen(false);
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
  }, [isDialogOpen, isValidated, transactionConfirmed]);

  const onSendTransaction = () => {
    const transaction = transferDomainTx({
      domain: domain,
      to: transferTo,
    });
    return transaction;
  };

  const onClick = () => {
    toast.show("Confirm the transaction with your wallet provider", {
      message: `Please confirm the transaction to transfer the domain to another user.`,
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
    setDomainsPendingTransfer([...domainsPendingTransfer, domain]);
    setTransactionSent(true);
  };

  const onTransactionConfirmed = (result: any) => {
    toast.show("Congratulations! 🎉", {
      message: `Your transaction has been confirmed and the domain ownership has been transferred.`,
      type: "success",
      duration: 5000,
      action: {
        label: "Navigate to account",
        onPress: () => router && router.navigate("/(tabs)/"),
      },
    });
    setDomainsPendingTransfer(
      domainsPendingTransfer.filter((domain) => domain !== domain)
    );
    setIsValidated(false);
    setTransferTo("");
    setTransactionConfirmed(true);
  };

  const onError = (error: any) => {
    console.error("Transaction error!", error);
    if (error.message.includes("Error: Request expired. Please try again.")) {
      toast.show("Transaction response delay!", {
        message: `Please check if the transaction completed before resubmitting another.`,
        type: "error",
        duration: 5000,
      });
      return;
    }
    toast.show("Transaction failed!", {
      message: `There was an error processing your transaction.\n\n${error.message}`,
      type: "error",
      duration: 5000,
    });
  };
  if (domainInfoLoading || !domainInfo) {
    return (
      <Container>
        <Stack.Screen
          options={{
            title: "Transfer Domain",
            headerShown: true,
            headerTransparent: true,
            headerTitleAlign: "center",
            headerTitleStyle: { color: color },
            headerTintColor: color,
          }}
        />
        <LoadingContent />
      </Container>
    );
  }
  !isOwner && router.replace(`/not-authorized`);
  return (
    <Container>
      <Stack.Screen
        options={{
          title: "Transfer Domain",
          headerShown: true,
          headerTransparent: true,
          headerTitleAlign: "center",
          headerTitleStyle: { color: color },
          headerTintColor: color,
        }}
      />
      <KeyboardAwareScrollContent>
        <ModalHeader defaultIcon="transferDomain" domain={domain} />
        {!isValidated && !transactionSent && (
          <>
            <ThemedText>Transfer Domain ownership to another user</ThemedText>
            <ThemedText>
              Enter the address of the user to transfer the domain ownership to.
            </ThemedText>
          </>
        )}
        {isValidated && !transactionSent && (
          <>
            <Separator />
            <ThemedText type="subtext">
              The domain ownership will be transferred after confirming the
              transaction.
            </ThemedText>
            {account ? (
              <TransactionButton
                key={`transfer-ownership-${domain}`}
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
            ) : (
              <ConnectWalletButton />
            )}
          </>
        )}
        <Separator />
        {!transactionSent ? (
          <TransferDomainForm domain={domain} />
        ) : !transactionConfirmed ? (
          <Spinner m={"$2"} size="large" />
        ) : (
          <Theme name={"accent"}>
            <XStack
              animation="lazy"
              gap={"$2"}
              padding={"$2"}
              borderWidth={1}
              borderRadius={"$4"}
              bg={"$background"}
              enterStyle={{
                opacity: 0,
                y: 10,
                scale: 0.9,
              }}
              exitStyle={{
                opacity: 0,
                y: -10,
                scale: 0.9,
              }}
            >
              <ThemedText>
                The domain ownership has been successfully transferred to
                another user account.
              </ThemedText>
            </XStack>
          </Theme>
        )}
      </KeyboardAwareScrollContent>
      <UnsavedDialog
        message={"You have unsaved changes. Are you sure you want to leave?"}
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
      />
    </Container>
  );
}
