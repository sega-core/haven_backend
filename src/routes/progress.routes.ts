import { Router } from 'express';
import {
  getProgress,
  getProgressRange,
} from '../controllers/progress.controller';

const router = Router();

router.get('/progress', getProgress);
router.get('/progress-range', getProgressRange);

export default router;
