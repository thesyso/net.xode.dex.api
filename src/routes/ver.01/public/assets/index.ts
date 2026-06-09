import express from 'express';
import assetRouter from './asset';

const router = express.Router();

router.use('/asset', assetRouter);

router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'pools route is working'
  });
});

export default router;