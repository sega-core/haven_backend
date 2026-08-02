import { Router } from 'express';
import {
  getNotificationHistoryController,
  sendNotificationController,
} from '../controllers/notification.controller';

const router = Router();

router.post('/notification/send', sendNotificationController);
router.get('/notification/history', getNotificationHistoryController);

export default router;
