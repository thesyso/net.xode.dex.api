import { verifyMessage, getAddress } from "ethers";
import { signatureVerify } from "@polkadot/util-crypto";

export const verifyWalletSignature = async (
  chain: string,
  message: string,
  signature: string,
  address: string,
) => {
  if (chain === "ethereum") {
    return await ethereumVerifier(message, signature, address);
  } else if (chain === "polkadot") {
    return await substrateVerifier(message, signature, address);
  } else {
    return {
      success: false,
      message: "Unsupported chain for signature verification.",
      address: "",
    };
  }
};

// 검증 ethereum
const ethereumVerifier = async (
  message: string,
  signature: string,
  address: string,
) => {
  let result = {
    success: false,
    message:
      "an unknown error has occurred. If this continues, please contact your administrator.",
    address: "",
  };

  let recoveredAddress: string, requestedAddress: string;
  try {
    let resp = verifyMessage(message, signature);

    recoveredAddress = getAddress(resp);
    requestedAddress = getAddress(address);
   
    if (recoveredAddress !== requestedAddress) {
      result = {
        success: false,
        message: "Signature verification failed.",
        address: recoveredAddress,
      };
    } else {
      result = {
        success: true,
        message: "Signature verification successful.",
        address: recoveredAddress,
      };
    }
  } catch (e: any) {
    result = {
      success: false,
      message: e.message || "Signature verification failed.",
      address: "",
    };
  }
  return result;
};
// 검증 substrate
const substrateVerifier = async (
  message: string,
  signature: string,
  address: string,
) => {
  let result = {
    success: false,
    message:
      "an unknown error has occurred. If this continues, please contact your administrator.",
    address: "",
  };

  try {
    console.log("message", message , signature, address);

    let resp = signatureVerify(message, signature, address);
    console.log("resp", resp);
    if (resp.isValid) {
      result = {
        success: true,
        message: "Signature verification successful.",
        address: address,
      };
    } else {
      result = {
        success: false,
        message: "Signature verification failed.",
        address: "",
      };
    }
  } catch (e: any) {
    result = {
      success: false,
      message: e.message || "Signature verification failed.",
      address: "",
    };
  }

  return result;
};
