import { Router } from 'express';
import {
  deactivateInvoice,
  createPayment,
  getPaymentStatus,
} from '../controllers/payment.controller';

const router = Router();

router.post('/create-payment', createPayment);
router.get('/status-payment/:id', getPaymentStatus);
router.post('/deactivate-payment/:invId', deactivateInvoice);

export default router;
