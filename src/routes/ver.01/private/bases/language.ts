import express from "express";
import languageController from "../../../../controllers/bases/language";
import { IResult } from "../../../../libs/interface/result.interface";

const router = express.Router();

const getParams = (query: any) => {
  var r_page = query.page ? query.page : 1;
  var r_pageRow = query.pageRow ? parseInt(query.pageRow) : 10;

  var r_sr = query.sr ? query.sr : 0;
  var r_srTxt = query.srTxt?.length > 0 ? query.srTxt : "";

  var r_beginDate = query.srBeginDate ? query.srBeginDate : "";
  var r_endDate = query.srEndDate ? query.srEndDate : "";

  var sParams = {
    page: r_page,
    pageRow: r_pageRow,
    sr: r_sr,
    srTxt: r_srTxt,
    srBeginDate: r_beginDate,
    srEndDate: r_endDate,
  };

  return sParams;
};

router.get("/", async (req, res) => {
  let sParams = getParams(req.query);
  const result = await languageController.acList(sParams);
  res.status(200).json(result);
});

router.get("/:id", async (req, res) => {
  let ucode = req.params.id;
  console.log(`Requested language code: ${ucode}`);
  const result = await languageController.acDetail(ucode);
  res.status(200).json(result);
});

router.post("/", async (req, res) => {
  const params = req.body;
  const result = await languageController.acSave(params);
  res.status(200).json(result);
});

router.put("/", async (req, res) => {
  const params = req.body;
  const result = await languageController.acChange(params);
  res.status(200).json(result);
});

router.delete("/:id", async (req, res) => {
  const ucode = req.params.id;
  const result = await languageController.acRemove(ucode);
  res.status(200).json(result);
});

export default router;
