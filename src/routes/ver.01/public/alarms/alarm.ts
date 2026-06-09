import express from "express";
import { IResult } from "../../../../libs/interface/result.interface.js";
import alarmControllers from "../../../../controllers/alarms/alarm";

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

  const result: IResult = await alarmControllers.acList(sParams);

  res.status(200).send(result);
});

router.get("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const result: IResult = await alarmControllers.acDetail(id);

  res.status(200).send(result);
});

router.post("/", async (req, res) => {
  let sParams = {
    contents: req.body?.contents ? req.body.contents.toString() : "",
    is_use: req.body?.isUse ? parseInt(req.body.is_use.toString()) : 1,
    is_notice: req.body?.isNotice ? parseInt(req.body.is_notice.toString()) : 0,
    sended_at: req.body?.sended_at ? req.body.sended_at.toString() : ""
  };

  const result: IResult = await alarmControllers.acSave(sParams);

  res.status(200).send(result);
});

router.put("/:id", async (req, res) => {
  let sParams = {
    alarm_id: parseInt(req.params.id),
    contents: req.body?.contents ? req.body.contents.toString() : ""
  };

  const result: IResult = await alarmControllers.acChange(sParams);
  res.status(200).send(result);
});

router.patch("/:id/status", async (req, res) => {
  let sParams = {
    alarm_id: parseInt(req.params.id),
    alarm_status: req.body?.alarm_status ? parseInt(req.body.alarm_status.toString()) : 1,
  };

  const result: IResult = await alarmControllers.acPatchStatus(sParams);
  res.status(200).send(result);
});

router.delete("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const result: IResult = await alarmControllers.acRemove(id);
  res.status(200).send(result);
});

export default router;
