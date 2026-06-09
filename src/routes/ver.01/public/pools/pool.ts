import express from "express";
import { IResult } from "../../../../libs/interface/result.interface.js";
import poolControllers from "../../../../controllers/pools/pool.js";

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
    srProtocol: req.query?.srProtocol ? req.query.srProtocol.toString() : "",
    srIsMain: req.query?.srIsMain ? req.query.srIsMain.toString() : "",
  };

  const result: IResult = await poolControllers.acList(sParams);

  res.status(200).send(result);
});

router.get("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const result: IResult = await poolControllers.acDetail(id);

  res.status(200).send(result);
});

router.post("/", async (req, res) => {
  let sParams = {
    market_code: req.body?.market_code ? req.body.market_code.toString() : "",
    market_target_code: req.body?.market_target_code ? req.body.market_target_code.toString() : "",
    protocol: req.body?.protocol ? req.body.protocol.toString() : "",
    asset_id: req.body?.asset_id ? req.body.asset_id.toString() : "",
    amount: req.body?.amount ? req.body.amount.toString() : "",
    target_amount: req.body?.target_amount ? req.body.target_amount.toString() : "",
    fee_rate: req.body?.fee_rate ? req.body.fee_rate.toString() : "0.03",
    reward: req.body?.reward ? req.body.reward.toString() : "0",
    total_value_locked: req.body?.total_value_locked ? req.body.total_value_locked.toString() : "0",
    annual_percentage_rate: req.body?.annual_percentage_rate ? req.body.annual_percentage_rate.toString() : "0",
    is_main: req.body?.is_main ? parseInt(req.body.is_main.toString()) : 1,
  };

  const result: IResult = await poolControllers.acSave(sParams);

  res.status(200).send(result);
});

router.patch("/:id", async (req, res) => {
  let sParams = {
    chmode: req.body?.chmode ? req.body.chmode.toString() : "status",
    pool_id: parseInt(req.params.id),
    pool_status: req.body?.swap_status
      ? parseInt(req.body.swap_status.toString())
      : 1,
  };

  const result: IResult = await poolControllers.acPatch(sParams);

  res.status(200).send(result);
});

router.delete("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const result: IResult = await poolControllers.acRemove(id);
  res.status(200).send(result);
});

export default router;
