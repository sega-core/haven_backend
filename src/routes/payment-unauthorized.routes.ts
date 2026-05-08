import { Router } from 'express';
import { checkPaymentStatus } from '../controllers/payment.controller';

const router = Router();

router.post('/check-payment', checkPaymentStatus);

export default router;
