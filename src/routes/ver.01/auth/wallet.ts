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
router.get('/challenge', async (req, res) => {
  let result: IResult = {
    success: false,
    message:
      "an unknown error has occurred. If this continues, please contact your administrator.",
  };

  const deviceId = req.headers['x-device-id'];
  const deviceIp = req.headers['x-device-ip'];

    // 챌린지 생성
  result = await acChallenge({ deviceId, deviceIp });
  return res.status(200).json(result);
});

/**
{
  "address": "5HBWsDWtyMNhin7E5YDykwvu1JJ6Gvyuph5Uex4hbaHi9AhD",
  "provider": "METAMASK",
  "chain": "polkadot",
  "nonce": "8196dae7a345aacda4ee6df2b49f2555:023bb8c1e51b78e10aca2ecde39b9096be520b00c07025b5f74eac3842a7dce58fe895c0a327b85b68c96f7c5491a0d44b8cb7303665e57aede976a90e671b3a08528e4790114fc3df4e6b40cebde866a965338e2e230a1d03422642865dec80c53435b2df63c964eb1f61430014fa0efddf8e31d523bcf56ba5bc8e04e34f532198a9a92e20b8a0da5517ea25c2a8b55e8ddda7350fc24d9310006947573bf9ecee7f3b6912ec750905a5198568fadc05340186698ec7f04d53a70a9dd36866",
  "signature": "0x30bc974b2724420c2050f61c11666958bc875d4a1737519d679b8442f9dad560f4168b04444d2be4f3937dd12a3256b6449583393c6dc217ba8a62b928112a8b",
  "walletName": "BITCOIN",
  "coinCode": "USDT"
}
 */
router.post('/login', async (req, res) => {
  let resJson = {
      errCode: 999,
      errMessage: "an unknown error has occurred. If this continues, please contact your administrator."
  };

  const sParmas = {
    address: req.body?.address ? req.body.address.toString() : "",
    provider: req.body?.provider ? req.body.provider.toString() : "",
    chain: req.body?.chain ? req.body.chain.toString() : "",
    nonce: req.body?.nonce ? req.body.nonce.toString() : "",
    signature: req.body?.signature ? req.body.signature.toString() : "",
    walletName: req.body?.walletName ? req.body.walletName.toString() : "",
    coinCode : req.body?.coinCode ? req.body.coinCode.toString() : ""
  }
  
  const resp = await acVerify(sParmas);

  if (resp.success) {
    resJson = {
      errCode: 0,
      errMessage: "Wallet authentication successful.",
      ...resp.data
    };
    return res.status(200).json(resJson);
  } else {
    resJson = {
      errCode: 1,
      errMessage: resp.message || "Wallet authentication failed."
    };
    return res.status(401).json(resJson);
  }
});
router.post('/verify', async (req, res) => {
  let resJson = {
      errCode: 999,
      errMessage: "an unknown error has occurred. If this continues, please contact your administrator."
  };

  const sParmas = {
    address: req.body?.address ? req.body.address.toString() : "",
    provider: req.body?.provider ? req.body.provider.toString() : "",
    chain: req.body?.chain ? req.body.chain.toString() : "",
    nonce: req.body?.nonce ? req.body.nonce.toString() : "",
    signature: req.body?.signature ? req.body.signature.toString() : "",
    walletName: req.body?.walletName ? req.body.walletName.toString() : "",
    coinCode : req.body?.coinCode ? req.body.coinCode.toString() : ""
  }
  
  const resp = await acVerify(sParmas);

  if (resp.success) {
    resJson = {
      errCode: 0,
      errMessage: "Wallet authentication successful.",
      ...resp.data
    };
    return res.status(200).json(resJson);
  } else {
    resJson = {
      errCode: 1,
      errMessage: resp.message || "Wallet authentication failed."
    };
    return res.status(401).json(resJson);
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