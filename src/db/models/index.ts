import { sequelize } from '../index';
import { setupAssociations } from './associations';

export { User } from './user';
export { Mood } from './mood';
export { Gratitude } from './gratitude';
export { DailyQuestion } from './dailyQuestion';
export { UserDailyQuestion } from './userDailyQuestion';
export { Target } from './target';
export { TargetCompletion } from './targetCompletion';
export { CoinBalance } from './coinBalance';
export { CoinTransaction } from './coinTransaction';
export { Practice } from './practice';
export { PracticeBundle } from './practiceBundle';
export { PracticeBundleItem } from './practiceBundleItem';
export { MetaCard } from './metaCard';
export { UserMetaCardAnswer } from './userMetaCardAnswer';
export { OrderRub } from './orderRub';
export { OrderZen } from './orderZen';
export { AdminUser } from './adminUser';
export { NotificationHistory } from './notoficationHistory';

setupAssociations();

export const initDb = async () => {
  await sequelize.authenticate();
};
