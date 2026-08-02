import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../index';
import { TargetCompletion } from './targetCompletion';

export class Target extends Model {
  declare id: number;
  declare userId: string;
  declare title: string;
  declare startDate: string;
  declare endDate: string;
  declare weekdays: string[];
  declare notifyTime?: string;
  declare color?:string;
  declare TargetCompletion?: TargetCompletion[];
}

Target.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    title: { type: DataTypes.STRING, allowNull: false },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    weekdays: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },
    notifyTime: {
      type: DataTypes.TIME,
    },
    color: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    tableName: 'target',
    timestamps: true,
    underscored: true,
  },
);
