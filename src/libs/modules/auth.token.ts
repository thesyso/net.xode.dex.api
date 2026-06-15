import { promisify } from "node:util";
import jwt, { JwtPayload } from "jsonwebtoken";

import { IResult, IResultRefresh } from "../interface/result.interface";

import { redisService } from "../redis.ins";
import { EnumWalletChain } from "../interface/wallet.interface";
import { ISignPayLoad, IResVerify, IAuth, IWalletSignPayLoad, IResVerifyWallet } from "../interface/auth.interface";
import { connect } from "node:http2";
import { decode } from "node:punycode";

// secret key는 환경변수에서 가져오거나 기본값으로 설정
const secretAccessKey = process.env.JWT_SECRET_KEY || "6BEDlGinwwJZKOpDtxH4yz0Pk6foUyHa";
const secretRefreshKey = process.env.JWT_REFRESH_SECRET_KEY || "lh1x0rg3BtCK9GVvr9tvqt4elZtB6lsT";

// token 유효기간 설정 (초 단위)
const accessLimit = process.env.JWT_ACCESS_LIMIT || "3600";
const refreshLimit = process.env.JWT_REFRESH_LIMIT || "86400";

const accessAgentLimit = process.env.JWT_ACCESS_AGENT_LIMIT || "3600";
const refreshAgentLimit = process.env.JWT_REFRESH_AGENT_LIMIT || "86400";

// wallet 관련 정보
const secretWalletKey = process.env.JWT_WALLET_SECRET || "EqM5sKdkLiwx2xkRoAq8lhrELHbmOR2zEXBOBGLycCI=";
const refreshWalletKey = process.env.JWT_WALLET_REFRESH || "/3PorrEAPM8OACdlBoUgr3EBcWAFyZUSk7xWXDFGCks=";

const walletAccessLimit = process.env.JWT_WALLET_EXPIRES_IN || "3600";
const walletRefreshLimit = process.env.JWT_WALLET_REFRESH_EXPIRES_IN || "86400";

/**
 * user, admin token 발급 및 검증
 * @param payLoad 
 * @returns 
 */
export const sign = (payLoad: ISignPayLoad) => {
  // access token 발급
  try {
    const accessToken = jwt.sign(payLoad, secretAccessKey, {
      // secret으로 sign하여 발급하고 return
      algorithm: "HS256", // 암호화 알고리즘
      expiresIn: parseInt(accessLimit), //'1h' or 60 * 60, 	  // 유효기간
    });

    const refreshToken = jwt.sign(payLoad, secretRefreshKey, {
      // secret으로 sign하여 발급하고 return
      algorithm: "HS256", // 암호화 알고리즘
      expiresIn: parseInt(refreshLimit), //'1h' or 60 * 60, 	  // 유효기간
    });

    return {
      ok: true,
      accessToken,
      refreshToken
    };
  } catch(err: any) {
    return {
      ok: false,
      message: err.message,
      accessToken: null,
      refreshToken: null
    };
  }
};

export const verify = (secureToken: string, mode: "access" | "refresh" = "access") => {
  // access token 검증
  let decoded: any;
  let resVeify: IResVerify = {
    ok: false,
    message: "Invalid token.",
    uid: "",
    id: "",
    role: "",
    deviceId: "",
    deviceIp: "",
    connected_ip: "",
    connected_at: new Date(0),
    mode: mode
  }

  try {
    if(mode === "access"){
      decoded = jwt.verify(secureToken, secretAccessKey);
    } else {
      decoded = jwt.verify(secureToken, secretRefreshKey);
    }

    resVeify.ok = true;
    resVeify.message = "Token is valid.";
    resVeify.uid = decoded.uid;
    resVeify.id = decoded.id;
    resVeify.role = decoded.role;
    resVeify.deviceId = decoded.deviceId;
    resVeify.deviceIp = decoded.deviceIp;
    resVeify.connected_ip = decoded.connected_ip;
    resVeify.connected_at = decoded.connected_at;
    
  } catch (err: any) {
    resVeify.ok = false;
    resVeify.message = err.message;
  }

  return resVeify;
};

/**
 * system token 발급 및 검증
 * @param payLoad 
 * @returns 
 */
export const signAgent = (payLoad: ISignPayLoad) => {
  try {
    const accessToken = jwt.sign(payLoad, secretAccessKey, {
      // secret으로 sign하여 발급하고 return
      algorithm: "HS256", // 암호화 알고리즘
      expiresIn: parseInt(accessAgentLimit), //'1h' or 60 * 60, 	  // 유효기간
    });

    const refreshToken = jwt.sign(payLoad, secretRefreshKey, {
      // secret으로 sign하여 발급하고 return
      algorithm: "HS256", // 암호화 알고리즘
      expiresIn: parseInt(refreshAgentLimit), //'1h' or 60 * 60, 	  // 유효기간
    });

    return {
      ok: true,
      accessToken,
      refreshToken
    };
  } catch(err: any) {
    return {
      ok: false,
      message: err.message,
      accessToken: null,
      refreshToken: null
    };
  }
};
export const verifyAgent = (secureToken: string, mode: "access" | "refresh" = "access") => {
  // access token 검증
  let decoded: any;
  let resVeify: IResVerify = {
    ok: false,
    message: "Invalid token.",
    uid: "",
    id: "",
    role: "",
    deviceId: "",
    deviceIp: "",
    connected_ip: "",
    connected_at: new Date(0),
    mode: mode
  }

  try {
    if(mode === "access"){
      decoded = jwt.verify(secureToken, secretAccessKey);
    } else {
      decoded = jwt.verify(secureToken, secretRefreshKey);
    }

    resVeify.ok = true;
    resVeify.message = "Token is valid.";
    resVeify.uid = decoded.uid;
    resVeify.id = decoded.id;
    resVeify.role = decoded.role;
    resVeify.deviceId = decoded.deviceId;
    resVeify.deviceIp = decoded.deviceIp;
    resVeify.connected_ip = decoded.connected_ip;
    resVeify.connected_at = decoded.connected_at;
    
  } catch (err: any) {
    resVeify.ok = false;
    resVeify.message = err.message;
  }

  return resVeify;
};


/**
 * wallet token 발급 및 검증
 * payload:
{ 
    "address": "0xDd1CD16F95e44Ef7E55C4334VlS6C1aUY9AB7CED7fD",
    "provider": "metamask",
    "chain": "ethereum",
    "nonce": "randomNonce",
    "signature": "0xSignature",
    "walletName": "My Wallet",
    "coinCode": "USDT"
}
 */

export const signWallet = async (payLoad: IWalletSignPayLoad) => {
  try{
    const accessToken = jwt.sign(payLoad, secretWalletKey, {
      algorithm: "HS256",
      expiresIn: parseInt(walletAccessLimit),
    });

    const refreshToken = jwt.sign(payLoad, refreshWalletKey, {
      algorithm: "HS256",
      expiresIn: parseInt(walletRefreshLimit),
    });

    const redis_00 = await redisService.getClient(0);
    // 디바이스별로 refresh token 저장 (예: auth:device:deviceId:chain:chain:wallet:address)
    await redis_00.set(
      `auth:device:${payLoad.deviceId}:chain:${payLoad.chain}:wallet:${payLoad.address}`, 
      refreshToken, 
      { EX: parseInt(walletRefreshLimit) }
    ); 

    return {
      ok: true,
      accessToken,
      refreshToken
    };
  } catch (err: any) {
    return {
      ok: false,
      message: err.message,
      accessToken: null,
      refreshToken: null
    };
  }
}

export const verifyWallet = (secureToken: string, mode: "access" | "refresh" = "access") => {
  let decoded: any;
  let resVerify: IResVerifyWallet = {
    ok: false,
    message: "Invalid token.",
    walletId: 0,
    userWalletId: 0,
    walletName: "",
    deviceId: "",
    deviceIp: "",
    address: "",
    chain: EnumWalletChain.ETHEREUM,
    signature: "",
    provider: "",
    mode: mode
  };
  
  try {
    if(mode === "access"){
      decoded = jwt.verify(secureToken, secretWalletKey);
    } else {
      decoded = jwt.verify(secureToken, refreshWalletKey);
    }
    resVerify.ok = true;
    resVerify.message = "Wallet token is valid.";
    resVerify.walletId = decoded.walletId;
    resVerify.userWalletId = decoded.userWalletId;
    resVerify.walletName = decoded.walletName;
    resVerify.deviceId = decoded.deviceId;
    resVerify.deviceIp = decoded.deviceIp;
    resVerify.address = decoded.address || "";
    resVerify.chain = decoded.chain?.toLowerCase() || EnumWalletChain.ETHEREUM;
    resVerify.signature = decoded.signature;
    resVerify.provider = decoded.provider;
  } catch (err: any) {
    resVerify.ok = false;
    resVerify.message = err.message;
  }
  return resVerify;
}

export const refreshVerifyWallet = (refreshToken: string) => {
  let decoded: any;
  let resVerify: IResVerifyWallet = {
    ok: false,
    message: "Invalid token.",
    walletId: 0,
    userWalletId: 0,
    walletName: "",
    deviceId: "",
    deviceIp: "",
    address: "",
    chain: EnumWalletChain.ETHEREUM,
    signature: "",
    provider: "",
    mode: "refresh"
  };

  try {
    decoded = jwt.verify(refreshToken, refreshWalletKey);
    resVerify = {
      ok: true,
      message: "Refresh wallet token is valid.",
      walletId: decoded.walletId,
      userWalletId: decoded.userWalletId,
      walletName: decoded.walletName,
      deviceId: decoded.deviceId,
      deviceIp: decoded.deviceIp,
      address: decoded.address || "",
      chain: decoded.chain?.toLowerCase() || EnumWalletChain.ETHEREUM,
      provider: decoded.provider,
      signature: decoded.signature,
      mode: "refresh"
    };
  } catch (err: any) {
    resVerify.ok = false;
    resVerify.message = err.message;
  }
  return resVerify;
};

