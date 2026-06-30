import express from 'express';
import masterSecureController from '../../../../controllers/masters/master.secure';

const router = express.Router();

router.get('/', async (req, res) => {
  const sParams = {
    page: req.query?.page ? parseInt(req.query.page.toString()) : 1,
    pageRow: req.query?.pageRow ? parseInt(req.query.pageRow.toString()) : 10,
    sr: req.query?.sr ? parseInt(req.query.sr.toString()) : 0,
    srTxt: req.query?.srTxt ? req.query.srTxt.toString() : "",
    srBeginDate: req.query?.srBeginDate ? req.query.srBeginDate.toString() : "",
    srEndDate: req.query?.srEndDate ? req.query.srEndDate.toString() : "",
    srUsed: req.query?.srUsed ? req.query.srUsed.toString() : "",
  };

  const { success, data, message, count } = await masterSecureController.acList(sParams);
  res.status(200).json({ success, data, message, count });
});

router.get('/:secureId', async (req, res) => {
  const secureId = parseInt(req.params.secureId);
  const { success, data, message, count } = await masterSecureController.acDetail(secureId);
  res.status(200).json({ success, data, message, count });
});

router.post('/', async (req, res) => {
  const sParams = {
    class: req.body.class,
    secure_code: req.body.secureCode,
    limited_at: req.body.limitedAt,
    master_id: req.body.masterId,
  };

  const { success, data, message, count } = await masterSecureController.acSave(sParams);
  res.status(200).json({ success, data, message, count });
});

router.delete('/:secureId', async (req, res) => {
  const secureId = parseInt(req.params.secureId);
  const { success, data, message, count } = await masterSecureController.acRemove(secureId);
  res.status(200).json({ success, data, message, count });
});


export default router;