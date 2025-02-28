import { prepareContractCall } from "thirdweb";
import { contract } from "@/constants/thirdweb";
import { toWei } from "thirdweb/utils";

export default function mintWithRecordsTx({
  domain,
  keys,
  values,
  payable,
}: {
  domain: string;
  keys: string[];
  values: string[];
  payable: string;
}) {
  const transaction = prepareContractCall({
    contract,
    method:
      "function mintWithRecords(string plusCode, string[] keys, string[] values) payable",
    params: [domain, keys, values],
    value: toWei(payable),
  });
  return transaction;
}
