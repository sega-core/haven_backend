import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../index';

export class PurchaseBundle extends Model {
  declare id: number;
  declare userId: number;
  declare bundleId: number;
  declare priceRub: number;
}

PurchaseBundle.init(
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
    bundleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    priceRub: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'purchase_bundle',
    timestamps: true,
    underscored: true,
  },
);

/* INSERT INTO purchase_bundle (user_id, bundle_id) 
VALUES (1,1); */
