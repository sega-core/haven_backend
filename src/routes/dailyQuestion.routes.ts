import { Router } from 'express';
import { createAnswer } from '../controllers/dailyQuestion.controller';

const router = Router();

router.post('/question', createAnswer);

export default router;
