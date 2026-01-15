import { Router } from 'express';
import {
  createTarget,
  updateTarget,
  markDoneTarget,
  getTarget
} from '../controllers/target.controller';

const router = Router();

router.post('/target', createTarget);
router.put('/target/:id', updateTarget);
router.post('/target/:id/done', markDoneTarget);
router.get('/target', getTarget);

export default router;
