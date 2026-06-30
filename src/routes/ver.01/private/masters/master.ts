import express from 'express';
import masterController from '../../../../controllers/masters/master';

const router = express.Router();

router.get('/', async (req, res) => {
  const sParams = {
    page: req.query?.page ? parseInt(req.query.page.toString()) : 1,
    pageRow: req.query?.pageRow ? parseInt(req.query.pageRow.toString()) : 10,
    sr: req.query?.sr ? parseInt(req.query.sr.toString()) : 0,
    srTxt: req.query?.srTxt ? req.query.srTxt.toString() : "",
    srBeginDate: req.query?.srBeginDate ? req.query.srBeginDate.toString() : "",
    srEndDate: req.query?.srEndDate ? req.query.srEndDate.toString() : "",
    srStatus: req.query?.srStatus ? req.query.srStatus.toString() : "",
    srNation: req.query?.srNation ? req.query.srNation.toString() : "",
    srLocation: req.query?.srLocation ? req.query.srLocation.toString() : "",
  };

  const { success, data, message, count } = await masterController.acList(sParams);
  res.status(200).json({ success, data, message, count });
});

router.get('/:masterId', async (req, res) => {
  const masterId = parseInt(req.params.masterId);
  const { success, data, message, count } = await masterController.acDetail(masterId);
  res.status(200).json({ success, data, message, count });
});

router.post('/', async (req, res) => {
  const sParams = {
    status: req.body.status,
    authority: req.body.authority,
    emailid: req.body.emailId,
    password: req.body.password,
    salt: req.body.salt,
    email: req.body.email,
    mastername: req.body.masterName,
    nickname: req.body.nickName,
    nation_no: req.body.nationNo,
    phone: req.body.phone,
    nation: req.body.nation,
    location: req.body.location,
    language: req.body.language,
    address: req.body.address,
    address_detail: req.body.addressDetail,
    zipcode: req.body.zipCode,
    connected_ip: req.body.connectedIp,
  };

  const { success, data, message, count } = await masterController.acSave(sParams);
  res.status(200).json({ success, data, message, count });
});

router.patch('/:masterId', async (req, res) => {
  const sParams = {
    master_id: parseInt(req.params.masterId),
    chmode: req.body.chmode,
    status: req.body.status,
    authority: req.body.authority,
    password: req.body.password,
    salt: req.body.salt,
    email: req.body.email,
    nickname: req.body.nickName,
    mastername: req.body.masterName,
  };

  const { success, data, message, count } = await masterController.acPatch(sParams);
  res.status(200).json({ success, data, message, count });
});

router.delete('/:masterId', async (req, res) => {
  const masterId = parseInt(req.params.masterId);
  const { success, data, message, count } = await masterController.acRemove(masterId);
  res.status(200).json({ success, data, message, count });
});


export default router;