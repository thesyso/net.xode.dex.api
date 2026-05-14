import { getAddress, isAddress } from "ethers";
import { decodeAddress } from "@polkadot/util-crypto";

import getPools from "../../libs/db.ins.js";
import { redisService } from "../../libs/redis.ins.js";
import { IResult } from "../../libs/interface/result.interface.js";
import { moMessage } from "../../libs/modules/message.js";
import { Wallet } from "../../libs/modules/utils.validate.js";
import { verifyWalletSignature } from "../../libs/modules/utils.verifier.js";
import { randomCryptoString } from "../../libs/modules/common.random.js";
import {
  csDeCryptoAES256,
  csEnCryptoAES256,
} from "../../libs/modules/common.crypto.js";
import { refresh, signWallet } from "../../libs/modules/auth.token.js";

import daoWallet from "../../models/wallets/dao.wallet.js";
import daoUserWallet from "../../models/users/dao.user.wallet.js";
import { IUserWallet, IUser } from "../../models/users/dto.user.js";
import {
  IWallet,
  IWalletTransaction,
} from "../../models/wallets/dto.wallet.js";
import {
  IWalletSignPayLoad,
  EnumWalletChain,
} from "../../libs/interface/wallet.interface.js";

// PROCESS: 지갑 챌린지 생성, 검증, 등록, 토큰 발급
// 준비검토
export const acChallenge = async (params: any) => {
  let result: IResult = {
    success: false,
    message:
      "an unknown error has occurred. If this continues, please contact your administrator.",
  };

  // deviceId, deviceIp 체크
  const deviceId = params?.deviceId ? params.deviceId.toString() : "";
  const deviceIp = params?.deviceIp ? params.deviceIp.toString() : "";

  if (!deviceId || !deviceIp) {
    result = {
      success: false,
      message: "Device ID and IP are required.",
    };
    return result;
  }

  const randomKey = randomCryptoString(32);
  const nonce = JSON.stringify({
    deviceId,
    deviceIp,
    randomKey,
    timestamp: Math.floor(Date.now() / 1000),
  });
  const nonceEncrypted = csEnCryptoAES256(nonce);

  console.log("Generated nonce:", nonceEncrypted);

  // REDIS 에 등록 할것.
  // 1번 DB용 클라이언트를 가져와서 바로 사용 (없으면 자동 생성 및 연결)
  const redis_01 = await redisService.getClient(1);
  await redis_01.set(randomKey, nonce, { EX: 300 });

  result = {
    success: true,
    message: "Challenge generated successfully.",
    data: {
      nonce: randomKey + ":" + nonceEncrypted,
    },
  };

  return result;
};

// 검증은 등록 및 중복 확인 후 인증까지 진행
export const acVerify = async (params: any) => {
  let result: IResult = {
    success: false,
    message:
      "an unknown error has occurred. If this continues, please contact your administrator.",
    data: {},
  };

  if (!params.address || !params.chain) {
    return {
      ...result,
      success: false,
      message: "Address and chain are required.",
    };
  }

  if (!params.nonce) {
    return {
      ...result,
      success: false,
      message: "Nonce is required.",
    };
  }

  if (!params.signature) {
    return {
      ...result,
      success: false,
      message: "Signature is required.",
    };
  }

  if (!params.provider) {
    return {
      ...result,
      success: false,
      message: "Provider is required.",
    };
  }

  if (!params.coinCode) {
    return {
      ...result,
      success: false,
      message: "Coin code is required.",
    };
  }

  //
  let nonceValidationRes = await nonceValidate(params.nonce);
  if (!nonceValidationRes.success) {
    return {
      ...result,
      success: false,
      message: nonceValidationRes.message,
    };
  }

  let deviceIp = nonceValidationRes.data?.deviceIp || "";
  let deviceId = nonceValidationRes.data?.deviceId || "";

  const resp = Wallet.addressValidate(params.chain, params.address); // This will throw if the address is invalid
  if (!resp.success) {
    return {
      ...result,
      success: false,
      message: resp.message ? resp.message : "Invalid address or chain.",
    };
  }

  const signatureVerification = await verifyWalletSignature(
    params.chain,
    params.nonce,
    params.signature,
    params.address,
  );

  if (!signatureVerification.success) {
    return {
      ...result,
      success: false,
      message: signatureVerification.message,
    };
  }

  let walletPayLoad: IWalletSignPayLoad = {
    walletId: 0,
    userWalletId: 0,
    walletName: params.walletName ?? "Unnamed",
    deviceId,
    deviceIp,
    address: params.address,
    chain: params.chain,
    signature: params.signature,
    provider: params.provider,
  };

  // 지갑 정보 등록 및 검증, 사용자 지갑 정보 등록 및 검증
  await recordWallet(params);
  await removeOnlyNonce(params.nonce);

  // access token, refresh token 발급
  let reqToken = await signWallet(walletPayLoad);

  if (!reqToken.ok || !reqToken.accessToken || !reqToken.refreshToken) {
    return {
      ...result,
      success: false,
      message: "Failed to generate tokens.",
    };
  }

  result = {
    success: true,
    message: "Wallet authentication successful.",
    data: {
      accessToken: reqToken.accessToken,
      refreshToken: reqToken.refreshToken,
    },
  };

  return result;
};

const nonceValidate = async (nonce: string): Promise<IResult> => {
  let result: IResult = {
    success: false,
    message:
      "an unknown error has occurred. If this continues, please contact your administrator.",
  };

  try {
    // 논스에서 디바이스 정보 추출
    if (!nonce || typeof nonce !== "string") {
      return {
        ...result,
        success: false,
        message: "Nonce must be a non-empty string.",
      };
    }

    let nonceSplit = nonce.split(":");

    if (nonceSplit.length !== 3) {
      return {
        ...result,
        success: false,
        message: "Invalid nonce format.",
      };
    }

    let randomKey = nonceSplit[0];
    let nonceEncrypted = nonceSplit[1] + ":" + nonceSplit[2];
    let nonceParse = JSON.parse(csDeCryptoAES256(nonceEncrypted));

    let deviceId = nonceParse.deviceId;
    let deviceIp = nonceParse.deviceIp;

    deviceIp = deviceIp || "";

    const redis_01 = await redisService.getClient(1);
    const storedNonce = await redis_01.get(randomKey);

    if (!storedNonce) {
      return {
        ...result,
        success: false,
        message: "Invalid challenge. Please request a new challenge.",
      };
    }

    if (storedNonce !== JSON.stringify(nonceParse)) {
      return {
        ...result,
        success: false,
        message: "Nonce mismatch. Please request a new challenge.",
      };
    }

    return {
      ...result,
      success: true,
      message: "Nonce validated successfully.",
      data: {
        deviceId: nonceParse.deviceId,
        deviceIp: nonceParse.deviceIp || "",
      },
    };
  } catch (error: any) {
    return {
      ...result,
      success: false,
      message: error?.message || "Failed to validate nonce.",
    };
  }
};

const recordWallet = async (params?: any) => {
  let result: IResult = {
    success: false,
    message:
      "an unknown error has occurred. If this continues, please contact your administrator.",
  };

  let conn = null;
  let waInfo: IWallet | null = null;
  let userWaInfo: IUserWallet | null = null;
  try {
    conn = await getPools();

    // 트랜잭션 시작
    conn.beginTransaction();

    waInfo = await daoWallet.etDetailAsOtherKey(conn, params);

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

    if (waInfo) {
      let userWalletInfo = await daoUserWallet.etDetailByWalletId(
        conn,
        waInfo.wallet_id,
      );

      if (!userWalletInfo) {
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

      userWaInfo = await daoUserWallet.etDetailByWalletId(
        conn,
        waInfo.wallet_id,
      );
    }

    // 트랜잭션 커밋
    await conn.commit();

    result = {
      data: {
        waInfo,
        userWaInfo,
      },
      success: true,
      message: "Wallet information recorded successfully.",
    };
  } catch (error: any) {
    moMessage(`walletController.acVerify`, error?.message || error, "error");
    if (conn) {
      await conn.rollback();
    }
    result = {
      success: false,
      message: error?.message || "Failed to record wallet information.",
    };
  } finally {
    if (conn) {
      conn.release();
    }
  }

  return result;
};

const removeOnlyNonce = async (nonce: string) => {
  try {
    const redis_01 = await redisService.getClient(1);
    let nonceSplit = nonce.split(":");
    if (nonceSplit.length === 3) {
      let randomKey = nonceSplit[0];
      await redis_01.del(randomKey);
    }

    return {
      success: true,
      message: "Nonce removed successfully.",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to remove nonce.",
    };
  }
};
