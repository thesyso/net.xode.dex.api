import express from 'express';
import secureRouter from './secure';

const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'secures route is working'
  });
});

router.use('/secure', secureRouter);

export default router;