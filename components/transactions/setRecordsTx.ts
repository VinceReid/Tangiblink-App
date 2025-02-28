import { prepareContractCall } from "thirdweb";
import { contract } from "@/constants/thirdweb";
import { plusCodeToTokenId } from "@/utils/plusCodeToTokenId";

export function setRecordTx({
  domain,
  key,
  value,
}: {
  domain: string;
  key: string;
  value: string;
}) {
  const tokenId = plusCodeToTokenId(domain);
  const transaction = prepareContractCall({
    contract,
    method: "function set(string key, string value, uint256 tokenId)",
    params: [key, value, tokenId],
  });
  return transaction;
}

export function setManyRecordsTx({
  domain,
  keys,
  values,
}: {
  domain: string;
  keys: string[];
  values: string[];
}) {
  const tokenId = plusCodeToTokenId(domain);
  const transaction = prepareContractCall({
    contract,
    method: "function setMany(string[] keys, string[] values, uint256 tokenId)",
    params: [keys, values, tokenId],
  });
  return transaction;
}

export function reconfigureRecordsTx({
  domain,
  keys,
  values,
}: {
  domain: string;
  keys: string[];
  values: string[];
}) {
  const tokenId = plusCodeToTokenId(domain);
  const transaction = prepareContractCall({
    contract,
    method:
      "function reconfigure(string[] keys, string[] values, uint256 tokenId)",
    params: [keys, values, tokenId],
  });
  return transaction;
}

export function resetRecordsTx({ domain }: { domain: string }) {
  const tokenId = plusCodeToTokenId(domain);
  const transaction = prepareContractCall({
    contract,
    method: "function reset(uint256 tokenId)",
    params: [tokenId],
  });
  return transaction;
}
