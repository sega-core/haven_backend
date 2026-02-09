import { UserDailyQuestion } from './userDailyQuestion';
import { DailyQuestion } from './dailyQuestion';
import { CoinBalance } from './coinBalance';
import { CoinTransaction } from './coinTransaction';
import { Practice } from './practice';
import { PracticeBundle } from './practiceBundle';
import { Purchase } from './purchase';
import { Target } from './target';
import { TargetCompletion } from './targetCompletion';
import { PracticeBundleItem } from './practiceBundleItem';
import { PurchaseBundle } from './purchaseBundle';

export function setupAssociations() {
  //dailyQuestion
  UserDailyQuestion.belongsTo(DailyQuestion, {
    foreignKey: 'questionId',
    targetKey: 'id',
    as: 'DailyQuestion',
  });
  DailyQuestion.hasMany(UserDailyQuestion, {
    foreignKey: 'questionId',
    sourceKey: 'id',
    as: 'UserDailyQuestion',
  });

  //coin
  CoinBalance.hasMany(CoinTransaction, {
    foreignKey: 'balanceId',
    as: 'coinTransactions',
  });
  CoinTransaction.belongsTo(CoinBalance, {
    foreignKey: 'balanceId',
  });

  //target
  Target.hasMany(TargetCompletion, {
    foreignKey: 'targetId',
    sourceKey: 'id',
    as: 'TargetCompletion',
  });
  TargetCompletion.belongsTo(Target, {
    foreignKey: 'targetId',
    targetKey: 'id',
    as: 'Target',
  });

  //practice
  Practice.hasMany(Purchase, {
    foreignKey: 'practiceId',
    as: 'purchases',
  });
  Purchase.belongsTo(Practice, {
    foreignKey: 'practiceId',
  });

  //practiceBundle
  Practice.belongsToMany(PracticeBundle, {
    through: 'practice_bundle_item',
    foreignKey: 'practiceId',
    otherKey: 'bundleId',
  });
  PracticeBundle.belongsToMany(Practice, {
    through: 'practice_bundle_item',
    foreignKey: 'bundleId',
    otherKey: 'practiceId',
  });

  //practiceBundleItem
  PracticeBundle.hasMany(PracticeBundleItem, {
    foreignKey: 'bundleId',
    as: 'practiceBundleItems',
  });
  PracticeBundleItem.belongsTo(Practice, {
    foreignKey: 'practiceId',
    as: 'practice',
  });

  //practiceBundle - purchaseBundle
  PracticeBundle.hasMany(PurchaseBundle, {
    foreignKey: 'bundleId',
    as: 'purchaseBundles',
  });
  PurchaseBundle.belongsTo(PracticeBundle, {
    foreignKey: 'bundleId',
  });
}
