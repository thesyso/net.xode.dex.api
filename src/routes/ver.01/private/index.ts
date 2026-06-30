import express from 'express';

import { mwMemberAuthJWT, mwMasterPrivateAuthJWT } from '../../../mwares/mwAuth';

import alarmRouter from './alarms';
import assetRouter from './assets';
import boardRouter from './boards';
import baseRouter from './bases';
import marketRouter from './markets';
import masterRouter from './masters';
import menuRouter from './menus';
import nodeRouter from './nodes';
import participantRouter from './participants';
import poolRouter from './pools';
import secureRouter from './secures';
import soboardRouter from './soboards';
import swapRouter from './swaps';
import transactionRouter from './transactions';
import userRouter from './users';
import walletRouter from './wallets';

const router = express.Router();

router.use(mwMemberAuthJWT, mwMasterPrivateAuthJWT);

router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'private route is working'
  });
});

router.use('/alarms', alarmRouter);
router.use('/assets', assetRouter);
router.use('/boards', boardRouter);
router.use('/bases', baseRouter);
router.use('/markets', marketRouter);
router.use('/masters', masterRouter);
router.use('/menus', menuRouter);
router.use('/nodes', nodeRouter);
router.use('/participants', participantRouter);
router.use('/pools', poolRouter);
router.use('/secures', secureRouter);
router.use('/soboards', soboardRouter);
router.use('/swaps', swapRouter);
router.use('/transactions', transactionRouter);
router.use('/users', userRouter);
router.use('/wallets', walletRouter);

export default router;