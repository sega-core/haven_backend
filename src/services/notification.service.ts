import { Op } from 'sequelize';
import { AdminUser, NotificationHistory, User } from '../db/models';
import { sendTelegramMessage } from './telegram.sendMessage.service';

interface SendNotificationDto {
  message: string;
  recipients: 'all' | 'active' | 'inactive' | 'test';
}

const getUsersByRecipients = async (recipients: string): Promise<User[]> => {
  const where: any = {};

  switch (recipients) {
    case 'active': {
      //TODO: lastSeen 
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      where.updatedAt = { [Op.gte]: today };
      break;
    }
    case 'inactive': {
      //TODO: lastSeen 
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      where.updatedAt = { [Op.lt]: weekAgo };
      break;
    }
    case 'test': {
      const adminUsers = await AdminUser.findAll({
        where: { isActive: true },
        attributes: ['userId'],
      });
      const adminUserIds = adminUsers.map((a) => a.userId);
      where.id = { [Op.in]: adminUserIds };
      break;
    }
    case 'all':
    default:
      break;
  }

  return User.findAll({ where });
};

export const sendNotification = async (
  dto: SendNotificationDto,
) => {
  const users = await getUsersByRecipients(dto.recipients);

  if (users.length === 0) {
    return {
      success: false,
      error: 'Нет пользователей для отправки',
    };
  }

  const history = await NotificationHistory.create({
    message: dto.message,
    recipients: dto.recipients,
    recipientCount: users.length,
    status: 'pending',
  });

  let successCount = 0;
  let failCount = 0;
  const errors = [];

  for (const user of users) {
    try {
      const result = await sendTelegramMessage(user.platformId, dto.message);
      
      if (result.success) {
        successCount++;
      } else {
        failCount++;
        errors.push({ userId: user.id, error: result.error });
      }
    } catch (error: any) {
      failCount++;
      errors.push({ userId: user.id, error: error.message });
    }

    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  await history.update({
    successCount,
    failCount,
    status: failCount === 0 ? 'sent' : failCount === users.length ? 'failed' : 'pending',
    error: errors.length > 0 ? JSON.stringify(errors.slice(0, 10)) : null,
  });

  return {
    success: true,
    stats: {
      total: users.length,
      success: successCount,
      fail: failCount,
    },
    historyId: history.id,
  };
};

export const getNotificationHistory = async () => {
  const { rows } = await NotificationHistory.findAndCountAll({
    order: [['createdAt', 'DESC']],
  });

  return rows
};