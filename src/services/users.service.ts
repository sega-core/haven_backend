import { format, subDays } from 'date-fns';
import { User, CoinBalance } from '../db/models';
import { NotFoundError, ValidationError } from '../utils/error.utils';

type TCreateProps = {
  platform: string;
  username: string;
  platformId: number;
};

export const getUserService = async ({
  platformId,
}: {
  platformId: number;
}) => {
  const user = await User.findOne({
    where: {
      platformId,
    },
  });

  return user;
};

export const createUserService = async (props: TCreateProps) => {
  try {
    const findUser = await getUserService({ platformId: props.platformId });

    if (findUser) {
      return findUser;
    }

    const user = await User.create(props);

    const { id: userId } = user;

    await CoinBalance.create({
      userId,
      balance: 0,
      dailyStreak: 0,
      lastBonusAt: format(subDays(new Date(), 1), 'yyyy-MM-dd'),
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
