import { getDaylyQuestionService } from './dailyQuestion.service';
import { getMoodService } from './mood.service';
import { getGratitudeService } from './gratitude.service';

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
      isDone: !!mood?.level && !!mood?.tags.length && !!mood?.comment,
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
