/* import { authMiddleware } from './../middlewares/authMiddleware'; */
import { Router } from 'express';
import { createGratitude } from '../controllers/gratitude.controller';

const router = Router();

router.post('/gratitude', createGratitude);

export default router;
