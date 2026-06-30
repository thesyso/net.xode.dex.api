import express from 'express';
import soboardHitController from '../../../../controllers/soboards/soboard.hit';

const router = express.Router();

router.get('/', async (req, res) => {
  const sParams: any = {
    page: req.query?.page ? parseInt(req.query.page.toString()) : 1,
    pageRow: req.query?.pageRow ? parseInt(req.query.pageRow.toString()) : 10,
    sr: req.query?.sr ? parseInt(req.query.sr.toString()) : 0,
    srTxt: req.query?.srTxt ? req.query.srTxt.toString() : "",
    srBeginDate: req.query?.srBeginDate ? req.query.srBeginDate.toString() : "",
    srEndDate: req.query?.srEndDate ? req.query.srEndDate.toString() : "",
  };

  const soboardId = req.query?.soboardId ? parseInt(req.query.soboardId.toString()) : 0;
  if (soboardId) {
    sParams.sr = 1;
    sParams.srTxt = soboardId.toString();
  }

  const { success, data, message, count } = await soboardHitController.acList(sParams);
  res.status(200).json({ success, data, message, count });
});

router.get('/:hitId', async (req, res) => {
  const hitId = parseInt(req.params.hitId);
  const { success, data, message, count } = await soboardHitController.acDetail(hitId);
  res.status(200).json({ success, data, message, count });
});

router.post('/', async (req, res) => {
  const sParams = {
    soboard_id: req.body.soboardId,
    wallet_id: req.body.walletId,
  };

  const { success, data, message, count } = await soboardHitController.acSave(sParams);
  res.status(200).json({ success, data, message, count });
});

router.delete('/:hitId', async (req, res) => {
  const hitId = parseInt(req.params.hitId);
  const { success, data, message, count } = await soboardHitController.acRemove(hitId);
  res.status(200).json({ success, data, message, count });
});


export default router;