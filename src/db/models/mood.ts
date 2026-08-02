import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../index';

export class Mood extends Model {
  declare id: number;
  declare userId: string;
  declare level: number;
  declare tags?: string[];
  declare comment?: string;
}

Mood.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    level: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 1, max: 5 },
    },
    tags: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      defaultValue: [],
    },
    comment: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'mood',
    timestamps: true,
    underscored: true,
  },
);
