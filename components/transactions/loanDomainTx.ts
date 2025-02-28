import { prepareContractCall } from "thirdweb";
import { contract } from "@/constants/thirdweb";
import { plusCodeToTokenId } from "@/utils/plusCodeToTokenId";
import { getUnixTime } from "date-fns";

export default function loanDomainTx({
  domain,
  user,
  expiry,
}: {
  domain: string;
  user: string;
  expiry: Date;
}) {
  const tokenId = plusCodeToTokenId(domain);
  const expires = BigInt(getUnixTime(expiry));
  const transaction = prepareContractCall({
    contract,
    method: "function setUser(uint256 tokenId, address user, uint64 expires)",
    params: [tokenId, user, expires],
  });
  return transaction;
}
