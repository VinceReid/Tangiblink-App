import { prepareContractCall } from "thirdweb";
import { contract } from "@/constants/thirdweb";
import { toWei } from "thirdweb/utils";
import { plusCodeToTokenId } from "@/utils/plusCodeToTokenId";


export default function payDomainTx({domain, data, value}: {domain: string, data?: string | null, value: string}) {
  const tokenId = plusCodeToTokenId(domain);
  const transaction = prepareContractCall({
    contract,
    method:
      "function payDomain(uint256 tokenId, string data) payable returns (bool)",
    params: [tokenId, data ?? ""],
    value: toWei(value),
  });
  return transaction;
}
