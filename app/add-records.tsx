import { Stack, useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { BackHandler } from "react-native";
import { UnsavedDialog } from "@/components/UnsavedDialog";
import { Container } from "@/components/Container";
import { chain } from "@/constants/thirdweb";
import { useTheme, Separator, Text } from "tamagui";
import useContractData from "@/hooks/useContractData";
import { ThemedText } from "@/components/ThemedText";
import { useSetRecordsStore } from "@/store/setRecordsStore";
import { AddRecordForm } from "@/components/AddRecordForm";
import { KeyboardAwareScrollContent } from "@/components/ScrollContent";
import { useActiveAccount, TransactionButton } from "thirdweb/react";
import { ConnectWalletButton } from "@/components/ConnectWallet";
import { ModalHeader } from "@/components/ModalHeader";
import { LoadingContent } from "@/components/LoadingContent";
import {
  setRecordTx,
  setManyRecordsTx,
} from "@/components/transactions/setRecordsTx";
import { useToastController } from "@tamagui/toast";
import { ExternalLinkOnPress } from "@/components/ExternalLink";

export default function AddRecords() {
  const account = useActiveAccount();
  const theme = useTheme();
  const color = theme.color.get();
  const router = useRouter();
  const toast = useToastController();
  const themeName = "dark";     
  const [transactionConfirmed, setTransactionConfirmed] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { getDomainInfo, domainInfoLoading } = useContractData();
  // Destructuring the store
  const existingKeys = useSetRecordsStore((state) => state.existingKeys);
  const records = useSetRecordsStore((state) => state.records);
  const domain = useSetRecordsStore((state) => state.recordsDomain);
  const definedKey = useSetRecordsStore((state) => state.definedKey);
  const deleteAllRecords = useSetRecordsStore(
    (state) => state.deleteAllRecords
  );
  const domainInfo = getDomainInfo(domain);
  const isUser =
    domainInfo && account
      ? domainInfo.user.toLowerCase() === account.address.toLowerCase()
      : false;

  useEffect(() => {
    const onBackPress = () => {
      if (records.length > 0 && !isDialogOpen && !transactionConfirmed) {
        setIsDialogOpen(true);
        return true;
      }
      if (records.length > 0 && isDialogOpen && !transactionConfirmed) {
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
  }, [isDialogOpen, records, transactionConfirmed]);

  const onSendTransaction = () => {
    if (records.length > 1) {
      const transaction = setManyRecordsTx({
        domain,
        keys: records.map((record) => record.key),
        values: records.map((record) => record.value),
      });
      return transaction;
    }
    const transaction = setRecordTx({
      domain,
      key: records[0].key,
      value: records[0].value,
    });
    return transaction;
  };

  const onClick = () => {
    toast.show("Confirm the transaction with your wallet provider", {
      message: `You are about to set ${records.length} record(s) for ${domain}.`,
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
    deleteAllRecords();
  };

  const onTransactionConfirmed = (result: any) => {
    toast.show("Congratulations! 🎉", {
      message: `Your transaction has been confirmed and your records have been set for ${domain}.`,
      type: "success",
      duration: 5000,
      action: {
        label: "Navigate to account",
        onPress: () => router && router.navigate("/(tabs)/"),
      },
    });
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
  if (domainInfoLoading || !domainInfo) {
    return (
      <Container>
        <Stack.Screen
          options={{
            title: "Add records",
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
  !isUser && router.replace(`/not-authorized`);
  return (
    <Container>
      <Stack.Screen
        options={{
          title: "Add records",
          headerShown: true,
          headerTransparent: true,
          headerTitleAlign: "center",
          headerTitleStyle: { color: color },
          headerTintColor: color,
        }}
      />
      <KeyboardAwareScrollContent>
        <ModalHeader defaultIcon="addRecord" domain={domain} />
        <ThemedText type="default">
          Set one or more records, each with a key and associated value.
        </ThemedText>
        {records.length > 0 ? (
          <>
            <Separator />
            <ThemedText type="subtext">
              New records will be saved when you confirm the transaction.
            </ThemedText>
            {account ? (
              <TransactionButton
                key={`set-records-${domain}`}
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
        ) : null}
        <Separator />
        <AddRecordForm existingKeys={existingKeys} definedKey={definedKey} />
      </KeyboardAwareScrollContent>
      <UnsavedDialog
        message={"You have unsaved changes. Are you sure you want to leave?"}
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
      />
    </Container>
  );
}
