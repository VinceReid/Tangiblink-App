import { useRouter } from "expo-router";
import { ActionButton } from "@/components/ActionButton";
import { XStack, YStack } from "tamagui";
import useContractData from "@/hooks/useContractData";
import { useTransactionDetailsStore } from "@/store/transactionDetailsStore";
import { useMapDirectionsStore } from "@/store/mapDirectionsStore";
import { useTransferDomainStore } from "@/store/transferDomainStore";
import { useRecordDetailsStore } from "@/store/recordDetailsStore";
import { useLoanAgreementStore } from "@/store/loanAgreementStore";
import { useQrSheetStore } from "@/store/qrSheetStore";
import { useMapStore } from "@/store/mapStore";
import { usePayStore } from "@/store/payStore";
import { useActiveAccount } from "thirdweb/react";
import { useSetRecordsStore } from "@/store/setRecordsStore";
import { ThemedText } from "@/components/ThemedText";
import { usePreviewStore } from "@/components/PreviewSwitch";

export function DomainActions({
  domain,
  recordKeys,
}: {
  domain: string;
  recordKeys: string[];
}) {
  const account = useActiveAccount();
  const { getDomainInfo } = useContractData();
  const domainInfo = getDomainInfo(domain);
  const owner = domainInfo?.owner;
  const user = domainInfo?.user;
  const isLoaned = domainInfo?.isLoaned;
  const isOwner =
    domainInfo && account
      ? domainInfo.owner?.toLowerCase() === account.address.toLowerCase()
      : false;
  const isUser =
    domainInfo && account
      ? domainInfo.user?.toLowerCase() === account.address.toLowerCase()
      : false;
  const preview = usePreviewStore((state) => state.preview);

  return (
    <YStack f={1} >
      {!preview && (isOwner || isUser) && (
        <YStack gap="$2">
          <ThemedText type="subtitle">Management actions</ThemedText>
          <XStack gap="$2" flexWrap="wrap" alignItems="center" >
            {isOwner && (
              <>
                <TransferDomainAction domain={domain} isOwner={isOwner} />
                <LoanDomainAction domain={domain} isOwner={isOwner} />
              </>
            )}
            <EditRecordsAction
              domain={domain}
              recordKeys={recordKeys}
              isUser={isUser}
            />
            <AddRecordsAction
              domain={domain}
              recordKeys={recordKeys}
              isUser={isUser}
            />
          </XStack>
        </YStack>
      )}
      <YStack gap="$2">
        <ThemedText type="subtitle">Domain actions</ThemedText>
        <XStack gap="$2" flexWrap="wrap" alignItems="center" >
          <MapDirectionsAction domain={domain} />
          <OpenTransactionsAction domain={domain} />
          <OpenRecordsAction domain={domain} />
          <PayDomainAction domain={domain} />
          <ViewOnMapAction domain={domain} />
          <ShareQRAction domain={domain} />
          <ViewOwnerAction owner={owner} />
          <ViewUserAction user={user} isLoaned={isLoaned} />
        </XStack>
      </YStack>
    </YStack>
  );
}

export const ViewDomainAction = ({ domain }: { domain: string }) => {
  const router = useRouter();
  function onViewDomain() {
    router.navigate(`/${domain}`);
  }
  return <ActionButton icon="viewDomain" title="View" onPress={onViewDomain} />;
};

export const ViewOnMapAction = ({ domain }: { domain: string }) => {
  const router = useRouter();
  const setViewDomain = useMapStore((state) => state.setViewDomain);
  function onViewDomainOnMap() {
    setViewDomain(domain);
    router.navigate(`/(tabs)/map`);
  }
  return (
    <ActionButton icon="map" title="View on Map" onPress={onViewDomainOnMap} />
  );
};

export const ViewOwnerAction = ({ owner }: { owner: string | undefined }) => {
  const router = useRouter();
  if (!owner) {
    return null;
  }
  function onViewOwner() {
    router.navigate(`/account/${owner}`);
  }
  return <ActionButton icon="owner" title="Owner" onPress={onViewOwner} />;
};

export const ViewUserAction = ({
  user,
  isLoaned,
}: {
  user: string | undefined;
  isLoaned: boolean | undefined;
}) => {
  const router = useRouter();
  if (!user || !isLoaned) {
    return null;
  }
  function onViewUser() {
    router.navigate(`/account/${user}`);
  }
  return <ActionButton icon="user" title="User" onPress={onViewUser} />;
};

export const TransferDomainAction = ({
  domain,
  isOwner,
}: {
  domain: string;
  isOwner: boolean;
}) => {
  const router = useRouter();
  const setTransferDomain = useTransferDomainStore(
    (state) => state.setTransferDomain
  );
  function onTransferDomain() {
    setTransferDomain(domain);
    router.push(`/transfer-domain`);
  }
  if (!isOwner) {
    return null;
  }
  return (
    <ActionButton
      manager
      icon="transferDomain"
      title="Transfer"
      onPress={onTransferDomain}
    />
  );
};

export const LoanDomainAction = ({
  domain,
  isOwner,
}: {
  domain: string;
  isOwner: boolean;
}) => {
  const router = useRouter();
  const setLoanDomain = useLoanAgreementStore((state) => state.setLoanDomain);
  function onLoanDomain() {
    setLoanDomain(domain);
    router.navigate(`/loan-domain`);
  }
  if (!isOwner) {
    return null;
  }
  return (
    <ActionButton
      manager
      icon="loanDomain"
      title="Loan"
      onPress={onLoanDomain}
    />
  );
};

export const EditRecordsAction = ({
  domain,
  recordKeys,
  isUser,
}: {
  domain: string;
  recordKeys: string[];
  isUser: boolean;
}) => {
  const router = useRouter();
  const setRecordsDomain = useSetRecordsStore(
    (state) => state.setRecordsDomain
  );
  const setExistingKeys = useSetRecordsStore((state) => state.setExistingKeys);
  function onEditRecords() {
    setExistingKeys([...recordKeys.slice()]);
    setRecordsDomain(domain);
    router.navigate(`/edit-records`);
  }
  if (!isUser || recordKeys.length === 0) {
    return null;
  }
  return (
    <ActionButton
      manager
      icon="editRecord"
      title="Edit Records"
      onPress={onEditRecords}
    />
  );
};

export const AddRecordsAction = ({
  domain,
  recordKeys,
  isUser,
}: {
  domain: string;
  recordKeys: string[];
  isUser: boolean;
}) => {
  const router = useRouter();
  const setRecordsDomain = useSetRecordsStore(
    (state) => state.setRecordsDomain
  );
  const setExistingKeys = useSetRecordsStore((state) => state.setExistingKeys);
  function onAddRecords() {
    setExistingKeys([...recordKeys.slice()]);
    setRecordsDomain(domain);
    router.navigate(`/add-records`);
  }
  if (!isUser) {
    return null;
  }
  return (
    <ActionButton
      manager
      icon="addRecord"
      title="Add Records"
      onPress={onAddRecords}
    />
  );
};

export const MapDirectionsAction = ({ domain }: { domain: string }) => {
  const setDirectToDomain = useMapDirectionsStore(
    (state) => state.setDirectToDomain
  );
  const setMapDirectionsPopUpOpen = useMapDirectionsStore(
    (state) => state.setMapDirectionsPopUpOpen
  );
  function onMapDirections() {
    setDirectToDomain(domain);
    setMapDirectionsPopUpOpen(true);
  }
  return (
    <ActionButton
      icon="mapDirections"
      title="Directions"
      onPress={onMapDirections}
    />
  );
};

export const OpenTransactionsAction = ({ domain }: { domain: string }) => {
  const router = useRouter();
  const setTransactionDetailsDomain = useTransactionDetailsStore(
    (state) => state.setTransactionDetailsDomain
  );
  function onOpenTransactions() {
    setTransactionDetailsDomain(domain);
    router.navigate(`/${domain}/transactions/options`);
  }
  return (
    <ActionButton
      icon="history"
      title="Tx History"
      onPress={onOpenTransactions}
    />
  );
};

export const OpenRecordsAction = ({ domain }: { domain: string }) => {
  const router = useRouter();
  const setRecordDetailsDomain = useRecordDetailsStore(
    (state) => state.setRecordDetailsDomain
  );
  function onOpenDomainRecords() {
    setRecordDetailsDomain(domain);
    router.navigate(`/${domain}/domain-records`);
  }
  return (
    <ActionButton
      icon="records"
      title="Records"
      onPress={onOpenDomainRecords}
    />
  );
};

export const PayDomainAction = ({ domain }: { domain: string }) => {
  const setPaySheetOpen = usePayStore((state) => state.setPaySheetOpen);
  const setDomainToPay = usePayStore((state) => state.setDomainToPay);
  function openPaySheet() {
    setDomainToPay(domain);
    setPaySheetOpen(true);
  }
  return <ActionButton icon="pay" title="Pay Domain" onPress={openPaySheet} />;
};

export const ShareQRAction = ({ domain }: { domain: string }) => {
  const setQrSheetOpen = useQrSheetStore((state) => state.setQrSheetOpen);
  const setQrDomain = useQrSheetStore((state) => state.setQrDomain);
  function onShareQR() {
    setQrDomain(domain);
    setQrSheetOpen(true);
  }
  return <ActionButton icon="qrCode" title="Share QR" onPress={onShareQR} />;
};
