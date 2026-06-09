import express from 'express';
import nodesRouter from "./nodes/index.js";
import assetsRouter from "./assets/index.js";
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
router.use('/nodes', nodesRouter);
router.use('/pools', poolsRouter);
router.use('/swaps', swapsRouter);
router.use('/wallets', walletsRouter);
export default router;