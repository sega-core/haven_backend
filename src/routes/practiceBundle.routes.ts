import { Router } from 'express';
import { createPracticeBundle, getPracticeBundles } from '../controllers/practiceBundle.controller';

const router = Router();

router.post('/practice-bundle', createPracticeBundle);
router.get('/practice-bundles', getPracticeBundles);

export default router;
