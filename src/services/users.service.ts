import { format, subDays } from 'date-fns';
import { User, CoinBalance, CoinTransaction, AdminUser } from '../db/models';
import { NotFoundError, ValidationError } from '../utils/error.utils';

type TCreateProps = {
  platform: string;
  username: string;
  platformId: number;
};

export const getUserService = async ({
  platformId,
  id,
}: {
  platformId?: number;
  id?: string;
}) => {
  if (!platformId && !id) {
    throw new ValidationError('Необходимо указать platformId или id');
  }

  const user = await User.findOne({
    where: platformId ? { platformId } : { id },
    include: [
      {
        model: AdminUser,
        as: 'admin',
        required: false,
      },
    ],
  });

  if (!user) return null;

  const userData = user.toJSON();
  const adminData = userData.admin;
  const isAdmin = adminData && adminData.isActive;

  return {
    ...userData,
    isAdmin: !!isAdmin,
    admin: undefined,
  };
};
export const createUserService = async (props: TCreateProps) => {
  try {
    const findUser = await getUserService({ platformId: props.platformId });

    if (findUser) {
      return findUser;
    }

    const user = await User.create(props);

    const { id: userId } = user;

    const coinBalance = await CoinBalance.create({
      userId,
      balance: 0,
      dailyStreak: 0,
      lastBonusAt: format(subDays(new Date(), 1), 'yyyy-MM-dd'),
    });

    await CoinTransaction.create({
      balanceId: coinBalance.id,
      amount: 5,
      type: 'ACCRUE',
      meta: JSON.stringify({ registration: 5 }),
    });

    return user;
  } catch (error) {
    throw new ValidationError('createUserService error');
  }
};

//TODO: проверить все ошибки, сделать как тут

export const deleteUserService = async (userId: number) => {
  try {
    const findUser = await User.findOne({
      where: {
        id: userId,
      },
    });

    if (!findUser) {
      throw new NotFoundError('Пользователь');
    }

    return findUser.destroy();
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    }
    throw new ValidationError(JSON.stringify(error));
  }
};

export const updateUserService = async (
  userId: number,
  updateData: {
    onboardingCompleted?: boolean;
  },
) => {
  try {
    const findUser = await User.findOne({
      where: {
        id: userId,
      },
    });

    if (!findUser) {
      throw new NotFoundError('Пользователь');
    }

    await findUser.update(updateData);

    return {};
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    }
    throw new ValidationError(JSON.stringify(error));
  }
};
