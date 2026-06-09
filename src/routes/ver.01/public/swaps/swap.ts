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

router.post("/", mwWalletAuthJWT, async (req, res) => {
  let sParams = {
    swap_action: req.body?.swap_action ? req.body.swap_action.toString() : "",
    swap_status: req.body?.swap_status ? parseInt(req.body.swap_status.toString()) : 1,
    swap_price: req.body?.swap_price ? parseFloat(req.body.swap_price.toString()) : 0,
    swap_volume: req.body?.swap_volume ? parseFloat(req.body.swap_volume.toString()) : 0,
    swap_fee: req.body?.swap_fee ? parseFloat(req.body.swap_fee.toString()) : 0,
    swap_txid: req.body?.swap_txid ? req.body.swap_txid.toString() : "",
    market_code: req.body?.market_code ? req.body.market_code.toString() : "", 
    market_price: req.body?.market_price ? parseFloat(req.body.market_price.toString()) : 0,
    wallet_id: req.body?.wallet_id ? req.body.wallet_id.toString() : "",
    address: req.body?.address ? req.body.address.toString() : "",
    address_memo: req.body?.address_memo ? req.body.address_memo.toString() : "",
    target_market_code: req.body?.target_market_code ? req.body.target_market_code.toString() : "",
    target_market_price: req.body?.target_market_price ? parseFloat(req.body.target_market_price.toString()) : 0,
    target_wallet_id: req.body?.target_wallet_id ? req.body.target_wallet_id.toString() : "",
    target_address: req.body?.target_address ? req.body.target_address.toString() : "",
    target_address_memo: req.body?.target_address_memo ? req.body.target_address_memo.toString() : "",
    is_open: req.body?.is_open ? parseInt(req.body.is_open.toString()) : 1,
    pool_id: req.body?.pool_id ? parseInt(req.body.pool_id.toString()) : 0,
  };

  const result: IResult = await swapControllers.acSave(sParams);

  res.status(200).send(result);
});

router.patch("/:id", async (req, res) => {
  let sParams = {
    chmode: req.body?.chmode ? req.body.chmode.toString() : "status",
    swap_id: parseInt(req.params.id),
    swap_status: req.body?.swap_status
      ? parseInt(req.body.swap_status.toString())
      : 1,
  };

  const result: IResult = await swapControllers.acPatch(sParams);

  res.status(200).send(result);
});

router.delete("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const result: IResult = await swapControllers.acRemove(id);
  res.status(200).send(result);
});

export default router;
