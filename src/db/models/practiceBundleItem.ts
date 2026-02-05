import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../index';

export class PracticeBundleItem extends Model {
  declare id: number;
  declare bundleId: number;
  declare practiceId: number;
  declare position?: number;
}

PracticeBundleItem.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    bundleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    practiceId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    position: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'practice_bundle_item',
    timestamps: true,
    underscored: true,
  },
);


/* -- Заполнение таблицы practice тестовыми данными
INSERT INTO practice_bundle_item (bundle_id, practice_id ) VALUES
(
 1,
 1
); */