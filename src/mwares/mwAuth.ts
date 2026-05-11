import { NextFunction, Request, Response } from "express";
import moment from "moment";

import { verify } from "../libs/modules/auth.token";

export const mwMemberAuthJWT = async (req: Request, res: Response, next: NextFunction) => {
    if (req.headers.authorization) {
        const accessToken = req.headers.authorization.split('Bearer ')[1]; // header에서 access token을 가져옵니다.
        const result = verify(accessToken); // token을 검증합니다.

        if (result.ok) {
            // token이 검증되었으면 req에 값을 세팅하고, 다음 콜백함수로 갑니다.
            req.memberAuth = {
                uid: result.uid,
                id: result.id,
                role: result.role,
                name: result.name,
                nname: result.nname,
                phone: result.phone,
                nation: "ko"
            };

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
        } else {
            // 검증에 실패하거나 토큰이 만료되었다면 클라이언트에게 메세지를 담아서 응답합니다.
            res.status(401).send({
                errCode: 401,
                errMessage: 'Authentication has expired.', // jwt가 만료되었다면 메세지는 'jwt expired'입니다.
            });
        }
    } else {
        res.status(403).send({
            errCode: 403,
            errMessage: 'no authentication information.',
        });
    }
};

export const mwMasterAuthJWT = async (req: Request, res: Response, next: NextFunction) => {
    if (req.headers.authorization) {
        const accessToken = req.headers.authorization.split('Bearer ')[1]; // header에서 access token을 가져옵니다.
        const resVerify = verify(accessToken); // token을 검증합니다.

        if (resVerify.ok) { // token이 검증되었으면 req에 값을 세팅하고, 다음 콜백함수로 갑니다.

            req.masterAuth = {
                uid : resVerify.uid,
                id : resVerify.id,
                role : resVerify.role,
                name : resVerify.name,
                nname : resVerify.nname,
                phone : resVerify.phone,
                nation: "ko"
            }

            // var masuid = resVerify.uid ? resVerify.uid.toString() : "";
            // var resRedis = await redisMasterV4.get(masuid);

            // if(resRedis){

            //     var parseRedis = JSON.parse(resRedis);
            //     if (
            //         parseRedis.data.accessToken == accessToken
            //     ) {
            //         req.masterAuth = masterAuth;
            //         next();
            //     } else {
            //         return res.status(403).send({
            //             errCode: 403,
            //             errMessage: "no authentication information."
            //         });
            //     }
            // } else {
            //     return res.status(403).send({
            //         errCode: 403,
            //         errMessage: "no authentication information."
            //     });
            // }
        } else { // 검증에 실패하거나 토큰이 만료되었다면 클라이언트에게 메세지를 담아서 응답합니다.
            return res.status(401).send({
                errCode: 401,
                errMessage: "Authentication has expired.", // jwt가 만료되었다면 메세지는 'jwt expired'입니다.
            });
        }
    } else {
        return res.status(403).send({
            errCode: 403,
            errMessage: "no authentication information."
        });
    }
};

export const mwAgentAuthJWT = (req: Request, res: Response, next: NextFunction) => {
    const vTime = moment(new Date()).format('YYYY-MM-DD HH:mm:sss');

    if (req.headers.authorization) {
        const token = req.headers.authorization.split('Bearer ')[1]; // header에서 access token을 가져옵니다.
        const result = verify(token); // token을 검증합니다.
        
        if (result.ok) { // token이 검증되었으면 req에 값을 세팅하고, 다음 콜백함수로 갑니다.
            req.agentAuth = {
                uid : result.uid,
                id : result.id,
                role : result.role,
                name : result.name,
                nname : result.nname,
                phone : result.phone,
                nation: "ko"
            }

            next();
        } else { // 검증에 실패하거나 토큰이 만료되었다면 클라이언트에게 메세지를 담아서 응답합니다.
            res.status(401).send({
                errCode: 401,
                errMessage: "Authentication has expired.", // jwt가 만료되었다면 메세지는 'jwt expired'입니다.
            });
        }
    } else {
        res.status(403).send({
            errCode: 403,
            errMessage: "no authentication information."
        });
    }
};

export function mwAuth(req: any, res: any, next: any) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ success: false, message: '인증 정보가 없습니다.' });
  }
  const token = authHeader.split(' ')[1]; // "Bearer <token>" 형식에서 토큰 추출
  if (!token) {
    return res.status(401).json({ success: false, message: '유효한 인증 정보가 없습니다.' });
  } 
  // 토큰 검증 로직 (예: JWT 검증)
  // jwt.verify(token, 'your_secret
  //   (err, decoded) => {
  //     if (err) {
  //       return res.status(401).json({ success: false, message: '인증 실패: 유효하지 않은 토큰입니다.' });
  //     }
  //     req.user = decoded; // 검증된 사용자 정보 저장
  //     next(); // 다음 미들웨어로 이동
  //   });
  next(); // 임시로 토큰 검증 없이 다음으로 이동
}