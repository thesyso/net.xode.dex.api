import 'dotenv/config';

import getPools from "../../libs/db.ins.js";
import { redisService } from "../../libs/redis.ins.js";

import { IResult } from "../../libs/interface/result.interface.js";
import { moMessage } from "../../libs/modules/message.js";

import { randomString } from "../../libs/modules/common.random.js"
//
import daoMaster from "../../models/masters/dao.master.js";

import { sign, verify } from "../../libs/modules/auth.token.js";

import { csEnCryptSHA512 } from "../../libs/modules/common.crypto.js";
import { IsStatus } from "../../libs/modules/auth.status.js";
import { IResVerify, ISignPayLoad } from '../../libs/interface/auth.interface.js';
import { IMaster } from '../../models/masters/dto.master.js';

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || 3600; // 1h
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || 604800; // 7d

interface IMasterAuthSession extends ISignPayLoad {
  refreshToken: string;
}

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

    const master: IMaster = rows[0];
    const userSalt = master.salt;
    const statusResult = IsStatus(master.status);

    if (!statusResult.success) {
      result = statusResult;
      return result;
    }

    // 입력된 비밀번호를 해시하여 데이터베이스에 저장된 해시와 비교
    const userPasswordHash = master.password;
    const inputPasswordHash = csEnCryptSHA512(params.password, userSalt);

    if (inputPasswordHash.errCode !== 0 || !userPasswordHash) {
      result = {
        success: false,
        message: "Password verification failed.",
      };
      return result;
    }

    if (inputPasswordHash.cryptoCode !== userPasswordHash) {
      result = {
        success: false,
        message: "Incorrect password.",
      };
      return result;
    }

    // 로그인 성공 create token
    const payLoad : ISignPayLoad = {
      uid: String(master.master_id),
      id: master.emailid,
      role: String(master.authority),
      deviceId: params.deviceId || "",
      deviceIp: params.deviceIp || "",
      connected_ip: params.connected_ip || "",
      connected_at: new Date()
    };

    const resPayLoad = sign(payLoad);
    if(!resPayLoad.ok) {
      result = {
        success: false,
        message: resPayLoad.message,
      };
      return result;
    }

    if (!resPayLoad.refreshToken || !resPayLoad.accessToken) {
      result = {
        success: false,
        message: "Failed to generate tokens.",
      };
      return result;
    }

    const authSession: IMasterAuthSession = {
      ...payLoad,
      refreshToken: resPayLoad.refreshToken,
    };

    result = {
      success: true,
      message: "Login successful.",
      data: {
        accessToken: resPayLoad.accessToken,
        refreshToken: resPayLoad.refreshToken,
      },
    };

    // 로그인 성공 시, Redis에 세션 정보 저장 (예: user_id와 로그인 시간)
    const redis_00 = await redisService.getClient(0);
    await redis_00.set(
      `auth:master:${master.master_id}`, 
      JSON.stringify(authSession),
      { EX: Number(JWT_REFRESH_EXPIRES_IN)}
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

const acLogout = async (masterId: number) => {
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
    await redis_00.del(`auth:master:${masterId}`);
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
    const resVerify : IResVerify = verify(reToken, "refresh");

    if (!resVerify.ok) {
      result = {
        success: false,
        message: resVerify.message,
      };
      return result;
    }

    const masterId = resVerify.uid;

    // Redis에서 세션 정보 확인
    const redis_00 = await redisService.getClient(0);
    const redisData = await redis_00.get(`auth:master:${masterId}`);
    if (!redisData) {
      result = {
        success: false,
        message: "Session not found. Please log in again.",
      };
      return result;
    }
    
    const authRedis: IMasterAuthSession = JSON.parse(redisData);

    if (authRedis.refreshToken !== reToken) {
      result = {
        success: false,
        message: "No matching session found. Please log in again.",
      };
      return result;
    }

    const payLoad: ISignPayLoad = {
      uid: authRedis.uid,
      id: authRedis.id,
      // name: authRedis.name,
      role: authRedis.role,
      // nname: authRedis.nickname,
      deviceId: authRedis.deviceId || "",
      deviceIp: authRedis.deviceIp || "",
      connected_at: authRedis.connected_at ? new Date(authRedis.connected_at) : new Date(),
      connected_ip: authRedis.connected_ip || "",
    };

    // 보안상 이름은 가지고 있지 않음.
    // 필요시 닉네임, 위치, 언어 등은 회원정보로 전달

    const resPayLoad = sign(payLoad);

    if(!resPayLoad.ok) {
      result = {
        success: false,
        message: resPayLoad.message,
      };
      return result;
    }

    if (!resPayLoad.refreshToken || !resPayLoad.accessToken) {
      result = {
        success: false,
        message: "Failed to generate tokens.",
      };
      return result;
    }

    const nextSession: IMasterAuthSession = {
      ...payLoad,
      refreshToken: resPayLoad.refreshToken,
    };

    result = {
      success: true,
      message: "refreshed successfully.",
      data: {
        accessToken: resPayLoad.accessToken,
        refreshToken: resPayLoad.refreshToken,
      },
    };

    // 로그인 성공 시, Redis에 세션 정보 저장 (예: user_id와 로그인 시간)
    await redis_00.set(
      `auth:master:${payLoad.uid}`,
      JSON.stringify(nextSession),
      { EX: Number(JWT_REFRESH_EXPIRES_IN)}
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
