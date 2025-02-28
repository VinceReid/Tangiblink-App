import { eth_getTransactionByHash } from "thirdweb/rpc";
import { rpcRequest } from "@/constants/thirdweb";
import { fromUnixTime } from "date-fns";
import { Transaction } from "viem";

// This function retrieves a transaction by its hash.
// It returns a promise that resolves to the transaction.
// It throws an error if the transaction is not found.
export async function getTxByHash({
  txHash,
}: {
    txHash: `0x${string}`;
}): Promise<Transaction | null> {
  let tx = null;
  try {
    tx = await eth_getTransactionByHash(rpcRequest, {
      hash: txHash,
    });
  } catch (error) {
    console.error(error);
    return null;
  }
  return tx ?? null;
}
