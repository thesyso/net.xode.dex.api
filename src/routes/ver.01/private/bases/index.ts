import express from 'express';
import languageRouter from './language';

const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'base route is working'
  });
});
router.use('/language', languageRouter);


export default router;