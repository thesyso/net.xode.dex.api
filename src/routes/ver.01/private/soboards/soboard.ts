import express from 'express';
import soboardController from '../../../../controllers/soboards/soboard';

const router = express.Router();

router.get('/', async (req, res) => {
  const sParams = {
    page: req.query?.page ? parseInt(req.query.page.toString()) : 1,
    pageRow: req.query?.pageRow ? parseInt(req.query.pageRow.toString()) : 10,
    sr: req.query?.sr ? parseInt(req.query.sr.toString()) : 0,
    srTxt: req.query?.srTxt ? req.query.srTxt.toString() : "",
    srBeginDate: req.query?.srBeginDate ? req.query.srBeginDate.toString() : "",
    srEndDate: req.query?.srEndDate ? req.query.srEndDate.toString() : "",
    cago: req.query?.cago ? req.query.cago.toString() : "",
    srStatus: req.query?.srStatus ? req.query.srStatus.toString() : "1",
  };

  const { success, data, message, count } = await soboardController.acList(sParams);
  res.status(200).json({ success, data, message, count });
});

router.get('/:soboardId', async (req, res) => {
  const soboardId = parseInt(req.params.soboardId);
  const { success, data, message, count } = await soboardController.acDetail(soboardId);
  res.status(200).json({ success, data, message, count });
});

router.post('/', async (req, res) => {
  const sParams = {
    cago: req.body.cago,
    status: req.body.status ?? 1,
    writer: req.body.writer,
    subject: req.body.subject,
    contents: req.body.contents,
    contents_count: req.body.contentsCount ?? 0,
    user_id: req.body.userId ?? null,
    wallet_id: req.body.walletId,
  };

  const { success, data, message, count } = await soboardController.acSave(sParams);
  res.status(200).json({ success, data, message, count });
});

router.put('/:soboardId', async (req, res) => {
  const sParams = {
    soboard_id: parseInt(req.params.soboardId),
    subject: req.body.subject,
    contents: req.body.contents,
  };

  const { success, data, message, count } = await soboardController.acChange(sParams);
  res.status(200).json({ success, data, message, count });
});

router.delete('/:soboardId', async (req, res) => {
  const soboardId = parseInt(req.params.soboardId);
  const { success, data, message, count } = await soboardController.acRemove(soboardId);
  res.status(200).json({ success, data, message, count });
});


export default router;