import { CoinBalance, CoinTransaction, Purchase } from '../db/models';
import { differenceInCalendarDays, format } from 'date-fns';
import { ValidationError } from '../utils/error.utils';
import { sequelize } from '../db';

const DAILY_BONUSES = [5, 5, 10, 15, 20, 25, 50];

export const getCoinBalanceService = async (userId: number) => {
  const coinBalance = await CoinBalance.findOne({
    where: { userId },
    attributes: ['id', 'dailyStreak', 'lastBonusAt'],
    include: [
      {
        model: CoinTransaction,
        as: 'coinTransactions',
        required: false,
        attributes: ['amount', 'type'],
      },
    ],
  });

  if (!coinBalance) {
    throw new ValidationError('CoinBalance not found');
  }

  const calculateBalance = (item: CoinBalance) => {
    const { coinTransactions, ...other } = item.toJSON();

    let balance = 0;

    coinTransactions.forEach((transaction: any) => {
      if (transaction.type === 'ACCRUE') {
        balance += transaction.amount;
      } else if (transaction.type === 'SPEND') {
        balance -= transaction.amount;
      }
    });

    return {
      ...other,
      balance,
    };
  };

  return calculateBalance(coinBalance) as CoinBalance;
};

export const createDailyBonusService = async (userId: number) => {
  /* await UserBalance.create({ userId, balance: 0 }); */ //TODO: вынести при создании пользователя

  return sequelize.transaction(async (tx) => {
    const coinBalance = await CoinBalance.findOne({
      where: { userId },
      transaction: tx,
      lock: tx.LOCK.UPDATE,
    });

    const today = format(new Date(), 'yyyy-MM-dd');

    if (!coinBalance) {
      throw new ValidationError('CoinBalance not found');
    }

    if (coinBalance.lastBonusAt === today) {
      throw new ValidationError('The coins have already been received today');
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
        type: 'ACCRUE',
        meta: JSON.stringify({ streak: streak + 1 }),
      },
      { transaction: tx },
    );

    await coinBalance.update(
      {
        dailyStreak: streak + 1,
        lastBonusAt: today,
      },
      { transaction: tx },
    );

    const { balance } = await getCoinBalanceService(userId);

    return {
      bonus,
      dailyStreak: streak + 1,
      balance,
    };
  });
};

export const spendCoinBalanceService = async (
  userId: number,
  amount: number,
  practiceId: number,
) => {
  const coinBalance = await getCoinBalanceService(userId);

  if (amount > coinBalance.balance) {
    throw new ValidationError(
      `Not enough coins. Need: ${amount}, Have: ${coinBalance.balance}`,
    );
  }

  await CoinTransaction.create({
    balanceId: coinBalance.id,
    amount,
    type: 'SPEND',
    meta: JSON.stringify({ practiceId }),
  });

  await Purchase.create({ userId, practiceId });

  return {};
};
