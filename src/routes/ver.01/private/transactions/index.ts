import express from 'express';
import transactionRouter from './transaction';

const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'transactions route is working'
  });
});

router.use('/transaction', transactionRouter);

export default router;