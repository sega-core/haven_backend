import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../index';

export class PracticeBundle extends Model {
  declare id: number;
  declare title: string;
  declare description: string;
  declare priceRub: number;
  declare tags: string[];
  declare isActive: boolean;
  declare imgUrl?: string;
}

PracticeBundle.init(
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
    priceRub: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    tags: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      defaultValue: [],
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    imgUrl: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'practice_bundle',
    timestamps: true,
    underscored: true,
  },
);

/* -- Заполнение таблицы practice тестовыми данными
INSERT INTO practice_bundle (title, description, price_rub, tags) VALUES
(
  'Bundle two',
  'Thit is description two',
  800,
  ARRAY['goo', 'boo']
); */
