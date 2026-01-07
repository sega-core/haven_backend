import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../index';

export class Blagodarnost extends Model {
  declare id: number;
  declare userId: number;
  declare date: string;
  declare text: string;
}

Blagodarnost.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      field: 'user_id',
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    text: {
      type: DataTypes.STRING(1000),
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
