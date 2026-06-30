import express from 'express';
import soboardContentController from '../../../../controllers/soboards/soboard.content';

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
    srBoardId: req.query?.soboardId ? parseInt(req.query.soboardId.toString()) : 0,
  };

  const { success, data, message, count } = await soboardContentController.acList(sParams);
  res.status(200).json({ success, data, message, count });
});

router.get('/:contentId', async (req, res) => {
  const contentId = parseInt(req.params.contentId);
  const { success, data, message, count } = await soboardContentController.acDetail(contentId);
  res.status(200).json({ success, data, message, count });
});

router.post('/', async (req, res) => {
  const sParams = {
    soboard_id: req.body.soboardId,
    sort: req.body.sort ?? 0,
    contents: req.body.contents,
    is_use: req.body.isUse ?? 1,
  };

  const { success, data, message, count } = await soboardContentController.acSave(sParams);
  res.status(200).json({ success, data, message, count });
});

router.put('/:contentId', async (req, res) => {
  const sParams = {
    content_id: parseInt(req.params.contentId),
    sort: req.body.sort ?? 0,
    contents: req.body.contents,
  };

  const { success, data, message, count } = await soboardContentController.acChange(sParams);
  res.status(200).json({ success, data, message, count });
});

router.delete('/:contentId', async (req, res) => {
  const contentId = parseInt(req.params.contentId);
  const { success, data, message, count } = await soboardContentController.acRemove(contentId);
  res.status(200).json({ success, data, message, count });
});


export default router;