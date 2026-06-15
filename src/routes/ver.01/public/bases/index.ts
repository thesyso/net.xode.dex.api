import express from 'express';
import languageRouter from './language';

const router = express.Router();

router.use('/language', languageRouter);

router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'bases route is working'
  });
});

export default router;