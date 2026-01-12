export type TMoodTag = {
  label: string;
  level: number;
};

export type TMoodTagsMap = {
  [key: string]: TMoodTag;
};

export const MOOD_TAGS_MAP: TMoodTagsMap = {
  // 😭 Очень плохо — level 1
  despair: { label: 'Безысходность', level: 1 },
  hopelessness: { label: 'Отчаяние', level: 1 },
  emptiness: { label: 'Опустошение', level: 1 },
  brokenness: { label: 'Разбитость', level: 1 },
  loneliness: { label: 'Одиночество', level: 1 },
  rejection: { label: 'Отвергнутость', level: 1 },
  oppression: { label: 'Угнетённость', level: 1 },
  anguish: { label: 'Тоска', level: 1 },
  crushed: { label: 'Сломленность', level: 1 },
  pessimism: { label: 'Пессимизм', level: 1 },
  worthlessness: { label: 'Никчёмность', level: 1 },
  lost: { label: 'Потерянность', level: 1 },
  shame: { label: 'Стыд', level: 1 },

  // 😢 Плохо — level 2
  sadness: { label: 'Грусть', level: 2 },
  helplessness: { label: 'Беспомощность', level: 2 },
  indifference: { label: 'Безразличие', level: 2 },
  apathy: { label: 'Апатия', level: 2 },
  melancholy: { label: 'Меланхолия', level: 2 },
  gloom: { label: 'Мрачность', level: 2 },
  upset: { label: 'Расстроенность', level: 2 },
  boredom: { label: 'Скука', level: 2 },
  exhaustion: { label: 'Истощённость', level: 2 },
  irritation: { label: 'Раздражение', level: 2 },
  confusion: { label: 'Растерянность', level: 2 },
  doubt: { label: 'Сомнения', level: 2 },
  anxiety: { label: 'Тревога', level: 2 },

  // 🙂 Нормально — level 3
  neutrality: { label: 'Нейтральность', level: 3 },
  calmness: { label: 'Спокойствие', level: 3 },
  confidence: { label: 'Уверенность', level: 3 },
  satisfaction: { label: 'Удовлетворение', level: 3 },
  peacefulness: { label: 'Миролюбивость', level: 3 },
  spontaneity: { label: 'Непосредственность', level: 3 },
  relief: { label: 'Облегчение', level: 3 },
  serenity: { label: 'Покой', level: 3 },
  interest: { label: 'Интерес', level: 3 },
  balance: { label: 'Уравновешенность', level: 3 },
  focus: { label: 'Сосредоточенность', level: 3 },
  attentiveness: { label: 'Внимательность', level: 3 },
  stability: { label: 'Стабильность', level: 3 },

  // 😊 Хорошо — level 4
  joy: { label: 'Радость', level: 4 },
  pleasure: { label: 'Удовольствие', level: 4 },
  delight: { label: 'Восторг', level: 4 },
  excitement: { label: 'Взбудораженность', level: 4 },
  love: { label: 'Любовь', level: 4 },
  tenderness: { label: 'Нежность', level: 4 },
  liveliness: { label: 'Оживление', level: 4 },
  activity: { label: 'Активность', level: 4 },
  motivation: { label: 'Мотивация', level: 4 },
  energy: { label: 'Энергичность', level: 4 },
  curiosity: { label: 'Любопытство', level: 4 },
  gratitude: { label: 'Благодарность', level: 4 },
  hope: { label: 'Надежда', level: 4 },

  // 🥰 Отлично — level 5
  euphoria: { label: 'Эйфория', level: 5 },
  ecstasy: { label: 'Экстаз', level: 5 },
  bliss: { label: 'Блаженство', level: 5 },
  rapture: { label: 'Упоение', level: 5 },
  harmony: { label: 'Гармония', level: 5 },
  inspiration: { label: 'Вдохновение', level: 5 },
  sensationalPleasure: { label: 'Сенсационное удовольствие', level: 5 },
  enthusiasm: { label: 'Энтузиазм', level: 5 },
  infatuation: { label: 'Влюблённость', level: 5 },
  determination: { label: 'Целеустремлённость', level: 5 },
  lightness: { label: 'Лёгкость', level: 5 },
  success: { label: 'Успех', level: 5 },
  carefreeness: { label: 'Беззаботность', level: 5 },
};