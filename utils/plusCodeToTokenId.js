import { keccak256 } from "thirdweb/utils";

// Convert a plus code to a token ID
export const plusCodeToTokenId = (plusCode) => {
  if (!plusCode) {
    return BigInt(0);
  }
  return BigInt(keccak256(plusCode));
};
// Converts a plus code to a shortened token ID
export const shortenedPlusCodeToTokenId = (plusCode) => {
  const tokenId = BigInt(keccak256(plusCode)).toString();
  return `${tokenId.slice(0, 6)}...${tokenId.slice(-6)}`;
};
