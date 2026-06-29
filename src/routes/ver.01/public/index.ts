import express from 'express';

import assetsRouter from "./assets/index.js";
import alarmsRouter from './alarms/index.js';
import basesRouter from './bases/index.js';
import boardsRouter from './boards/index.js';
import chartsRouter from './charts/index.js';
import nodesRouter from "./nodes/index.js";
import poolsRouter from "./pools/index.js";
import swapsRouter from "./swaps/index.js";
import walletsRouter from "./wallets/index.js";

const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'base route is working'
  });
});

router.use('/assets', assetsRouter);
router.use('/alarms', alarmsRouter);
router.use('/bases', basesRouter);
router.use('/boards', boardsRouter);
router.use('/charts', chartsRouter);
router.use('/nodes', nodesRouter);
router.use('/pools', poolsRouter);
router.use('/swaps', swapsRouter);
router.use('/wallets', walletsRouter);
export default router;