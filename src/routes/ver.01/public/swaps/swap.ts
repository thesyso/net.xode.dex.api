import express from "express";
import { IResult } from "../../../../libs/interface/result.interface.js";
import swapControllers from "../../../../controllers/swaps/swap";
import { mwIsWalletAuthJWT, mwWalletAuthJWT } from "../../../../mwares/mwAuth.js";

const router = express.Router();

router.get("/", async (req, res) => {
  let sParams = {
    page: req.query?.page ? parseInt(req.query.page.toString()) : 1,
    pageRow: req.query?.pageRow ? parseInt(req.query.pageRow.toString()) : 10,
    sr: req.query?.sr ? parseInt(req.query.sr.toString()) : 0,
    srTxt: req.query?.srTxt ? req.query.srTxt.toString() : "",
    srBeginDate: req.query?.srBeginDate ? req.query.srBeginDate.toString() : "",
    srEndDate: req.query?.srEndDate ? req.query.srEndDate.toString() : "",
    srUsed: req.query?.srUsed ? req.query.srUsed.toString() : "",
  };

  const result: IResult = await swapControllers.acList(sParams);

  res.status(200).send(result);
});

router.get("/orders", mwIsWalletAuthJWT, async (req, res) => {
  let sParams = {
    page: req.query?.page ? parseInt(req.query.page.toString()) : 1,
    pageRow: req.query?.pageRow ? parseInt(req.query.pageRow.toString()) : 10,
    sr: req.query?.sr ? parseInt(req.query.sr.toString()) : 0,
    srTxt: req.query?.srTxt ? req.query.srTxt.toString() : "",
    srBeginDate: req.query?.srBeginDate ? req.query.srBeginDate.toString() : "",
    srEndDate: req.query?.srEndDate ? req.query.srEndDate.toString() : "",
    srUsed: req.query?.srUsed ? req.query.srUsed.toString() : "",
    srType: req.query?.type ? req.query.type.toString() : "all",
  };

  if (sParams.srType === "my") {
    if (req.walletAuth && req.walletAuth.address) {
      sParams = { ...sParams, sr: 2, srTxt: req.walletAuth.address };
    } else {
      res.status(200).send({
        success: false,
        message: "Wallet authentication is required.",
      });
      return;
    }
  }

  const result: IResult = await swapControllers.acList(sParams);

  res.status(200).send(result);
});

router.get("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const result: IResult = await swapControllers.acDetail(id);

  res.status(200).send(result);
});

export default router;
