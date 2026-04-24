import { Router } from 'express';
import { registration } from '../controllers/registration.controller';

const router = Router();

router.post('/registration', registration);

export default router;
