import express from 'express';
import menuRouter from './menu';

const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'menus route is working'
  });
});

router.use('/menu', menuRouter);

export default router;