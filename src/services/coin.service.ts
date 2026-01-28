import { CoinBalance, CoinTransaction } from '../db/models';
import { differenceInCalendarDays, format } from 'date-fns';
import { ValidationError } from '../utils/error.utils';
import { sequelize } from '../db';

const DAILY_BONUSES = [5, 5, 10, 15, 20, 25, 50];

export const claimDailyBonusService = async (userId: number) => {
  /* await UserBalance.create({ userId, balance: 0 }); */ //TODO: вынести при создании пользователя

  return sequelize.transaction(async (tx) => {
    const coinBalance = await CoinBalance.findOne({
      where: { userId },
      transaction: tx,
      lock: tx.LOCK.UPDATE,
    });

    const today = format(new Date(), 'yyyy-MM-dd');

    if (!coinBalance) {
      throw new ValidationError('coinBalance не найден');
    }

    if (coinBalance.lastBonusAt === today) {
      throw new ValidationError('Сегодня коины уже получены');
    }

    let streak = coinBalance.dailyStreak;

    if (coinBalance.lastBonusAt) {
      const daysDiff = differenceInCalendarDays(
        new Date(today),
        new Date(coinBalance.lastBonusAt),
      );

      if (daysDiff !== 1) {
        streak = 0;
      }
    }

    if (streak >= DAILY_BONUSES.length) {
      streak = 0;
    }

    const bonus = DAILY_BONUSES[streak];

    await CoinTransaction.create(
      {
        balanceId: coinBalance.id,
        amount: bonus,
        type: 'DAILY_BONUS',
        meta: JSON.stringify({ streak: streak + 1 }),
      },
      { transaction: tx },
    );

    await coinBalance.update(
      {
        dailyStreak: streak + 1,
        lastBonusAt: today,
        total: coinBalance.total + bonus,
      },
      { transaction: tx },
    );

    return {
      bonus,
      dailyStreak: streak + 1,
      totalCoins: coinBalance.total,
    };
  });
};

export const getCoinBalanceService = async (userId: number) => {
  const coinBalance = await CoinBalance.findOne({
    where: {
      userId,
    },
    order: [['createdAt', 'ASC']],
  });

  if (!coinBalance) {
    throw new ValidationError('coinBalance не найден');
  }

  return coinBalance;
};
