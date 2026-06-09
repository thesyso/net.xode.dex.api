import express from 'express';
import assetRouter from './asset';
import blockRouter from './block';
import transactionRouter from './transaction';

const router = express.Router();

router.use('/asset', assetRouter);
router.use('/block', blockRouter);
router.use('/transaction', transactionRouter);

router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'pools route is working'
  });
});

export default router;