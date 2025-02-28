import { useState } from "react";
import { LucideIcon } from "@/components/LucideIcons";
import { isAddress } from "thirdweb";
import {
  YStack,
  XStack,
  Form,
  Button,
  Input,
  AnimatePresence,
  Theme,
} from "tamagui";
import { ThemedText } from "@/components/ThemedText";
import { useTransferDomainStore } from "@/store/transferDomainStore";
import { ErrorDialog } from "@/components/ErrorDialog";
import { useToastController } from "@tamagui/toast";
import { Paste } from "@/components/ClipboardCopyPaste";

export function TransferDomainForm({ domain }: { domain: string }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [error, setError] = useState("");
  const toast = useToastController();
  //   Destructuring the store
  const transferTo = useTransferDomainStore((state) => state.transferTo);
  const setTransferTo = useTransferDomainStore((state) => state.setTransferTo);
  const isValidated = useTransferDomainStore((state) => state.isValidated);
  const setIsValidated = useTransferDomainStore(
    (state) => state.setIsValidated
  );

  function validateLoan() {
    if (!transferTo) {
      setError(
        "Please enter a valid address to transfer to. Should start with 0x. eg. 0x1234..."
      );
      setIsDialogOpen(true);
      return;
    }
    if (!isAddress(transferTo)) {
      setError(
        "Not a valid address, please use a different address or edit the existing entry."
      );
      setIsDialogOpen(true);
      return;
    }
    toast &&
      toast.show("Transfer address set", {
        message: `Remember to confirm the transaction to transfer the domain.`,
        type: "info",
        duration: 3000,
      });
    setIsValidated(true);
  }

  function onTransferToAddressChange(address: string) {
    setTransferTo(address);
  }

  function editTransferToAddress() {
    setIsValidated(false);
  }

  return (
    <YStack f={1} gap={"$2"}>
      <AnimatePresence>
        {isValidated ? (
          <Theme name={"accent"}>
            <XStack
              theme={"accent"}
              key={"transfer-domain-details"}
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
              <YStack f={1} gap={"$2"}>
                <ThemedText type="subtext">
                  Transfer Domain Ownership of:
                </ThemedText>
                <ThemedText>{domain}</ThemedText>
                <ThemedText type="subtext">
                  Transfer to user address:
                </ThemedText>
                <ThemedText>{transferTo}</ThemedText>
              </YStack>
              <Button
                icon={<LucideIcon defaultIcon="edit" size={16} />}
                onPress={() => editTransferToAddress()}
              />
            </XStack>
          </Theme>
        ) : (
          <Form
            animation="lazy"
            gap="$4"
            onSubmit={validateLoan}
            borderWidth={1}
            borderRadius="$4"
            borderColor="$borderColor"
            padding="$3"
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
            <ThemedText type="subtitle">Set transfer address</ThemedText>
            <YStack gap={"$4"}>
              <XStack gap="$2" flex={1} alignItems="center">
                <ThemedText type="default">Transfer to:</ThemedText>
                <Paste setValue={setTransferTo} type="address" />
              </XStack>
              <Input
                size={"$4"}
                value={transferTo}
                placeholder={`User account address...`}
                onChangeText={onTransferToAddressChange}
                multiline
              />
            </YStack>
            <ThemedText type="subtext">
              Validate the address prior to confirming the confirming the
              transaction
            </ThemedText>
            <Form.Trigger asChild>
              <Button icon={<LucideIcon defaultIcon="validate" size={16} />}>
                Validate address
              </Button>
            </Form.Trigger>
          </Form>
        )}
      </AnimatePresence>
      <ErrorDialog
        error={error}
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
      />
    </YStack>
  );
}
