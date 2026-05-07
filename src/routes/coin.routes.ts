import { Router } from 'express';
import { claimDailyCoin, getCoinBalance } from '../controllers/coin.controller';

const router = Router();

router.post('/coin', claimDailyCoin);
router.get('/coin', getCoinBalance);

export default router;
