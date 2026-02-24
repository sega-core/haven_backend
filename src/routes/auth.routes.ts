import { Router } from 'express';
import { checkAuth } from '../controllers/auth.controller';

const router = Router();

router.get('/auth/telegram', checkAuth);

export default router;
