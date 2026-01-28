import { Router } from 'express';
import {
  createTarget,
  markDoneTarget,
  getTarget,
  deleteTarget,
} from '../controllers/target.controller';

const router = Router();

router.post('/target', createTarget);
router.post('/target/:id/done', markDoneTarget);
router.delete('/target/:id', deleteTarget);
router.get('/target', getTarget);

export default router;
