import express from 'express';
import asset from './asset';

const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'assets route is working'
  });
});

router.use('/asset', asset);

export default router;