import { useState, useEffect } from "react";
import { LucideIcon } from "@/components/LucideIcons";
import { isAddress } from "thirdweb";
import {
  YStack,
  Separator,
  XStack,
  Form,
  Button,
  Input,
  AnimatePresence,
  Theme,
} from "tamagui";
import { ThemedText } from "@/components/ThemedText";
import { useLoanAgreementStore } from "@/store/loanAgreementStore";
import { ErrorDialog } from "@/components/ErrorDialog";
import { useToastController } from "@tamagui/toast";
import { DatePicker } from "@/components/DatePicker";
import { formatDistanceToNow, isAfter, isBefore } from "date-fns";
import { Paste } from "@/components/ClipboardCopyPaste";

export function LoanDomainForm({ domain }: { domain: string }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [error, setError] = useState("");
  const toast = useToastController();
  //   Destructuring the store
  const loanDuration = useLoanAgreementStore((state) => state.loanDuration);
  const setLoanDuration = useLoanAgreementStore(
    (state) => state.setLoanDuration
  );
  const loanExpiry = useLoanAgreementStore((state) => state.loanExpiry);
  const setLoanExpiry = useLoanAgreementStore((state) => state.setLoanExpiry);
  const loanAddress = useLoanAgreementStore((state) => state.loanAddress);
  const setLoanAddress = useLoanAgreementStore((state) => state.setLoanAddress);
  const isValidated = useLoanAgreementStore((state) => state.isValidated);
  const setIsValidated = useLoanAgreementStore((state) => state.setIsValidated);

  //   every second update the loan duration
  useEffect(() => {
    const interval = setInterval(() => {
      if (loanExpiry && isAfter(loanExpiry, Date.now())) {
        setLoanDuration(
          formatDistanceToNow(loanExpiry, { includeSeconds: true })
        );
      } else {
        setLoanDuration("Expired");
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [loanExpiry]);

  //   If the loan expiry is in the past, show an error and set Validated to false
  useEffect(() => {
    if (loanDuration === "Expired" && isValidated) {
      toast.show("Invalid expiry date", {
        message: `Expiry date should be in the future.`,
        type: "error",
        duration: 5000,
      });
      setError(
        "The loan expiry date has been exceeded. Please set a new expiry date"
      );
      setIsDialogOpen(true);
      setIsValidated(false);
    }
  }, [loanDuration]);

  function validateLoan() {
    if (isBefore(loanExpiry, Date.now())) {
      setError("Expiry date should be in the future");
      setIsDialogOpen(true);
      return;
    }
    if (!loanAddress) {
      setError(
        "Please enter a valid address to set the loan agreement. Should start with 0x. eg. 0x1234..."
      );
      setIsDialogOpen(true);
      return;
    }
    if (!isAddress(loanAddress)) {
      setError(
        "Not a valid address, please use a different address or edit the existing entry."
      );
      setIsDialogOpen(true);
      return;
    }
    toast &&
      toast.show("Loan details set", {
        message: `Remember to confirm the transaction to activate the loan agreement.`,
        type: "info",
        duration: 3000,
      });
    setIsValidated(true);
  }

  function onLoanAddressChange(address: string) {
    setLoanAddress(address);
  }

  function editLoanDetails() {
    setIsValidated(false);
  }

  return (
    <YStack f={1} gap={"$2"}>
      <AnimatePresence>
        {isValidated ? (
          <Theme name="accent">
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
              <YStack f={1} gap={"$2"}>
                <ThemedText type="subtitle">Loan Agreement</ThemedText>
                <ThemedText type="subtext">Loan Domain</ThemedText>
                <ThemedText>{domain}</ThemedText>
                <ThemedText type="subtext">Loan to user address</ThemedText>
                <ThemedText>{loanAddress}</ThemedText>
                <Separator />
                <ThemedText type="subtext">Loan expiry</ThemedText>
                <ThemedText type="default">
                  {loanExpiry.toLocaleString()}
                </ThemedText>
                <Separator />
                <ThemedText type="subtext">Loan duration</ThemedText>
                <ThemedText type="default">{loanDuration}</ThemedText>
              </YStack>
              <Button
                icon={<LucideIcon defaultIcon="editRecord" size={16} />}
                onPress={() => editLoanDetails()}
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
            backgroundColor="$background"
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
            <ThemedText type="subtitle">Set loan agreement</ThemedText>
            <YStack gap={"$4"}>
              <XStack gap="$2" flex={1} alignItems="center">
                <ThemedText>Loan to user:</ThemedText>
                <Paste setValue={setLoanAddress} type="address" />
              </XStack>
              <Input
                size={"$4"}
                value={loanAddress}
                placeholder={`User account address...`}
                onChangeText={onLoanAddressChange}
                multiline
              />
              <ThemedText type="info">
                {`Set Loan expiry: `}
                <ThemedText>{loanExpiry.toLocaleString()}</ThemedText>
              </ThemedText>
              <DatePicker date={loanExpiry} setDate={setLoanExpiry} />
              <ThemedText type="info">
                {`Loan Duration: `}
                <ThemedText> {loanDuration}</ThemedText>
              </ThemedText>
            </YStack>
            <ThemedText type="subtext">
              Validate the agreement prior to confirming the confirming the
              transaction
            </ThemedText>
            <Form.Trigger asChild>
              <Button icon={<LucideIcon defaultIcon="validate" size={16} />}>
                Validate loan
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
