import express from 'express';

import authRouter from './auths';
import publicRouter from './public';
import privateRouter from './private';

const router = express.Router();

router.use("/auth", authRouter);
router.use("/public", publicRouter);  
router.use("/private", privateRouter);

router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'ver.01 route is working'
  });
});

export default router;