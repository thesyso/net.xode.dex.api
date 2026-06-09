import express from "express";
import { IResult } from "../../../../libs/interface/result.interface.js";
import assetController from "../../../../controllers/assets/asset.js";


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

  const result: IResult = await assetController.acList(sParams);

  res.status(200).send(result);
});

router.get("/:id", async (req, res) => {
  const asset_id = req.params.id ? req.params.id.toString() : "";
  const asset_node = req.query?.asset_node ? req.query.asset_node.toString() : "";
  const result: IResult = await assetController.acDetail(asset_id, asset_node);

  res.status(200).send(result);
});

router.post("/", async (req, res) => {
  let sParams = {
    asset_id: req.body?.asset_id ? req.body.asset_id.toString() : "",
    asset_node: req.body?.asset_node ? req.body.asset_node.toString() : "",
    asset_name: req.body?.asset_name ? req.body.asset_name.toString() : "",
    asset_symbol: req.body?.asset_symbol ? req.body.asset_symbol.toString() : "",
    asset_decimals: req.body?.asset_decimals ? parseInt(req.body.asset_decimals.toString()) : 0,
  };

  const result: IResult = await assetController.acSave(sParams);

  res.status(200).send(result);
});

router.patch("/:id", async (req, res) => {
  let sParams = {
    chmode: req.body?.chmode ? req.body.chmode.toString() : "status",
    asset_id: req.params.id ? req.params.id.toString() : "",
    asset_status: req.body?.asset_status
      ? parseInt(req.body.asset_status.toString())
      : 1,
  };

  const result: IResult = await assetController.acPatchStatus(sParams);

  res.status(200).send(result);
});

router.delete("/:id", async (req, res) => {
  const asset_id = req.params.id ? req.params.id.toString() : "";
  const asset_node = req.query?.asset_node ? req.query.asset_node.toString() : "";
  const result: IResult = await assetController.acRemove(asset_id, asset_node);
  res.status(200).send(result);
});

export default router;
