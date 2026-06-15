import express from 'express';
import boardRouter from './board';
import boardFileRouter from './board.file';
import boardHitRouter from './board.hit';
import boardImageRouter from './board.image';
import boardfavoriteRouter from './board.favorite';

const router = express.Router();

router.use('/board', boardRouter);
router.use('/board.file', boardFileRouter);
router.use('/board.hit', boardHitRouter);
router.use('/board.image', boardImageRouter);
router.use('/board.favorite', boardfavoriteRouter);

router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'bases route is working'
  });
});

export default router;