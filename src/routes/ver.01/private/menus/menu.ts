import express from 'express';

import menuController from '../../../../controllers/menus/menu';

const router = express.Router();

router.get('/', async (req, res) => {
  let sParams = {
    page: req.query?.page ? parseInt(req.query.page.toString()) : 1,
    pageRow: req.query?.pageRow ? parseInt(req.query.pageRow.toString()) : 10,
    sr: req.query?.sr ? parseInt(req.query.sr.toString()) : 0,
    srTxt: req.query?.srTxt ? req.query.srTxt.toString() : "",
    srBeginDate: req.query?.srBeginDate ? req.query.srBeginDate.toString() : "",
    srEndDate: req.query?.srEndDate ? req.query.srEndDate.toString() : "",
  };
  
  const { success, data, message } = await menuController.acList(sParams);
  res.status(200).json({ success, data, message });
});

router.get('/:menuCode', async (req, res) => {
  const menuCode = req.params.menuCode;
  const { success, data, message } = await menuController.acDetail(menuCode);
  res.status(200).json({ success, data, message });
});

router.post('/', async (req, res) => {
  let sParams = {
    menu_code: req.body.menuCode,
    grant: req.body.grant,
    menu_name: req.body.menuName,
  };

  const { success, data, message } = await menuController.acSave(sParams);
  res.status(200).json({ success, data, message });
});

router.put('/:menuCode', async (req, res) => {
  const menuData = req.body;

  let sParams = {
    menu_code: req.params.menuCode,
    grant: menuData.grant,
    menu_name: menuData.menuName,
  };

  const { success, data, message } = await menuController.acChange(sParams);
  res.status(200).json({ success, data, message });
});

router.delete('/:menuCode', async (req, res) => {
  const menuCode = req.params.menuCode;
  const { success, data, message } = await menuController.acRemove(menuCode);
  res.status(200).json({ success, data, message });
});

export default router;