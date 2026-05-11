import express from 'express';
import baseCoinRouter from './coin';
import baseExchangeRouter from './exchange';
import languageRouter from './language';


const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'bases route is working'
  });
});

router.use('/coin', baseCoinRouter);
router.use('/exchange', baseExchangeRouter);
router.use('/language', languageRouter);

export default router;