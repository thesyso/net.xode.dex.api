
import getPools from "../../libs/db.ins.js";
import { redisService } from "../../libs/redis.ins.js";
import { IResult } from "../../libs/interface/result.interface.js";
import { moMessage } from "../../libs/modules/message.js";
import { Wallet } from "../../libs/modules/utils.validate.js";
import { randomCryptoString } from "../../libs/modules/common.random.js";
import { csDeCryptoAES256, csEnCryptoAES256 } from "../../libs/modules/common.crypto.js";
import { signWallet, verifyWallet } from "../../libs/modules/auth.token.js";

import daoWallet from "../../models/wallets/dao.wallet.js";
import daoUserWallet from "../../models/users/dao.user.wallet.js";
import { IUserWallet, IUser } from "../../models/users/dto.user.js";
import { IWallet, IWalletTransaction } from "../../models/wallets/dto.wallet.js";
import { EnumWalletChain } from "../../libs/interface/wallet.interface.js";
import { IWalletSignPayLoad } from "../../libs/interface/auth.interface.js";

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
export const acLogin = async (params: any) => {
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

  // const signatureVerification = await verifyWalletSignature(
  //   params.chain,
  //   params.nonce,
  //   params.signature,
  //   params.address,
  // );

  // if (!signatureVerification.success) {
  //   return {
  //     ...result,
  //     success: false,
  //     message: signatureVerification.message,
  //   };
  // }

  // 지갑 정보 등록 및 검증, 사용자 지갑 정보 등록 및 검증
  // walletId: waInfo?.wallet_id,
  // userWalletId: userWaInfo?.wallet_id,
  const resRecordWallet = await recordWallet(params);
  let walletPayLoad: IWalletSignPayLoad = {
    walletId: resRecordWallet.data?.wallet?.wallet_id || 0,
    userWalletId: resRecordWallet.data?.userWallet?.wallet_id || 0,
    walletName: resRecordWallet.data?.wallet?.wallet_name || "Unnamed",
    deviceId,
    deviceIp,
    address: params.address,
    chain: params.chain,
    signature: params.signature,
    provider: params.provider,
  };

  const resRemoveNonce = await removeOnlyNonce(params.nonce);

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

export const acRefresh = async (params: any) => {
  let result: IResult = {
    success: false,
    message:
      "an unknown error has occurred. If this continues, please contact your administrator.",
    data: {},
  };

  if (!params.refreshToken) {
    return {
      ...result,
      success: false,
      message: "Refresh token is required.",
    };
  }

  const resVerify = await verifyWallet(params.refreshToken, "refresh");

  if (!resVerify.ok) {
    return {
      ...result,
      success: false,
      message: resVerify.message,
    };
  }

  // access token, refresh token 의 payload는 동일하므로 검증된 정보를 활용하여 토큰을 재발급합니다.
  const walletPayLoad: IWalletSignPayLoad = {
    walletId: resVerify.walletId,
    userWalletId: resVerify.userWalletId,
    walletName: resVerify.walletName || "Unnamed",
    deviceId: resVerify.deviceId || "",
    deviceIp: resVerify.deviceIp || "",
    address: resVerify.address || "",
    chain: resVerify.chain || "",
    signature: resVerify.signature || "",
    provider: resVerify.provider || "Unknown",
  };

  // redis 에서 검증된 정보로 토큰 재발급
  const redis_00 = await redisService.getClient(0);
  const redisKey = `auth:device:${walletPayLoad.deviceId}:chain:${walletPayLoad.chain}:wallet:${walletPayLoad.address}`;
  const storedData = await redis_00.get(redisKey);
  if (!storedData || storedData !== params.refreshToken) {
    return {
      ...result,
      success: false,
      message: "No matching session found. Please log in again.",
    };
  }

  // access token, refresh token 발급
  let reqToken = await signWallet(walletPayLoad);

  if (!reqToken.ok || !reqToken.accessToken || !reqToken.refreshToken) {
    return {
      ...result,
      success: false,
      message: "Failed to generate tokens.",
    };
  }

  await redis_00.set(redisKey, reqToken.refreshToken, { EX: 7 * 24 * 60 * 60 }); // refresh token 유효기간 설정 (예: 7일)
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

export const acLogout = async (
  address: string,
  chain: string,
  deviceId: string,
) => {
  let result: IResult = {
    success: false,
    message:
      "an unknown error has occurred. If this continues, please contact your administrator.",
    data: {},
  };

  if (!address || !chain || !deviceId) {
    return {
      ...result,
      success: false,
      message: "Address, chain, and deviceId are required.",
    };
  }

  const redis_00 = await redisService.getClient(0);
  const redisKey = `auth:device:${deviceId}:chain:${chain}:wallet:${address}`;
  
  const resDel = await redis_00.del(redisKey); // Redis에서 세션 정보 삭제
  if (resDel === 0) {
    return {
      ...result,
      success: false,
      message: "Failed to logout. Session may not exist.",
    };
  } else {
    return {
      ...result,
      success: true,
      message: "Logout successful.",
    };
  }
};
/**
 *
 * @param nonce
 * @returns
 */
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

/**
 *
 * @param params
 * @returns
 */
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
    // vParams.push(params.mainnet, params.coin_code, params.address);
    let resWallet = await daoWallet.etDetailAsOtherKey(conn, {
      mainnet: params.chain === "ethereum" ? "ETHEREUM" : "POLKADOT",
      coin_code: params.coinCode,
      address: params.address,
    });

    // 지갑 정보가 없으면 등록, 있으면 검증
    if (!resWallet || resWallet.length === 0) {
      console.log("No existing wallet found. Registering new wallet.");

      // 등록
      const resWalletSave = await daoWallet.etSave(conn, {
        chain: params.chain,
        wallet_class: params.provider?.toUpperCase() ?? "UNKNOWN",
        wallet_chain: params.chain === "ethereum" ? "EVM" : "SUBSTRATE",
        wallet_name: params.walletName ?? "Unnamed",
        mainnet: params.chain === "ethereum" ? "ETHEREUM" : "POLKADOT",
        coin_code: params.coinCode ?? "UNKNOWN",
        address: params.address,
        address_memo: params.addressMemo ?? "",
      });

      // 등록 후 정보 조회
      resWallet = await daoWallet.etDetail(conn, resWalletSave.insertId);

    }

    waInfo = resWallet[0];
    console.log("Wallet info:", waInfo);

    if (waInfo) {
      let resUserWallet = await daoUserWallet.etDetailByWalletId(
        conn,
        waInfo.wallet_id,
      );

      if (!resUserWallet || resUserWallet.length === 0) {
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

      resUserWallet = await daoUserWallet.etDetailByWalletId(
        conn,
        waInfo.wallet_id,
      );

      userWaInfo = resUserWallet[0];
      console.log("User wallet info:", userWaInfo);
    }

    // 트랜잭션 커밋
    await conn.commit();

    result = {
      data: {
        wallet: waInfo,
        userWallet: userWaInfo,
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

/**
 *
 * @param nonce
 * @returns
 */
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
