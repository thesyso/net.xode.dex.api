import express from 'express';
import walletRouter from './wallet';
import walletTransactionRouter from './transaction';

const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'wallets route is working'
  });
});

router.use('/wallet', walletRouter);
router.use('/transaction', walletTransactionRouter);

export default router;