import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../index';

export class TargetCompletion extends Model {
  declare id: number;
  declare targetId: number;
  declare date: string;
  declare completed: boolean;
}

TargetCompletion.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    targetId: { type: DataTypes.INTEGER, allowNull: false },
    date: { type: DataTypes.DATEONLY, allowNull: false },
    completed: { type: DataTypes.BOOLEAN, defaultValue: true },
  },
  {
    sequelize,
    tableName: 'target_completion',
    timestamps: true,
    underscored: true,
  },
);
