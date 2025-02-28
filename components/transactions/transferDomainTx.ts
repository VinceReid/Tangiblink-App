import { prepareContractCall } from "thirdweb";
import { contract } from "@/constants/thirdweb";
import { plusCodeToTokenId } from "@/utils/plusCodeToTokenId";


export default function transferDomainTx({
  domain,
  to,
}: {
  domain: string;
  to: string;
}) {
  const tokenId = plusCodeToTokenId(domain);
  const transaction = prepareContractCall({
    contract,
    method: "function setOwner(address to, uint256 tokenId)",
    params: [to, tokenId],
  });
  return transaction;
}
