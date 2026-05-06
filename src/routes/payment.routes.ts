import { Router } from 'express';
import { createPayment, deactivateInvoice } from '../controllers/payment.controller';

const router = Router();

router.post('/create-payment/:practiceId', createPayment);
router.post('/deactivate-payment/:invId', deactivateInvoice);

export default router;
