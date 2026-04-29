import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../index';
import { UserMetaCardAnswer } from './userMetaCardAnswer';

export class MetaCard extends Model {
  declare id: number;
  declare title: string;
  declare description: string;
  declare imgUrl: string;
  declare UserMetaCardAnswer: UserMetaCardAnswer[];
}

MetaCard.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    imgUrl: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'meta_card',
    timestamps: true,
    underscored: true,
  },
);