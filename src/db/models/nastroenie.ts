import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../index';

export class Nastroenie extends Model {
  declare id: number;
  declare userId: number;
  declare level: number;
  declare tag: string;
  declare comment:string
}

Nastroenie.init(
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
    tag: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    comment: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'blagodarnost',
    timestamps: true,
    underscored: true,
  }
);
