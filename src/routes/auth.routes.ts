import { Router } from 'express';
import { checkAuth } from '../controllers/auth.controller';

const router = Router();

router.get('/me', checkAuth);

export default router;
