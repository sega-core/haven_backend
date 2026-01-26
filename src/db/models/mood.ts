import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../index';

export class Mood extends Model {
  declare id: number;
  declare userId: number;
  declare level: number;
  declare tags: string[];
  declare comment: string;
}

Mood.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    level: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 1, max: 5 },
    },
    tags: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      defaultValue: [],
    },
    comment: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'mood',
    timestamps: true,
    underscored: true,
  },
);
