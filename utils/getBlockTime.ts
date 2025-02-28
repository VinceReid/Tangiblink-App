import { eth_getBlockByNumber } from "thirdweb/rpc";
import { rpcRequest } from "@/constants/thirdweb";
import { fromUnixTime } from "date-fns";

// This function gets the block time of a block number from the blockchain.
// It uses the eth_getBlockByNumber RPC method to get the block details.
// The block time is then converted from Unix time to a human-readable format.
export async function getBlockTime({
  blockNumber,
}: {
  blockNumber: bigint;
}): Promise<string | null> {
  let block = null;
  try {
    block = await eth_getBlockByNumber(rpcRequest, {
      blockNumber: blockNumber,
      includeTransactions: false,
    });
  } catch (error) {
    console.error(error);
    return null;
  }
  if (!block) return null;
  const blockTime = block.timestamp
    ? fromUnixTime(Number(block.timestamp)).toString()
    : null;
  return blockTime ?? null;
}
