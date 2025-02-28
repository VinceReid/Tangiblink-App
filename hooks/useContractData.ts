import { useContractEvents, useReadContract } from "thirdweb/react";
import { chain, client } from "@/constants/thirdweb";
import { convertCryptoToFiat } from "thirdweb/pay";
import { contract } from "@/constants/thirdweb";
import { transferEvent } from "thirdweb/extensions/erc721";
import { useEffect } from "react";
import { prepareEvent, readContract } from "thirdweb";
import { useActiveAccount } from "thirdweb/react";
import { useContractDataStore } from "@/store/contractDataStore";
import { useToastController } from "@tamagui/toast";
import { toEther } from "thirdweb/utils";
import { useTransactionStore } from "@/store/transactionStore";
export type DomainInfo = {
  domain: string;
  tokenId: bigint;
  owner: string;
  user: string;
  isLoaned: boolean;
};

export default function useContractData() {
  const account = useActiveAccount();
  const address = account?.address;
  const toast = useToastController();
  const latestPaymentTxHash = useTransactionStore(
    (state) => state.latestPaymentTxHash
  );
  const setLatestPaymentTxHash = useTransactionStore(
    (state) => state.setLatestPaymentTxHash
  );
  // Payments received
  const paymentsReceived = useContractDataStore(
    (state) => state.paymentsReceived
  );
  const setPaymentsReceived = useContractDataStore(
    (state) => state.setPaymentsReceived
  );
  const paymentsReceivedLoading = useContractDataStore(
    (state) => state.paymentsReceivedLoading
  );
  const setPaymentsReceivedLoading = useContractDataStore(
    (state) => state.setPaymentsReceivedLoading
  );
  const transfers = useContractDataStore((state) => state.transfers);
  const setTransfers = useContractDataStore((state) => state.setTransfers);
  const transfersLoading = useContractDataStore(
    (state) => state.transfersLoading
  );
  const setTransfersLoading = useContractDataStore(
    (state) => state.setTransfersLoading
  );
  // Domain info loading state
  const domainInfoLoading = useContractDataStore(
    (state) => state.domainInfoLoading
  );
  const setDomainInfoLoading = useContractDataStore(
    (state) => state.setDomainInfoLoading
  );
  // Domains info
  const domainsInfo = useContractDataStore((state) => state.domainsInfo);
  const setDomainsInfo = useContractDataStore((state) => state.setDomainsInfo);
  //  useReadContract hook to read the name of the contract
  const nameQuery = useReadContract({
    contract,
    method: "function name() returns (string)",
  });
  //  useReadContract hook to read the total minted tokens
  const totalMinted = useReadContract({
    contract,
    method: "function getTokenIdsCount() view returns (uint256 count)",
    params: [],
  });
  //  useReadContract hook to read the tokenIds array
  const tokenIdArray = useReadContract({
    contract,
    method:
      "function getTokenIdsArray(uint256 start, uint256 finish) view returns (uint256[])",
    params: [BigInt(0), BigInt(totalMinted.data ?? 0)],
  });
  //  useReadContract hook to read the domains array
  const domainsArray = useReadContract({
    contract,
    method:
      "function getPlusCodesArray(uint256 start, uint256 finish) view returns (string[])",
    params: [BigInt(0), BigInt(totalMinted.data ?? 0)],
  });
  // Prepare the contract events
  const setRecordPreparedEvent = prepareEvent({
    signature:
      "event Set(uint256 indexed tokenId, string indexed keyIndex, string indexed valueIndex, string key, string value)",
  });
  const resetRecordsPreparedEvent = prepareEvent({
    signature: "event ResetRecords(uint256 indexed tokenId)",
  });
  const updateUserPreparedEvent = prepareEvent({
    signature:
      "event UpdateUser(uint256 indexed tokenId, address indexed user, uint64 expires)",
  });
  const payDomainPreparedEvent = prepareEvent({
    signature:
      "event PayDomain(address indexed addressTo, uint256 indexed tokenId, string plusCode, uint256 amount, uint256 paid, uint256 fee, string data)",
  });

  //  useContractEvents hook to listen for events
  // Transfer events
  const transferEvents = useContractEvents({
    contract,
    events: [transferEvent()],
    blockRange: 1000000,
  });
  // Pay domain events
  const payDomainEvents = useContractEvents({
    contract,
    events: [payDomainPreparedEvent],
    blockRange: 1000000,
  });
  // Update user events
  const updateUserEvents = useContractEvents({
    contract,
    events: [updateUserPreparedEvent],
    blockRange: 1000000,
  });
  // Set and Reset records events
  const setAndResetRecordsEvents = useContractEvents({
    contract,
    events: [setRecordPreparedEvent, resetRecordsPreparedEvent],
    blockRange: 1000000,
  });
  // useReadContract hook to read owner of a token
  const ownerOf = (tokenId: bigint) =>
    useReadContract({
      contract,
      method: "function ownerOf(uint256 tokenId) view returns (address)",
      params: [tokenId],
    });
  // useReadContract hook to read the user of a token
  const userOf = ({ tokenId }: { tokenId: bigint }) =>
    useReadContract({
      contract,
      method: "function userOf(uint256 tokenId) view returns (address)",
      params: [tokenId],
    });
  // useReadContract hook to read the user expires of a token
  const userExpires = ({ tokenId }: { tokenId: bigint }) =>
    useReadContract({
      contract,
      method: "function userExpires(uint256 tokenId) view returns (uint256)",
      params: [tokenId],
    });
  //  useReadContract hook to read the owners array
  const ownersArray = useReadContract({
    contract,
    method:
      "function getOwnersArray(uint256 start, uint256 finish) view returns (address[])",
    params: [BigInt(0), BigInt(totalMinted.data ?? 0)],
  });
  // useReadContract hook to read the users array
  const usersArray = useReadContract({
    contract,
    method:
      "function getUsersArray(uint256 start, uint256 finish) view returns (address[])",
    params: [BigInt(0), BigInt(totalMinted.data ?? 0)],
  });
  // useReadContract hook to read the keys of a token
  const keysOf = (tokenId: bigint) =>
    useReadContract({
      contract,
      method: "function getKeysOf(uint256 tokenId) view returns (string[])",
      params: [tokenId],
    });
  // useReadContract hook to read the record of a token
  const getRecord = (key: string, tokenId: bigint) =>
    useReadContract({
      contract,
      method:
        "function get(string key, uint256 tokenId) view returns (string value)",
      params: [key, tokenId],
    });
  // useReadContract hook to read many records of a token
  const getManyRecords = (keys: string[], tokenId: bigint) =>
    useReadContract({
      contract,
      method:
        "function getMany(string[] keys, uint256 tokenId) view returns (string[] values)",
      params: [keys, tokenId],
    });

  //  find token id in tokenIdArray and return the index
  const findIndexOfTokenId = (tokenId: bigint): number | undefined => {
    return tokenIdArray.data?.findIndex((id) => id === tokenId);
  };
  //  find domain in domainsArray and return the index
  const findIndexOfDomain = (domain: string): number | undefined => {
    return domainsArray.data?.findIndex((code) => code === domain);
  };
  //  find domain in domainsArray by index and return the domain
  const findDomainByIndex = (index: number) => {
    return domainsArray.data?.[index];
  };
  // find owner in ownersArray by index and return the owner
  const findOwnerByIndex = (index: number) => {
    return ownersArray.data?.[index];
  };
  // find user in usersArray by index and return the user
  const findUserByIndex = (index: number) => {
    return usersArray.data?.[index];
  };
  // find token id in tokenIdArray by index and return the token id
  const findTokenIdByIndex = (index: number) => {
    return tokenIdArray.data?.[index];
  };
  //  useReadContract hook to read the price of a token
  const checkPrice = useReadContract({
    contract,
    method: "function checkPrice() view returns (uint256)",
    params: [],
  });
  // get the domains array info
  function getDomainsArrayInfo(): DomainInfo[] {
    return domainsArray.data
      ? domainsArray.data.map((domain, index) => {
          const owner = findOwnerByIndex(index) ?? "";
          const user = findUserByIndex(index) ?? "";
          return {
            domain,
            tokenId: findTokenIdByIndex(index) ?? 0n,
            owner,
            user,
            isLoaned: user !== owner,
          };
        })
      : [];
  }

  function getAccountDomains(address: string) {
    return domainsInfo.filter((item) => {
      return (
        item.owner?.toLowerCase() === address.toLowerCase() ||
        item.user?.toLowerCase() === address.toLowerCase()
      );
    });
  }

  // get the domain info by domain
  function getDomainInfo(domain: string): DomainInfo | undefined {
    const domainInfo = domainsInfo.find((item) => item.domain === domain);
    return domainInfo;
  }

  // UseEffect to set the domain info
  useEffect(() => {
    if (
      totalMinted.data === undefined ||
      tokenIdArray.data === undefined ||
      domainsArray.data === undefined ||
      ownersArray.data === undefined ||
      usersArray.data === undefined
    ) {
      return;
    }
    const domainsInfo = getDomainsArrayInfo();
    setDomainsInfo(domainsInfo);
  }, [
    totalMinted.data,
    tokenIdArray.data,
    domainsArray.data,
    ownersArray.data,
    usersArray.data,
  ]);

  // UseEffect to set the domain info loading state
  useEffect(() => {
    if (
      totalMinted.isLoading ||
      tokenIdArray.isLoading ||
      domainsArray.isLoading ||
      ownersArray.isLoading ||
      usersArray.isLoading
    ) {
      setDomainInfoLoading(true);
      return;
    }
    setDomainInfoLoading(false);
  }, [
    totalMinted.isLoading,
    tokenIdArray.isLoading,
    domainsArray.isLoading,
    ownersArray.isLoading,
    usersArray.isLoading,
  ]);

  //  UseEffect to update the owned domains
  useEffect(() => {
    if (transferEvents.isLoading) return;
    domainsArray.refetch();
    totalMinted.refetch();
    tokenIdArray.refetch();
    ownersArray.refetch();
    usersArray.refetch();
  }, [transferEvents.data]);

  useEffect(() => {
    if (payDomainEvents.data && address) {
      const payments = payDomainEvents.data?.filter((event: any) => {
        return event.args.addressTo.toLowerCase() === address.toLowerCase();
      });
      setPaymentsReceivedLoading(false);
      const uniquePayments = payments
        .filter(
          (v, i, a) =>
            a.findIndex((t) => t.transactionHash === v.transactionHash) === i
        )
        .reverse();
      if (uniquePayments.length === paymentsReceived.length) return;
      setPaymentsReceived(uniquePayments);
      const newestPayment = payments.slice(-1)[0];
      if (newestPayment.transactionHash === latestPaymentTxHash) return;
      setLatestPaymentTxHash(newestPayment.transactionHash);
      const domainName = newestPayment.args.plusCode;
      const amount = newestPayment.args.paid;
      toast.show("New payment received", {
        message:
          domainName && amount
            ? `Received ${toEther(amount)} ${
                chain.nativeCurrency?.symbol
              } to ${domainName}`
            : undefined,
        type: "success",
        duration: 5000,
      });
    }
  }, [payDomainEvents.data, address]);

  useEffect(() => {
    if (transferEvents.data) {
      setTransfersLoading(false);
      const uniqueTransfers = transferEvents.data
        .filter(
          (v, i, a) =>
            a.findIndex((t) => t.transactionHash === v.transactionHash) === i
        )
        .reverse();
      if (uniqueTransfers.length === transfers.length) return;
      setTransfers(uniqueTransfers);
    }
  }, [transferEvents.data]);

  return {
    nameQuery,
    totalMinted,
    domainsArray,
    ownersArray,
    ownerOf,
    userOf,
    userExpires,
    keysOf,
    getRecord,
    getManyRecords,
    findIndexOfTokenId,
    findDomainByIndex,
    findIndexOfDomain,
    findOwnerByIndex,
    getAccountDomains,
    domainInfoLoading,
    domainsInfo,
    getDomainInfo,
    transfers,
    transfersLoading,
    updateUserEvents,
    payDomainEvents,
    setAndResetRecordsEvents,
    checkPrice,
    paymentsReceived,
    paymentsReceivedLoading,
  };
}
