import { Router } from 'express';
import {
  handleCreateAnswer, handleGetTodayQuestion
} from '../controllers/dailyQuestion.controller';

const router = Router();

router.get('/question', handleGetTodayQuestion);
router.post('/question', handleCreateAnswer);

export default router;
