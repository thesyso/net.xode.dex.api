import express from 'express';
import alarmRouter from './alarm';
import alarmSendRouter from './send';

const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'alarms route is working'
  });
});

router.use('/alarm', alarmRouter);
router.use('/send', alarmSendRouter);

export default router;