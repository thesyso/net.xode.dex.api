import express from "express";
import jwt from "jsonwebtoken";

import masterController from "../../../controllers/auths/master";

const router = express.Router();



router.get('/', async (req, res) => {
    // 결과값 공용설정
    // let resJson = {
    //     errCode: 999,
    //     errMessage: "an unknown error has occurred. If this continues, please contact your administrator."
    // };
    let resJson = {
        errCode: 0,
        errMessage: ""
    };

    res.status(200).send(resJson);
})

router.post("/login", async (req, res) => {

  const connect_ip = req.ip || req.headers['x-forwarded-for'] || "";
  const connect_at = new Date();
  const emailid = req.body?.emailid || "";
  const password = req.body?.password || "";

  const sParams = {
    emailid: emailid,
    password: password,
    ip: connect_ip,
    loginTime: connect_at,
  };
  
  const result = await masterController.acLogin(sParams);
  if (result.success) {
    const token = jwt.sign(
      { userId: result.data.user_id },
      process.env.JWT_SECRET_KEY || "your_secret_key",
      { expiresIn: "1h" },
    );
    res.json({ ...result, token });
  } else {
    res.json(result);
  }
});

router.post("/register", async (req, res) => {
  const connect_ip = req.ip || req.headers['x-forwarded-for'] || "";

  const sParams = {
    status : 0,       // 0 : 가입 , 1 : 일반 , 7 : 정지, 9 : 탈퇴
    authority : 0,    // 0 : 권한없음, 1 : 일반, 5 : 매니저, 7 : 운영자, 9 : 시스템
    emailid : req.body?.emailid || "", 
    password : req.body?.password || "",
    salt : "",
    email : req.body?.emailid || "",
    mastername : req.body?.mastername || "",
    nickname : req.body?.nickname || "",
    nation_no : req.body?.nation_no || "",
    phone : req.body?.phone || "",
    nation : req.body?.nation || "",
    location : req.body?.location || "",
    language : req.body?.language || "us",
    address : req.body?.address || "",
    address_detail : req.body?.address_detail || "",
    zipcode : req.body?.zipcode || "",
    connected_ip : connect_ip,
    connected_at : new Date(),
  }

  const reRes = await masterController.acRegister(sParams);
  res.status(200).send(reRes);
});

router.post("/check-email", async (req, res) => {
  const emailid = req.body?.emailid || "";
  const result = await masterController.acIscheckEmail(emailid);
  res.json(result);
});

router.post("/refresh-token", async (req, res) => {
  const token = req.body?.token || "";

  const result = await masterController.acRefresh({ refreshToken: token });
  res.json(result);
});

export default router;
