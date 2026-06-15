import express from "express";
import { IResult } from "../../../../libs/interface/result.interface.js";
import languageController from "../../../../controllers/bases/language.js";


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

  const result: IResult = await languageController.acList(sParams);

  res.status(200).send(result);
});

router.get("/:code", async (req, res) => {
  const language_code = req.params.code ? req.params.code.toString() : "";
  const result: IResult = await languageController.acDetail(language_code);

  res.status(200).send(result);
});

export default router;
