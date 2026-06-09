import express from 'express';
import poolRouter from './pool';
import poolTickerRouter from './ticker';

const router = express.Router();

router.use('/pool', poolRouter);
router.use('/ticker', poolTickerRouter);

router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'pools route is working'
  });
});

export default router;