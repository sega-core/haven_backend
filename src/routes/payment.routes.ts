import { Router } from 'express';
import { deactivateInvoice, createPayment } from '../controllers/payment.controller';

const router = Router();

router.post('/create-payment', createPayment);
router.post('/deactivate-payment/:invId', deactivateInvoice);

export default router;
