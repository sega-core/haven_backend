import { Router } from 'express';
import { checkPaymentStatus } from '../controllers/payment.controller';

const router = Router();

router.post('/payment-result', checkPaymentStatus);

export default router;
