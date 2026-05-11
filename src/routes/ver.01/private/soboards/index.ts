import express from 'express';
import soboardRouter from './soboard';
import soboardImageRouter from './image';
import soboardFavoriteRouter from './favorite';
import soboardHitRouter from './hit';
import soboardFileRouter from './file';
import soboardContentRouter from './content';

const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'soboards route is working'
  });
});

router.use('/soboard', soboardRouter);
router.use('/image', soboardImageRouter);
router.use('/favorite', soboardFavoriteRouter);
router.use('/hit', soboardHitRouter);
router.use('/file', soboardFileRouter);
router.use('/content', soboardContentRouter);


export default router;