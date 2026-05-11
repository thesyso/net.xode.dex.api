import express from 'express';
import marketRouter from './market';
import marketI18nRouter from './i18n';
import marketTickerRouter from './ticker';
import marketChartRouter from './chart';

const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'markets route is working'
  });
});

router.use('/market', marketRouter);
router.use('/i18n', marketI18nRouter);
router.use('/ticker', marketTickerRouter);
router.use('/chart', marketChartRouter);
export default router;