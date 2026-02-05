import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../index';

export class Purchase extends Model {
  declare id: number;
  declare userId: number;
  declare practiceId: number;
}

Purchase.init(
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
    practiceId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'purchase',
    timestamps: true,
    underscored: true,
  },
);

/* INSERT INTO purchase (user_id, practice_id) 
VALUES (1,1); */
