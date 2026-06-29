import express from 'express';
import chartRouter from './chart';

const router = express.Router();

router.use('/chart', chartRouter);
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'charts route is working'
  });
});

export default router;