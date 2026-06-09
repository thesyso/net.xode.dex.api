import express from 'express';
import swapRoutes from './swap.js';

const router = express.Router();

router.use('/swap', swapRoutes);

router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'pools route is working'
  });
});



/**
 * 기본 
 * 조회, 상세, 등록, 수정, 삭제등의 기본 기능을 구성해야 함.
 * 관리자 페이지 쪽으로 처리 해야할 부분은 여기서 처리 하지 않음.
 * */ 
export default router;