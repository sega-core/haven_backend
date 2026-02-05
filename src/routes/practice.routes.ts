import { Router } from 'express';
import { createPractice, getPractices } from '../controllers/practice.controller';

const router = Router();

router.post('/practice', createPractice);
router.get('/practices', getPractices);

export default router;
