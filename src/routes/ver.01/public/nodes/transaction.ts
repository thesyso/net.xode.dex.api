import express from 'express';
import transactionController from "../../../../controllers/nodes/transaction.js";

const router = express.Router();

router.get('/', async (req, res) => {
  let sParams = {
    assetNode: req.query?.assetNode ? req.query.assetNode.toString() : "",
    assetName: req.query?.assetName ? req.query.assetName.toString() : "",
    page: req.query?.page ? parseInt(req.query.page.toString()) : 1,
    pageRow: req.query?.pageRow ? parseInt(req.query.pageRow.toString()) : 10,
    sr: req.query?.sr ? parseInt(req.query.sr.toString()) : 0,
    srTxt: req.query?.srTxt ? req.query.srTxt.toString() : "",
    srBeginDate: req.query?.srBeginDate ? req.query.srBeginDate.toString() : "",
    srEndDate: req.query?.srEndDate ? req.query.srEndDate.toString() : "",
  };

  const { success, data, message } = await transactionController.acList(sParams);
  res.status(200).json({ success, data, message });
});

router.delete('/:id', async (req, res) => {
  const id = req.params?.id ? req.params.id.toString() : "";
  const { success, data, message } = await transactionController.acRemove(id);
  res.status(200).json({ success, data, message });
});



export default router;