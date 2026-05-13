import { promisify } from "node:util";
import jwt, { JwtPayload } from "jsonwebtoken";

import { IResult, IResultRefresh } from "../interface/result.interface";

const secretAccessKey = process.env.JWT_SECRET_KEY || "6BEDlGinwwJZKOpDtxH4yz0Pk6foUyHa";
const secretRefreshKey = process.env.JWT_REFRESH_SECRET_KEY || "lh1x0rg3BtCK9GVvr9tvqt4elZtB6lsT";

const accessLimit = process.env.JWT_ACCESS_LIMIT || "3600";
const accessAgentLimit = process.env.JWT_ACCESS_AGENT_LIMIT || "3600";

const refreshLimit = process.env.JWT_REFRESH_LIMIT || "86400";
const refreshAgentLimit = process.env.JWT_REFRESH_AGENT_LIMIT || "86400";

const secretWalletKey = process.env.JWT_WALLET_SECRET || "EqM5sKdkLiwx2xkRoAq8lhrELHbmOR2zEXBOBGLycCI=";
const refreshWalletKey = process.env.JWT_WALLET_REFRESH || "/3PorrEAPM8OACdlBoUgr3EBcWAFyZUSk7xWXDFGCks=";
const walletAccessLimit = process.env.JWT_WALLET_EXPIRES_IN || "3600";
const walletRefreshLimit = process.env.JWT_WALLET_REFRESH_EXPIRES_IN || "86400";


export const sign = (user: any) => {
  // access token 발급
  const payLoad = {
    // access token에 들어갈 payLoad
    uid: user.uid,
    id: user.id,
    role: user.role,
    name: user.name,
    nname: user.nname,
    phone: user.phone,
  };

  return jwt.sign(payLoad, secretAccessKey, {
    // secret으로 sign하여 발급하고 return
    algorithm: "HS256", // 암호화 알고리즘
    expiresIn: parseInt(accessLimit), //'1h' or 60 * 60, 	  // 유효기간
  });
};

export const signsys = (user: any) => {
  // access token 발급
  const payLoad = {
    // access token에 들어갈 payLoad
    uid: user.uid,
    id: user.id,
    role: user.role,
    name: user.name,
    nname: user.nname,
    phone: user.phone,
  };

  return jwt.sign(payLoad, secretAccessKey, {
    // secret으로 sign하여 발급하고 return
    algorithm: "HS256", // 암호화 알고리즘
    expiresIn: parseInt(accessAgentLimit), //'1h' or 60 * 60, 	  // 유효기간
  });
};

export const verify = (accessToken: string) => {
  // access token 검증
  let decoded: any;
  try {
    decoded = jwt.verify(accessToken, secretAccessKey);
    return {
      ok: true,
      uid: decoded.uid,
      id: decoded.id,
      role: decoded.role,
      name: decoded.name,
      nname: decoded.nname,
      phone: decoded.phone,
    };
  } catch (err: any) {
    return {
      ok: false,
      message: err.message,
    };
  }
};

export const refresh = (uid: number) => {
  // refresh token 발급
  const payLoad = {
    uid: uid,
  };

  return jwt.sign(payLoad, secretRefreshKey, {
    // refresh token은 payLoad 없이 발급
    algorithm: "HS256",
    expiresIn: parseInt(refreshLimit),
  });
};

export const refreshsys = (uid: number) => {
  // refresh token 발급
  const payLoad = {
    uid: uid,
  };

  return jwt.sign(payLoad, secretRefreshKey, {
    // refresh token은 payLoad 없이 발급
    algorithm: "HS256",
    expiresIn: parseInt(refreshAgentLimit),
  });
};

export const refreshVerify = (refreshToken: string) => {
  // refresh token 검증
  let decoded: any;
  const result: IResultRefresh = {
    ok: false,
    message:
      "an unknown error has occurred. If this continues, please contact your administrator.",
    uid: 0,
  };

  try {
    decoded = jwt.verify(refreshToken, secretRefreshKey);
    result.ok = true;
    result.uid = decoded.uid;
    result.message = "Refresh token is valid.";
  } catch (err: any) {
    result.ok = false;
    result.message = err.message;
  }
  return result;
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

export const signWallet = (payLoad: any) => {
  try{
    const accessToken = jwt.sign(payLoad, secretWalletKey, {
      algorithm: "HS256",
      expiresIn: parseInt(walletAccessLimit),
    });

    const refreshToken = jwt.sign(payLoad, refreshWalletKey, {
      algorithm: "HS256",
      expiresIn: parseInt(walletRefreshLimit),
    });

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

export const verifyWallet = (accessToken: string) => {
  let decoded: any;
  try {
    decoded = jwt.verify(accessToken, secretWalletKey);
    return {
      ok: true,
      address: decoded.address,
      chain: decoded.chain,
      deviceId: decoded.deviceId,
      deviceIp: decoded.deviceIp
    };
  } catch (err: any) {
    return {
      ok: false,
      message: err.message,
      address: null,
      chain: null,
      deviceId: null,
      deviceIp: null
    };
  }
}

export const refreshVerifyWallet = (refreshToken: string) => {
  let decoded: any;
  const result: IResultRefresh = {
    ok: false,
    message:
      "an unknown error has occurred. If this continues, please contact your administrator.",
    uid: 0,
  };

  try {
    decoded = jwt.verify(refreshToken, refreshWalletKey);
    return {
      ok: true,
      address: decoded.address,
      chain: decoded.chain,
      deviceId: decoded.deviceId,
      deviceIp: decoded.deviceIp
    };
  }
    catch (err: any) {
    result.ok = false;
    result.message = err.message;
  }
  return result;
};

export default {
  sign,
  signsys,
  signWallet,
  verify,
  verifyWallet,
  refresh,
  refreshsys,
  refreshVerify,
};
