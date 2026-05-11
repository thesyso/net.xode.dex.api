import express from "express";
import jwt from "jsonwebtoken";

import masterController from "../../../controllers/auths/master";

import { IResult } from "../../../libs/interface/result.interface";
import { acVerify, acChallenge } from "../../../controllers/auths/wallet";

const router = express.Router();

router.get('/', async (req, res) => {
    let resJson = {
        errCode: 0,
        errMessage: ""
    };

    res.status(200).send(resJson);
})

/**
{
    "address": "5HBWsDWtyMNhin7E5YDykwvu1JJ6Gvyuph5Uex4hbaHi9AhD",
    "chain": "polkadot",
    "connectIp": "192.168.0.1"
}
*/
router.post('/challenge', async (req, res) => {
  let result: IResult = {
    success: false,
    message:
      "an unknown error has occurred. If this continues, please contact your administrator.",
  };

  // 필수값 체크
  const { address, chain, connectIp } = req.body;
  if (!address || !chain) {
    result = {
      success: false,
      message: "Address and chain are required."
    };
    return res.status(400).json(result);
  }

  // 챌린지 생성
  result = await acChallenge({ address, chain, ip: connectIp });
  return res.status(200).json(result);
});

/**
{
  "address": "5HBWsDWtyMNhin7E5YDykwvu1JJ6Gvyuph5Uex4hbaHi9AhD",
  "provider": "METAMASK",
  "chain": "polkadot",
  "message": "Sign this message to connect to DEX.\nNonce: 46da78d0ea52fb0d36c7967021b9d8c0\nIssued At: 2026-04-20T06:04:28.844Z",
  "signature": "0x30bc974b2724420c2050f61c11666958bc875d4a1737519d679b8442f9dad560f4168b04444d2be4f3937dd12a3256b6449583393c6dc217ba8a62b928112a8b",
  "walletName": "BITCOIN",
  "coinCode": "USDT"
}
 */
router.post('/verify', async (req, res) => {
  let resJson = {
      errCode: 999,
      errMessage: "an unknown error has occurred. If this continues, please contact your administrator."
  };

  const sParmas = {
    address: req.body?.address ? req.body.address.toString() : "",
    provider: req.body?.provider ? req.body.provider.toString() : "",
    chain: req.body?.chain ? req.body.chain.toString() : "",
    message: req.body?.message ? req.body.message.toString() : "",
    signature: req.body?.signature ? req.body.signature.toString() : "",
    walletName: req.body?.walletName ? req.body.walletName.toString() : "",
    coinCode : req.body?.coinCode ? req.body.coinCode.toString() : "",
    ip: req.body?.ip ? req.body.ip.toString() : "",
  }
  

});
/**
behavior: wallet token
payload:
{
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ3YWxsZXRBZGRyZXNzIjoiMHhEZDFDRDE2Rjk1ZTQ0RWY3RTU1Q0MzM0VlNkMxYUY5QUI3Q0VDN2ZDIiwiaWF0IjoxNzcwNjkwNTc3LCJleHAiOjE3NzEyOTUzNzd9.xAeQvJLNBOAVhhqEJNK6voZzbFRJYj_GWr8vXc2w1Bk"
}
 */
router.post('/refresh', async (req, res) => {
  let resJson = {
      errCode: 999,
      errMessage: "an unknown error has occurred. If this continues, please contact your administrator."
  };
});

router.post('/logout', async (req, res) => {
  let resJson = {
      errCode: 999,
      errMessage: "an unknown error has occurred. If this continues, please contact your administrator."
  };
});



export default router;