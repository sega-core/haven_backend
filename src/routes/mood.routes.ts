import { Router } from 'express';
import { createMood } from '../controllers/mood.controller';

const router = Router();

router.post('/mood', createMood);

export default router;
