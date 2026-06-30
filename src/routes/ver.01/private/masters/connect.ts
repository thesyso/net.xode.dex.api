import express from 'express';
import masterConnectController from '../../../../controllers/masters/master.connect';

const router = express.Router();

router.get('/', async (req, res) => {
  const sParams = {
    page: req.query?.page ? parseInt(req.query.page.toString()) : 1,
    pageRow: req.query?.pageRow ? parseInt(req.query.pageRow.toString()) : 10,
    sr: req.query?.sr ? parseInt(req.query.sr.toString()) : 0,
    srTxt: req.query?.srTxt ? req.query.srTxt.toString() : "",
    srBeginDate: req.query?.srBeginDate ? req.query.srBeginDate.toString() : "",
    srEndDate: req.query?.srEndDate ? req.query.srEndDate.toString() : "",
    srMasterId: req.query?.masterId ? parseInt(req.query.masterId.toString()) : "",
  };

  const { success, data, message, count } = await masterConnectController.acList(sParams);
  res.status(200).json({ success, data, message, count });
});

router.get('/:connectId', async (req, res) => {
  const connectId = parseInt(req.params.connectId);
  const { success, data, message, count } = await masterConnectController.acDetail(connectId);
  res.status(200).json({ success, data, message, count });
});

router.post('/', async (req, res) => {
  const sParams = {
    memo: req.body.memo,
    connected_ip: req.body.connectedIp,
    master_id: req.body.masterId,
  };

  const { success, data, message, count } = await masterConnectController.acSave(sParams);
  res.status(200).json({ success, data, message, count });
});

router.delete('/:connectId', async (req, res) => {
  const connectId = parseInt(req.params.connectId);
  const { success, data, message, count } = await masterConnectController.acRemove(connectId);
  res.status(200).json({ success, data, message, count });
});


export default router;