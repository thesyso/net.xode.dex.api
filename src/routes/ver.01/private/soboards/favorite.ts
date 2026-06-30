import express from 'express';
import soboardFavoriteController from '../../../../controllers/soboards/soboard.favorite';

const router = express.Router();

router.get('/', async (req, res) => {
  const sParams: any = {
    page: req.query?.page ? parseInt(req.query.page.toString()) : 1,
    pageRow: req.query?.pageRow ? parseInt(req.query.pageRow.toString()) : 10,
    sr: req.query?.sr ? parseInt(req.query.sr.toString()) : 0,
    srTxt: req.query?.srTxt ? req.query.srTxt.toString() : "",
    srBeginDate: req.query?.srBeginDate ? req.query.srBeginDate.toString() : "",
    srEndDate: req.query?.srEndDate ? req.query.srEndDate.toString() : "",
    srUsed: req.query?.srUsed ? req.query.srUsed.toString() : "",
  };

  const soboardId = req.query?.soboardId ? parseInt(req.query.soboardId.toString()) : 0;
  if (soboardId) {
    sParams.sr = 1;
    sParams.srTxt = soboardId.toString();
  }

  const { success, data, message, count } = await soboardFavoriteController.acList(sParams);
  res.status(200).json({ success, data, message, count });
});

router.get('/:favoriteId', async (req, res) => {
  const favoriteId = parseInt(req.params.favoriteId);
  const { success, data, message, count } = await soboardFavoriteController.acDetail(favoriteId);
  res.status(200).json({ success, data, message, count });
});

router.post('/', async (req, res) => {
  const sParams = {
    soboard_id: req.body.soboardId,
    wallet_id: req.body.walletId,
  };

  const { success, data, message, count } = await soboardFavoriteController.acSave(sParams);
  res.status(200).json({ success, data, message, count });
});

router.delete('/:favoriteId', async (req, res) => {
  const favoriteId = parseInt(req.params.favoriteId);
  const { success, data, message, count } = await soboardFavoriteController.acRemove(favoriteId);
  res.status(200).json({ success, data, message, count });
});


export default router;