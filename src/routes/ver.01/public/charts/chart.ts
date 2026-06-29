import express from 'express';
import { IResult } from '../../../../libs/interface/result.interface.js';
import chartControllers from '../../../../controllers/charts/chart.js';

const router = express.Router();

// GET /api/v1/public/charts/chart?pairKey=XON_GEM&interval=1m&chain=XODE&srBeginDate=...&srEndDate=...
router.get('/', async (req, res) => {
  const sParams = {
    page: req.query?.page ? parseInt(req.query.page.toString()) : 1,
    pageRow: req.query?.pageRow ? parseInt(req.query.pageRow.toString()) : 500,
    interval: req.query?.interval ? req.query.interval.toString() : '60m',
    pairKey: req.query?.pairKey ? req.query.pairKey.toString() : '',
    chain: req.query?.chain ? req.query.chain.toString() : 'XODE',
    srBeginDate: req.query?.srBeginDate ? req.query.srBeginDate.toString() : '',
    srEndDate: req.query?.srEndDate ? req.query.srEndDate.toString() : '',
  };

  const result: IResult = await chartControllers.acList(sParams);
  res.status(200).send(result);
});

export default router;