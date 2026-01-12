// routes/mood.routes.ts
import { Router } from 'express';
import { MoodController } from '../controllers/mood.controller';

const router = Router();

router.post('/', MoodController.create);
router.get('/today',  MoodController.getToday);
router.delete('/:id', MoodController.remove);

export default router;
