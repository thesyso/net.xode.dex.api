import express from 'express';

// 라우터 모듈들을 import 합니다.
import masterRouter from './master';
import walletRouter from './wallet';

const router = express.Router();

router.get('/', (req, res) => {
	res.status(200).json({
		success: true,
		message: 'auth route is working'
	});
});

// 라우터 모듈들을 라우터에 등록합니다.
router.use('/master', masterRouter);
router.use('/wallet', walletRouter);

export default router;