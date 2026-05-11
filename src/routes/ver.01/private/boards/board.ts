import express from "express";

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

export default router;