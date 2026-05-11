import express from 'express';
import boardRouter from './board';
import boardFavoriteRouter from './favorite';
import boardFileRouter from './file';
import boardHitRouter from './hit';
import boardImageRouter from './image';

const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'boards route is working'
  });
});

router.use('/board', boardRouter);
router.use('/favorite', boardFavoriteRouter);
router.use('/file', boardFileRouter);
router.use('/hit', boardHitRouter);
router.use('/image', boardImageRouter);

export default router;