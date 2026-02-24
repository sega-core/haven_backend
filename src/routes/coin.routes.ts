import { Router } from 'express';
import { claimDailyCoin, getCoinBalance, spendCoinBalance } from '../controllers/coin.controller';

const router = Router();

router.post('/coin', claimDailyCoin);
router.get('/coin', getCoinBalance);
router.post('/coin-spend', spendCoinBalance);

export default router;
