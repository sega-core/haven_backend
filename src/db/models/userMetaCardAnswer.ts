import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../index';

export class UserMetaCardAnswer extends Model {
  declare id: number;
  declare userId: number;
  declare metaCardId: number;
  declare seen: string;
  declare felt: string;
  declare understood: string;
  declare createdAt: string;
}

UserMetaCardAnswer.init(
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
    metaCardId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    seen: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    felt: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    understood: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'user_meta_card_answer',
    timestamps: true,
    underscored: true,
  },
);
