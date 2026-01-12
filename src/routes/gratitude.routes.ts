/* import { authMiddleware } from './../middlewares/authMiddleware'; */
import { Router } from 'express';
import {
  createGratitude,
  getGratitude,
} from '../controllers/gratitude.controller';

const router = Router();

router.post('/gratitude', createGratitude);
router.get('/gratitude', getGratitude);

export default router;
