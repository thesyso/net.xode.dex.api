import express from 'express';
import nodesRouter from "./nodes/index.js";
import assetsRouter from "./assets/index.js";

const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'base route is working'
  });
});

router.use('/assets', assetsRouter);
router.use('/nodes', nodesRouter);
export default router;