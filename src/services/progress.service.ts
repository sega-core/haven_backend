import { getDaylyQuestionRangeService, getDaylyQuestionService } from './dailyQuestion.service';
import { getMoodRangeService, getMoodService } from './mood.service';
import {
  getGratitudeRangeService,
  getGratitudeService,
} from './gratitude.service';

export const getProgressService = async (userId: number) => {
  const [mood, gratitude, dailyQuestion] = await Promise.all([
    getMoodService(userId),
    getGratitudeService(userId),
    getDaylyQuestionService(userId),
  ]);

  const isMoodDone = !!mood?.level && !!mood?.tags?.length && !!mood?.comment;
  const isGratitudeDone = !!gratitude.length;
  const isDailyQuestionDone = dailyQuestion?.hasAnswered;

  const isAllDone = isMoodDone && isGratitudeDone && isDailyQuestionDone;

  const progressPoint = Math.round(
    [isMoodDone, isGratitudeDone, isDailyQuestionDone].filter(Boolean).length,
  );

  return {
    mood: {
      isDone: !!mood?.level,
      level: mood?.level,
      tags: mood?.tags,
      text: mood?.comment,
    },
    gratitude: { isDone: !!gratitude.length, listOfGratitude: gratitude },
    dailyQuestion: {
      isDone: dailyQuestion.hasAnswered,
      ...dailyQuestion,
    },
    isAllDone,
    progressPoint,
  };
};

export const getProgressRangeService = async (
  userId: number,
  startDate: string,
  endDate: string,
) => {
  const [mood, gratitude, dailyQuestion] = await Promise.all([
    getMoodRangeService(userId, startDate, endDate),
    getGratitudeRangeService(userId, startDate, endDate),
    getDaylyQuestionRangeService(userId,startDate, endDate),
  ]);

  return {
    mood,
    gratitude,
    dailyQuestion
  };
};
