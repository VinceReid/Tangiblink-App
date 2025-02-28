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
  AnimatePresence,
  YStack,
} from "tamagui";
import useContractData from "@/hooks/useContractData";
import { ThemedText } from "@/components/ThemedText";
import { useSetRecordsStore } from "@/store/setRecordsStore";
import { EditRecordsForm } from "@/components/EditRecordsForm";
import { ScrollContent } from "@/components/ScrollContent";
import { useActiveAccount, TransactionButton } from "thirdweb/react";
import { ConnectWalletButton } from "@/components/ConnectWallet";
import { plusCodeToTokenId } from "@/utils/plusCodeToTokenId";
import {
  setRecordTx,
  setManyRecordsTx,
  reconfigureRecordsTx,
  resetRecordsTx,
} from "@/components/transactions/setRecordsTx";
import { useToastController } from "@tamagui/toast";
import { ModalHeader } from "@/components/ModalHeader";
import { LoadingContent } from "@/components/LoadingContent";
import { ExternalLinkOnPress } from "@/components/ExternalLink";

export default function EditRecords() {
  const account = useActiveAccount();
  const theme = useTheme();
  const color = theme.color.get();
  const router = useRouter();
  const toast = useToastController();
  const themeName = "dark";
  const [transactionConfirmed, setTransactionConfirmed] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { getManyRecords, getDomainInfo, domainInfoLoading } =
    useContractData();
  // Destructuring the store
  const existingKeys = useSetRecordsStore((state) => state.existingKeys);
  const setExistingRecords = useSetRecordsStore(
    (state) => state.setExistingRecords
  );
  const domain = useSetRecordsStore((state) => state.recordsDomain);
  const editedRecords = useSetRecordsStore((state) => state.editedRecords);
  const deletedRecords = useSetRecordsStore((state) => state.deletedRecords);
  const existingRecords = useSetRecordsStore((state) => state.existingRecords);
  const resetDeletedAndEditedRecords = useSetRecordsStore(
    (state) => state.resetDeletedAndEditedRecords
  );
  const domainInfo = getDomainInfo(domain);
  const existingValues = getManyRecords(
    existingKeys,
    plusCodeToTokenId(domain)
  );

  useEffect(() => {
    if (existingValues.data) {
      setExistingRecords(
        existingKeys.map((key, index) => ({
          key,
          value: existingValues.data[index],
        }))
      );
    }
  }, [existingValues.data]);

  const isUser =
    domainInfo && account
      ? domainInfo.user?.toLowerCase() === account.address.toLowerCase()
      : false;

  useEffect(() => {
    const onBackPress = () => {
      if (
        (editedRecords.length > 0 || deletedRecords.length > 0) &&
        !isDialogOpen &&
        !transactionConfirmed
      ) {
        setIsDialogOpen(true);
        return true;
      }
      if (
        (editedRecords.length > 0 || deletedRecords.length > 0) &&
        isDialogOpen &&
        !transactionConfirmed
      ) {
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
  }, [isDialogOpen, editedRecords, deletedRecords, transactionConfirmed]);

  const onSendTransaction = () => {
    if (editedRecords.length > 1 && deletedRecords.length === 0) {
      const transaction = setManyRecordsTx({
        domain,
        keys: editedRecords.map((record) => record.key),
        values: editedRecords.map((record) => record.value),
      });
      return transaction;
    }
    if (editedRecords.length === 1 && deletedRecords.length === 0) {
      const transaction = setRecordTx({
        domain,
        key: editedRecords[0].key,
        value: editedRecords[0].value,
      });
      return transaction;
    }
    if (deletedRecords.length === existingRecords.length) {
      const transaction = resetRecordsTx({ domain });
      return transaction;
    }
    if (editedRecords.length > 0 && deletedRecords.length > 0) {
      const editedNotDeletedRecords = editedRecords.filter((record) => {
        return !deletedRecords.includes(record.key);
      });
      const unchangedRecords = existingRecords.filter((record) => {
        return (
          !editedRecords.find(
            (editedRecord) => editedRecord.key === record.key
          ) && !deletedRecords.includes(record.key)
        );
      });
      const transaction = reconfigureRecordsTx({
        domain,
        keys: [
          ...editedNotDeletedRecords.map((record) => record.key),
          ...unchangedRecords.map((record) => record.key),
        ],
        values: [
          ...editedNotDeletedRecords.map((record) => record.value),
          ...unchangedRecords.map((record) => record.value),
        ],
      });
      return transaction;
    }
    const unchangedRecords = existingRecords.filter((record) => {
      return !deletedRecords.includes(record.key);
    });
    const transaction = reconfigureRecordsTx({
      domain,
      keys: unchangedRecords.map((record) => record.key),
      values: unchangedRecords.map((record) => record.value),
    });
    return transaction;
  };

  const onClick = () => {
    toast.show("Confirm the transaction with your wallet provider", {
      message: `You are about to edit record(s) for ${domain}.`,
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
    resetDeletedAndEditedRecords();
  };

  const onTransactionConfirmed = (result: any) => {
    toast.show("Congratulations! 🎉", {
      message: `Your transaction has been confirmed and your records have been edited for ${domain}.`,
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
            title: "Edit records",
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
          title: "Edit records",
          headerShown: true,
          headerTransparent: true,
          headerTitleAlign: "center",
          headerTitleStyle: { color: color },
          headerTintColor: color,
        }}
      />
      <ScrollContent>
        <ModalHeader defaultIcon="editRecord" domain={domain} />
        <ThemedText type="default">
          Select a record to edit or delete.
        </ThemedText>
        {editedRecords.length > 0 || deletedRecords.length > 0 ? (
          <AnimatePresence>
            <YStack key="confirm-transaction" gap="$2">
              <Separator />
              <ThemedText type="subtext">
                Edits and deletions will be saved when you confirm the
                transaction.
              </ThemedText>
              {account ? (
                <TransactionButton
                  key={`edit-records-${domain}`}
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
            </YStack>
          </AnimatePresence>
        ) : null}
        <Separator />
        {existingValues.isLoading || !existingValues.data ? (
          <Spinner />
        ) : (
          <EditRecordsForm />
        )}
      </ScrollContent>
      <UnsavedDialog
        message={"You have unsaved changes. Are you sure you want to leave?"}
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
      />
    </Container>
  );
}
