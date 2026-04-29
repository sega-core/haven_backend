import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../index';
import { Purchase } from './purchase';
export class Practice extends Model {
  declare id: number;
  declare title: string;
  declare subTitle: string;
  declare description: string;
  declare instructions: string;
  declare tags: string[];
  declare priceZen: number;
  declare isActive: boolean;
  declare purchases?: Purchase[];
  declare sequence?: number;
}

Practice.init(
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
    subTitle: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    instructions: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    tags: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      defaultValue: [],
    },
    priceZen: {
      type: DataTypes.INTEGER(),
      allowNull: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    sequence: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'practice',
    timestamps: true,
    underscored: true,
  },
);

/* -- Заполнение таблицы practice тестовыми данными
INSERT INTO practice (title, sub_title, description, tags, price_zen) VALUES
(
  'Утренняя медитация',
  'Начните день с осознанности',
  'Сядьте в удобную позу. Закройте глаза. Сосредоточьтесь на дыхании. На вдохе считайте 1-2-3-4, на выдохе 1-2-3-4. Продолжайте 10 минут.',
  ARRAY['медитация', 'утро', 'осознанность', 'бесплатно'],
  100
),
(
  'Дыхание 4-7-8',
  'Техника для успокоения нервной системы',
  'Сядьте прямо. Приложите кончик языка к небу. Выдохните через рот. Закройте рот и вдохните через нос на 4 счета. Задержите дыхание на 7 счетов. Выдохните через рот на 8 счетов. Повторите 4 раза.',
  ARRAY['дыхание', 'релаксация', 'стресс', 'бесплатно'],
  50
),
(
  'Сканирование тела1',
  'Техника для расслабления и осознания тела',
  'Лягте на спину. Закройте глаза. Начните с кончиков пальцев ног. Постепенно перемещайте внимание вверх по телу, замечая ощущения в каждой части. Дойдите до макушки головы.',
  ARRAY['медитация', 'тело', 'релаксация', 'бесплатно'],
  30
); */
