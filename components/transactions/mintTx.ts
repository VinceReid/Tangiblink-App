import { prepareContractCall } from "thirdweb";
import { contract } from "@/constants/thirdweb";
import { toWei } from "thirdweb/utils";

export default function mintTx({ domain, payable }: { domain: string, payable: string }) {
  const transaction = prepareContractCall({
    contract,
    method: "function mint(string domain) payable",
    params: [domain],
    value: toWei(payable),
  });
  return transaction;
}
