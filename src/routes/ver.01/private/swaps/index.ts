import express from 'express';
import swapRouter from './swap';

const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'swaps route is working'
  });
});

router.use('/swap', swapRouter);

export default router;