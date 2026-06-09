import express from "express";
import { IResult } from "../../../../libs/interface/result.interface.js";
import alarmSendControllers from "../../../../controllers/alarms/alarm.send";

const router = express.Router();

router.get("/", async (req, res) => {
  let sParams = {
    page: req.query?.page ? parseInt(req.query.page.toString()) : 1,
    pageRow: req.query?.pageRow ? parseInt(req.query.pageRow.toString()) : 10,
    sr: req.query?.sr ? parseInt(req.query.sr.toString()) : 0,
    srTxt: req.query?.srTxt ? req.query.srTxt.toString() : "",
    srBeginDate: req.query?.srBeginDate ? req.query.srBeginDate.toString() : "",
    srEndDate: req.query?.srEndDate ? req.query.srEndDate.toString() : "",
  };

  const result: IResult = await alarmSendControllers.acList(sParams);

  res.status(200).send(result);
});

router.get("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const result: IResult = await alarmSendControllers.acDetail(id);

  res.status(200).send(result);
});

router.post("/", async (req, res) => {
  let sParams = {
    alarm_id: req.body?.alarm_id ? req.body.alarm_id.toString() : "",
    user_wallet_id: req.body?.user_wallet_id ? req.body.user_wallet_id.toString() : "",
  };

  const result: IResult = await alarmSendControllers.acSave(sParams);

  res.status(200).send(result);
});

router.patch("/:id", async (req, res) => {
  let sParams = {
    send_id: parseInt(req.params.id),
    status: req.body?.status ? parseInt(req.body.status.toString()) : 1,
    mode: req.body?.mode ? req.body.mode.toString() : "status"
  };

  const result: IResult = await alarmSendControllers.acPatchIscheck(sParams);
  res.status(200).send(result);
});

export default router;
