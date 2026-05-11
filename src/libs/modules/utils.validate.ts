import { getAddress, isAddress } from "ethers";
import { decodeAddress } from "@polkadot/util-crypto";

export class Wallet {
  static addressValidate(
    chain: string,
    address: string,
    memo?: string,
  ): { success: boolean; message?: string } {
    console.log(`Validating address: ${address} for chain: ${chain}`);

    if (chain === "ethereum") {
      if (!isAddress(address)) {
        return { success: false, message: "Invalid Ethereum address" };
      }
    } else if (chain === "polkadot") {
      try {
        decodeAddress(address);
      } catch (error) {
        return { success: false, message: "Invalid Polkadot address" };
      }
    } else {
      return { success: false, message: "Unsupported chain" };
    }
    return { success: true };
  }
}
