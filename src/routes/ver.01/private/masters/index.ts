import express from 'express';
import masterRouter from './master';
import masterSecureRouter from './secure';
import masterConnectRouter from './connect';

const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'masters route is working'
  });
});

router.use('/master', masterRouter);
router.use('/secure', masterSecureRouter);
router.use('/connect', masterConnectRouter);

export default router;