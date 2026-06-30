import { NextFunction, Request, Response } from "express";
import moment from "moment";

import { verify, verifyAgent, verifyWallet } from "../libs/modules/auth.token";
import { IResVerify, IResVerifyWallet } from "../libs/interface/auth.interface";

const MASTER_PRIVATE_MIN_AUTHORITY = Number(process.env.MASTER_PRIVATE_MIN_AUTHORITY || 5);

export const mwMemberAuthJWT = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authorization = req.headers.authorization;
  if (authorization) {
    const accessToken = authorization.startsWith("Bearer ")
      ? authorization.slice("Bearer ".length).trim()
      : "";

    if (!accessToken) {
      return res.status(403).send({
        errCode: 403,
        errMessage: "no authentication information.",
      });
    }

    const resVerify: IResVerify = verify(accessToken, "access"); // token을 검증합니다.

    if (resVerify.ok) {
      // token이 검증되었으면 req에 값을 세팅하고, 다음 콜백함수로 갑니다.
      req.memberAuth = {
        ...resVerify,
        nation: "ko"
      };
      req.masterAuth = req.memberAuth;

      // var resRedis = await redisV4.get(userInfo.uid.toString());

      // if (resRedis) {
      //     var parseRedis = JSON.parse(resRedis);
      //     if (parseRedis.data.accessToken == accessToken) {
      //         req.userInfo = userInfo;
      //         next();
      //     } else {
      //         res.status(403).send({
      //             errCode: 403,
      //             errMessage: 'no authentication information.',
      //         });
      //     }
      // } else {
      //     res.status(403).send({
      //         errCode: 403,
      //         errMessage: 'no authentication information.',
      //     });
      // }
      return next();
    } else {
      // 검증에 실패하거나 토큰이 만료되었다면 클라이언트에게 메세지를 담아서 응답합니다.
      return res.status(401).send({
        errCode: 401,
        errMessage: "Authentication has expired.", // jwt가 만료되었다면 메세지는 'jwt expired'입니다.
      });
    }
  } else {
    return res.status(403).send({
      errCode: 403,
      errMessage: "You do not have access to this page.",
    });
  }
};

export const mwMasterPrivateAuthJWT = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const masterAuth = req.memberAuth || req.masterAuth;

  if (!masterAuth) {
    return res.status(403).send({
      errCode: 403,
      errMessage: "You do not have access to this page.",
    });
  }

  const authority = Number(masterAuth.role || 0);
  if (Number.isNaN(authority) || authority < MASTER_PRIVATE_MIN_AUTHORITY) {
    return res.status(403).send({
      errCode: 403,
      errMessage: "Your administrator account does not have permission to access this resource.",
    });
  }

  return next();
};

export const mwWalletAuthJWT = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.headers.authorization) {
    const accessToken = req.headers.authorization.split("Bearer ")[1]; // header에서 access token을 가져옵니다.
    const resVerify: IResVerifyWallet = verifyWallet(accessToken); // token을 검증합니다.

    if (resVerify.ok) {
      // token이 검증되었으면 req에 값을 세팅하고, 다음 콜백함수로 갑니다.

      if (resVerify.address && resVerify.chain) {
        req.walletAuth = {
          ...resVerify,
          nation: "ko",
        };

        next();
      } else {
        return res.status(403).send({
          errCode: 403,
          errMessage: "no authentication information.",
        });
      }


    } else {
      // 검증에 실패하거나 토큰이 만료되었다면 클라이언트에게 메세지를 담아서 응답합니다.
      res.status(401).send({
        errCode: 401,
        errMessage: "Authentication has expired.", // jwt가 만료되었다면 메세지는 'jwt expired'입니다.
      });
    }
  } else {
    res.status(403).send({
      errCode: 403,
      errMessage: "no authentication information.",
    });
  }
};

export const mwIsWalletAuthJWT = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.headers.authorization) {
    const accessToken = req.headers.authorization.split("Bearer ")[1]; // header에서 access token을 가져옵니다.
    const resVerify: IResVerifyWallet = verifyWallet(accessToken); // token을 검증합니다.

    if (resVerify.ok) {
      // token이 검증되었으면 req에 값을 세팅하고, 다음 콜백함수로 갑니다.

      if (resVerify.address && resVerify.chain) {
        req.walletAuth = {
          ...resVerify,
          nation: "ko",
        };
      }
    }
  } else {
    const resVerify: IResVerifyWallet = verifyWallet(""); // 토큰 정보가 없을때
    req.walletAuth = {
      ...resVerify,
      nation: "ko",
    };
  }

  // 검증만 하고 전달한다.
  next();
};

export const mwAgentAuthJWT = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const vTime = moment(new Date()).format("YYYY-MM-DD HH:mm:sss");

  if (req.headers.authorization) {
    const token = req.headers.authorization.split("Bearer ")[1]; // header에서 access token을 가져옵니다.
    const resVerify: IResVerify= verifyAgent(token); // token을 검증합니다.

    if (resVerify.ok) {
      // token이 검증되었으면 req에 값을 세팅하고, 다음 콜백함수로 갑니다.
      req.agentAuth = {
        ...resVerify,
        nation: "ko"
      };

      next();
    } else {
      // 검증에 실패하거나 토큰이 만료되었다면 클라이언트에게 메세지를 담아서 응답합니다.
      res.status(401).send({
        errCode: 401,
        errMessage: "Authentication has expired.", // jwt가 만료되었다면 메세지는 'jwt expired'입니다.
      });
    }
  } else {
    res.status(403).send({
      errCode: 403,
      errMessage: "no authentication information.",
    });
  }
};

