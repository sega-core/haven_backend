import { Router } from 'express';
import {
  createMetaCardAnswer,
  getMetaCard,
} from '../controllers/metaCard.controller';

const router = Router();

router.get('/metacard', getMetaCard);
router.post('/metacard', createMetaCardAnswer);

export default router;
