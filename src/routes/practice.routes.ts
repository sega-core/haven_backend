import { Router } from 'express';
import {
  createPractice,
  getPractices,
  getPracticeInstructions,
} from '../controllers/practice.controller';

const router = Router();

router.post('/practice', createPractice);
router.get('/practices', getPractices);
router.get('/practice/:id', getPracticeInstructions);

export default router;
