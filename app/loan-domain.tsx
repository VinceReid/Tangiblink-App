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
  XStack,
  YStack,
  Spinner,
  AnimatePresence,
  Theme,
} from "tamagui";
import useContractData from "@/hooks/useContractData";
import { ThemedText } from "@/components/ThemedText";
import { useLoanAgreementStore } from "@/store/loanAgreementStore";
import { LoanDomainForm } from "@/components/LoanDomainForm";
import { KeyboardAwareScrollContent } from "@/components/ScrollContent";
import { useActiveAccount, TransactionButton } from "thirdweb/react";
import { ConnectWalletButton } from "@/components/ConnectWallet";
import { plusCodeToTokenId } from "@/utils/plusCodeToTokenId";
import loanDomainTx from "@/components/transactions/loanDomainTx";
import { useToastController } from "@tamagui/toast";
import { fromUnixTime } from "date-fns";
import { ModalHeader } from "@/components/ModalHeader";
import { LoadingContent } from "@/components/LoadingContent";
import { ExternalLinkOnPress } from "@/components/ExternalLink";

export default function LoanDomain() {
  const account = useActiveAccount();
  const theme = useTheme();
  const color = theme.color.get();
  const router = useRouter();
  const toast = useToastController();
  const themeName = "dark";
  const [transactionConfirmed, setTransactionConfirmed] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { userExpires, getDomainInfo, domainInfoLoading } = useContractData();
  // Destructuring the store
  const domain = useLoanAgreementStore((state) => state.loanDomain);
  const loanExpiry = useLoanAgreementStore((state) => state.loanExpiry);
  const setLoanExpiry = useLoanAgreementStore((state) => state.setLoanExpiry);
  const loanAddress = useLoanAgreementStore((state) => state.loanAddress);
  const setLoanAddress = useLoanAgreementStore((state) => state.setLoanAddress);
  const isValidated = useLoanAgreementStore((state) => state.isValidated);
  const setIsValidated = useLoanAgreementStore((state) => state.setIsValidated);
  const loanDomainsPendingTransactions = useLoanAgreementStore(
    (state) => state.loanDomainsPendingTransactions
  );
  const setLoanDomainsPendingTransactions = useLoanAgreementStore(
    (state) => state.setLoanDomainsPendingTransactions
  );

  const domainInfo = getDomainInfo(domain);
  const user = domainInfo?.user;
  const currentLoanExpiryUnix =
    Number(userExpires({ tokenId: plusCodeToTokenId(domain) }).data) ??
    Number.MAX_SAFE_INTEGER;
  const currentLoanExpiryDate =
    currentLoanExpiryUnix < Number.MAX_SAFE_INTEGER
      ? fromUnixTime(currentLoanExpiryUnix).toLocaleString()
      : Date.now();
  const owner = domainInfo?.owner;

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
      setTransactionConfirmed(false);
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
    const transaction = loanDomainTx({
      domain,
      user: loanAddress,
      expiry: loanExpiry,
    });
    return transaction;
  };

  const onClick = () => {
    toast.show("Confirm the transaction with your wallet provider", {
      message: `Please confirm the transaction to loan the domain to another user.`,
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
    setLoanDomainsPendingTransactions([
      ...loanDomainsPendingTransactions,
      domain,
    ]);
    setIsValidated(false);
    setLoanAddress("");
    setLoanExpiry(new Date());
  };

  const onTransactionConfirmed = (result: any) => {
    toast.show("Congratulations! 🎉", {
      message: `Your transaction has been confirmed and the domain has been loaned.`,
      type: "success",
      duration: 5000,
      action: {
        label: "Navigate to account",
        onPress: () => router && router.navigate("/(tabs)/"),
      },
    });
    setLoanDomainsPendingTransactions(
      loanDomainsPendingTransactions.filter(
        (loanedDomain) => loanedDomain !== domain
      )
    );
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

  function GetLoanedDomainInfo() {
    if (user !== owner) {
      return (
        <Theme name={"accent"}>
          <ThemedText type="warning">
            This domain is currently loaned to a user
          </ThemedText>
          <XStack
            key={"loan-details"}
            animation="lazy"
            gap={"$2"}
            justifyContent="space-between"
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
            <YStack f={1} gap={"$2"} alignItems="center">
              <ThemedText type="subtext">Loaned to user address</ThemedText>
              <ThemedText>{user}</ThemedText>
              <Separator />
              <ThemedText type="subtext">Current Loan expiry</ThemedText>
              <ThemedText type="default">
                {currentLoanExpiryDate.toLocaleString()}
              </ThemedText>
            </YStack>
          </XStack>
          <Separator />
        </Theme>
      );
    }
  }
  if (domainInfoLoading || !domainInfo) {
    return (
      <Container>
        <Stack.Screen
          options={{
            title: "Loan Domain",
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
          title: "Loan Domain",
          headerShown: true,
          headerTransparent: true,
          headerTitleAlign: "center",
          headerTitleStyle: { color: color },
          headerTintColor: color,
        }}
      />
      <KeyboardAwareScrollContent>
        <ModalHeader defaultIcon="loanDomain" domain={domain} />
        <GetLoanedDomainInfo />
        {user !== owner && (
          <ThemedText type="subtitle">Loan to another user</ThemedText>
        )}
        <ThemedText>
          Enter the address of the user loaning the domain and the loan expiry
          date.
        </ThemedText>
        {isValidated && (
          <>
            <Separator />
            <ThemedText type="subtext">
              The loan agreement will be activated after confirming the
              transaction.
            </ThemedText>
            {account ? (
              <TransactionButton
                key={`set-loan-${domain}`}
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
        {loanDomainsPendingTransactions.includes(domain) ? (
          <AnimatePresence>
            <Theme name={"accent"}>
              <YStack
                f={1}
                gap={"$2"}
                justifyContent="center"
                alignItems="center"
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
                <Spinner m={"$2"} size="large" />
                <ThemedText type="subtext">
                  Transaction pending confirmation
                </ThemedText>
              </YStack>
            </Theme>
          </AnimatePresence>
        ) : (
          <LoanDomainForm domain={domain} />
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
