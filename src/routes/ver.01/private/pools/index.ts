import express from 'express';
import poolRouter from './pool';
import poolTickerRouter from './ticker';

const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'pools route is working'
  });
});

router.use('/pool', poolRouter);
router.use('/ticker', poolTickerRouter);

export default router;