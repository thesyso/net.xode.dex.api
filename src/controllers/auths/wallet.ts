import { getAddress, isAddress } from "ethers";
import { decodeAddress } from "@polkadot/util-crypto";

import { IResult } from "../../libs/interface/result.interface.js";
import { moMessage } from "../../libs/modules/message.js";

import { randomCryptoString } from "../../libs/modules/common.random.js";
import { Wallet } from "../../libs/modules/utils.validate.js";

import getPools from "../../libs/db.ins.js";
import { decode } from "node:punycode";
import {
  csDeCryptoAES256,
  csEnCryptoAES256,
} from "../../libs/modules/common.crypto.js";
import daoWallet from "../../models/wallets/dao.wallet.js";
import { IUserWallet, IUser } from "../../models/users/dto.user.js";
import { IWallet, IWalletTransaction } from "../../models/wallets/dto.wallet.js";
import daoUserWallet from "../../models/users/dao.user.wallet.js";

// 준비검토
export const acChallenge = async (params: any) => {
  let result: IResult = {
    success: false,
    message:
      "an unknown error has occurred. If this continues, please contact your administrator.",
  };

  const address = params?.address ? params.address.toString() : "";
  const chain = params?.chain ? params.chain.toString() : "";
  const ip = params?.ip ? params.ip.toString() : "";

  if (!address || !chain) {
    result = {
      success: false,
      message: "Address and chain are required.",
    };
    return result;
  }

  const resp = Wallet.addressValidate(chain, address); // This will throw if the address is invalid
  if (resp.success) {
    // const nonce = randomCryptoString(16);
    const nonce = `${address}-${chain}-${ip}-${Date.now()}`;
    result = {
      success: true,
      message: csEnCryptoAES256(nonce),
    };
  } else {
    result = {
      success: false,
      message: resp.message ? resp.message : "Invalid address or chain.",
    };
  }

  return result;
};

// 검증
export const acVerify = async (params: any) => {
  let result: IResult = {
    success: false,
    message:
      "an unknown error has occurred. If this continues, please contact your administrator.",
  };

  if (!params.address || !params.chain) {
    return {
      success: false,
      message: "Address and chain are required.",
    };
  }

  if (!params.nonce) {
    return {
      success: false,
      message: "Nonce is required.",
    };
  }

  if (!params.signature) {
    return {
      success: false,
      message: "Signature is required.",
    };
  }

  if (!params.provider) {
    return {
      success: false,
      message: "Provider is required.",
    };
  }

  if (!params.coinCode) {
    return {
      success: false,
      message: "Coin code is required.",
    };
  }

  if (!params.ip) {
    return {
      success: false,
      message: "IP is required.",
    };
  }

  const resp = Wallet.addressValidate(params.chain, params.address); // This will throw if the address is invalid
  if (!resp.success) {
    return {
      success: false,
      message: resp.message ? resp.message : "Invalid address or chain.",
    };
  }

  // address 가 있는지 검증하고 없으면 등록, 있으면 논스 검증 후 시그니처 검증
  const nounceValidation = nounceValidate(
    params.nonce,
    params.address,
    params.chain,
    params.ip,
  );

  if (!nounceValidation.success) {
    return {
      success: false,
      message: nounceValidation.message,
    };
  }

  let conn = null;
  let waInfo = null;
  try {
    conn = await getPools();
    let waInfo : IWallet | null = await daoWallet.etDetailCoinAddress(
      conn,
      params
    );

    // 지갑 정보가 없으면 등록, 있으면 검증
    if (!waInfo) {
      // 등록
      result = await daoWallet.etSave(conn, {
        chain: params.chain,
        wallet_class: params.provider ?? "UNKNOWN",
        wallet_mode: params.chain === "ethereum" ? "EVM" : "SUBSTRATE",
        wallet_name: params.walletName ?? "Unnamed",
        mainnet: params.walletName ?? "Mainnet",
        coin_code: params.coinCode ?? "UNKNOWN",
        address: params.address,
        address_memo: params.addressMemo ?? "",
      });

      // 등록 후 정보 조회
      waInfo = await daoWallet.etDetail(conn, result.data?.insertId);
    }

    if(waInfo){
      let userWalletInfo = await daoUserWallet.etDetailByWalletId(conn, waInfo.wallet_id);
      if(!userWalletInfo){
        await daoUserWallet.etSave(conn, {
          wallet_id: waInfo.wallet_id,
          status: 1,
          signature: params.signature,
          user_id: null,
        } as IUserWallet);
      } else {
        await daoUserWallet.etChange(conn, {
          wallet_id: waInfo.wallet_id,
          signature: params.signature,
        } as IUserWallet);
      }
      result = {
        success: true,
        message: "Wallet verified and user wallet info updated.",
        data: {
          wallet: waInfo,
        }
      };
    }



  } catch (error: any) {
    moMessage(`walletController.acVerify`, error?.message || error, "error");
    return {
      success: false,
      message: error?.message || "Failed to connect to MongoDB.",
    };
  } finally {
    if (conn) {
      conn.release();
    }
  }

  return result;
};

// 검증 - 논스 검증
const nounceValidate = (
  nonce: string,
  address: string,
  chain: string,
  ip: string,
) => {
  try {
    const decrypted = csDeCryptoAES256(nonce);
    const parts = decrypted.split("-");
    if (parts.length !== 4) {
      return {
        success: false,
        message: "Invalid nonce format.",
      };
    }

    const [nonceAddress, nonceChain, nonceIp, timestamp] = parts;
    if (nonceAddress !== address || nonceChain !== chain || nonceIp !== ip) {
      return {
        success: false,
        message: "Nonce validation failed.",
      };
    }

    return {
      success: true,
      message: "Nonce is valid.",
    };
  } catch (error) {
    return {
      success: false,
      message: "Invalid nonce.",
    };
  }
};
