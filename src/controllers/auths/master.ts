import 'dotenv/config';
import jwt from "jsonwebtoken";

import getPools from "../../libs/db.ins.js";
import { redisService } from "../../libs/redis.ins.js";

import { IResult, IResultRefresh } from "../../libs/interface/result.interface.js";
import { moMessage } from "../../libs/modules/message.js";

import { randomString } from "../../libs/modules/common.random.js"
//
import daoMaster from "../../models/masters/dao.master.js";

import { sign, verify, refresh, refreshVerify, } from "../../libs/modules/auth.token.js";

import { csEnCryptSHA512 } from "../../libs/modules/common.crypto.js";
import { IsStatus } from "../../libs/modules/auth.status.js";

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || 3600; // 1h
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || 604800; // 7d
const JWT_WALLET_EXPIRES_IN = process.env.JWT_WALLET_EXPIRES_IN || 3600; // 1h
const JWT_WALLET_REFRESH_EXPIRES_IN = process.env.JWT_WALLET_REFRESH_EXPIRES_IN || 604800; // 7d

const acIscheckEmail = async (emailid: string) => {
  let result: IResult = {
    success: false,
    message:
      "an unknown error has occurred. If this continues, please contact your administrator.",
  };

  // emaiid 유효성 검사
  if (!emailid) {
    result = {  
      success: false,
      message: "Email is required.",
    };
    return result;
  }

  let conn: any;

  try {
    conn = await getPools();
    const rows = await daoMaster.etDetailInEmailID(conn, { emailid });

    if (rows.length > 0) {  
      result = {
        success: false,
        message: "Email is already registered.",
      };
    } else {
      result = {
        success: true,
        message: "Email is available.",
      };
    }
  } catch (error: any) {
    moMessage(`masterController.checkEmail`, error?.message || error, "error");
  } finally {
    if (conn) {
      conn.release();
    }
  }
  return result;
};

// 로그인
const acLogin = async (params: any) => {
  let result: IResult = {
    success: false,
    message:
      "an unknown error has occurred. If this continues, please contact your administrator.",
  };

 
  if (!params.emailid || !params.password) {
    result = {
      success: false, 
      message: "Email and password are required.",
    };
    return result;
  };

  let conn: any;

  try {
    conn = await getPools();

    const rows = await daoMaster.etDetailInEmailID(conn, params);

    if (rows.length === 0) {
      result = {
        success: false,
        message: "No user found with the provided email.",
      };
      return result;
    }

    const user = rows[0];
    const userSalt = user.salt;
    const statusResult = IsStatus(user.status);

    if (!statusResult.success) {
      result = statusResult;
      return result;
    }

    // 입력된 비밀번호를 해시하여 데이터베이스에 저장된 해시와 비교
    const userPasswordHash = user.password;
    const inputPasswordHash = csEnCryptSHA512(params.password, userSalt);

    if (inputPasswordHash !== userPasswordHash) {
      result = {
        success: false,
        message: "Incorrect password.",
      };
      return result;
    }

    // 로그인 성공 create token
    const payLoad = {
      uid: user.user_id,
      id: user.email_id,
      name: user.name,
      role: user.authority,
      nname: user.nickname,
      connected_at: new Date().toISOString(),
      connected_ip: params.ip || "",
    };

    const accessToken = sign(payLoad);
    const refreshToken = refresh(payLoad.uid);

    result = {
      success: true,
      message: "Login successful.",
      data: {
        accessToken: accessToken,
        refreshToken: refreshToken,
      },
    };

    // 로그인 성공 시, Redis에 세션 정보 저장 (예: user_id와 로그인 시간)
    const redis_00 = await redisService.getClient(0);
    await redis_00.set(
      `session:${user.user_id}`, 
      JSON.stringify(result.data),
      { EX: Number(JWT_EXPIRES_IN)}
    ); // 세션 유효기간 24시간  

    // 로그인 성공으로 인한 접속 정보 기록
  } catch (error: any) {
    moMessage(`masterController.acLogin`, error?.message || error, "error");
  } finally {
    if (conn) {
      conn.release();
    }
  }

  return result;
};

const acLogout = async (userId: number) => {
  let result: IResult = {
    success: false,
    message:
      "an unknown error has occurred. If this continues, please contact your administrator.",
  };

  let conn: any;

  try {
    conn = await getPools();

    // Redis에서 세션 정보 삭제
    const redis_00 = await redisService.getClient(0);
    await redis_00.del(`session:${userId}`);
    result = {
      success: true,
      message: "Logout successful.",
    };
  } catch (error: any) {
    moMessage(`masterController.acLogout`, error?.message || error, "error");
  } finally {
    if (conn) {
      conn.release();
    }
  }
  return result;
};

const acRefresh = async (params: any) => {
  let result: IResult = {
    success: false,
    message:
      "an unknown error has occurred. If this continues, please contact your administrator.",
  };

  
  let reToken = params.refreshToken;

  if(reToken === undefined || reToken === "") {
    result = {
      success: false,
      message: "Refresh token is required.",
    };
    return result;
  }


  let conn: any;

  try {
    conn = await getPools();
    const reRes : IResultRefresh = refreshVerify(reToken);

    if (!reRes.ok) {
      result = {
        success: false,
        message: reRes.message,
      };
      return result;
    }

    const userId = reRes.uid;

    // Redis에서 세션 정보 확인
    const redis_00 = await redisService.getClient(0);
    const sessionData = await redis_00.get(`session:${userId}`);
    if (!sessionData) {
      result = {
        success: false,
        message: "Session not found. Please log in again.",
      };
      return result;
    }
    
    const session = JSON.parse(sessionData);
    const payLoad = {
      uid: session.uid,
      id: session.id,
      name: session.name,
      role: session.role,
      nname: session.nickname,
      connected_at: session.loginTime,
      connected_ip: session.ip || "",
    };

    const accessToken = sign(payLoad);
    const refreshToken = refresh(payLoad.uid);

    result = {
      success: true,
      message: "refreshed successfully.",
      data: {
        accessToken: accessToken,
        refreshToken: refreshToken,
      },
    };

    // 로그인 성공 시, Redis에 세션 정보 저장 (예: user_id와 로그인 시간)
    await redis_00.set(
      `session:${session.uid}`,
      JSON.stringify(result.data),
      { EX: Number(JWT_EXPIRES_IN)}
    ); // 세션 유효기간 24시간  

  } catch (error: any) {
    moMessage(`masterController.acRefresh`, error?.message || error, "error");
  } finally {
    if (conn) {
      conn.release();
    }
  }
  return result;
};

const acRegister = async (params: any) => {
  let result: IResult = {
    success: false,
    message:
      "an unknown error has occurred. If this continues, please contact your administrator.",
  };

  if (!params.emailid || !params.password) {
    result = {
      success: false, 
      message: "Email and password are required.",
    };
    return result;
  };

  let conn: any;

  try {
    conn = await getPools();
    // 회원가입 로직 구현 (예: 사용자 정보 저장)
    // 회원아이디 확인
    const resp = await daoMaster.etDetailInEmailID(conn, params);
    if (resp.length > 0) {
      result = {
        success: false,
        message: "Email is already registered.",
      };
      return result;
    }

    // salt 생성
    const salt = randomString(16);
    const resPassword = csEnCryptSHA512(params.password, salt);

    params.password = resPassword.errCode === 0 ? resPassword.cryptoCode : "";
    params.salt = salt;

    const reRes = await daoMaster.etSave(conn, params);
    result = {
      success: true,
      message: "Signup successful.",
    };
  } catch (error: any) {
    moMessage(`masterController.acRegister`, error?.message || error, "error");
  } finally {
    if (conn) {
      conn.release();
    }
  }
  return result;
};

export default {
  acIscheckEmail,
  acLogin,
  acLogout,
  acRefresh,
  acRegister,
}
