import express from 'express';
import userRouter from './user';
import userWalletRouter from './wallet';

const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'users route is working'
  });
});

router.use('/user', userRouter);
router.use('/wallet', userWalletRouter);

export default router;