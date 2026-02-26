import express from 'express';
import baseRouter from './bases';

const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'base route is working'
  });
});
router.use('/base', baseRouter);


export default router;