import express from 'express';
import participantRouter from './participant';
import participantDepositRouter from './deposit';

const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'participants route is working'
  });
});

router.use('/participant', participantRouter);
router.use('/deposit', participantDepositRouter);

export default router;