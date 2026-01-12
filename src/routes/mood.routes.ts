import { Router } from 'express';
import {
  createMood,
  getMood,
  getMoodTags,
} from '../controllers/mood.controller';

const router = Router();

router.post('/mood', createMood);
router.get('/mood', getMood);
router.get('/mood/tags', getMoodTags);

export default router;
