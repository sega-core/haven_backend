import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../index';

export class NotificationHistory extends Model {
  declare id: number;
  declare message: string;
  declare recipients: string;
  declare recipientCount: number;
  declare successCount: number;
  declare failCount: number;
  declare status: 'pending' | 'sent' | 'failed';
  declare error: string | null;
  declare createdAt: Date;
  declare updatedAt: Date;
}

NotificationHistory.init(
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    recipients: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    recipientCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'recipient_count',
    },
    successCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'success_count',
    },
    failCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'fail_count',
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'pending',
    },
    error: {
      type: DataTypes.TEXT,
      allowNull: true,
    }
  },
  {
    sequelize,
    tableName: 'notification_history',
    timestamps: true,
    underscored: true,
  }
);