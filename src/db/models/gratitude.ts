import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../index';

export class Gratitude extends Model {
  declare id: number;
  declare userId: number;
  declare text: string;
}

Gratitude.init(
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
    text: {
      type: DataTypes.STRING(1000),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'gratitude',
    timestamps: true,
    underscored: true,
  }
);
