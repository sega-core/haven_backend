import express from 'express';
import gratitudeRoute from './routes/gratitude.routes';
import moodRoute from './routes/mood.routes';
import dailyQuestionRoute from './routes/dailyQuestion.routes';
import targetRoute from './routes/target.routes';
import { NotFoundError } from './utils/error.utils';
import { errorHandler } from './middlewares/error.middleware';

export const TEMP_USER_ID = 1;

const app = express();

app.use(express.json());

const routes = [
  gratitudeRoute,
  moodRoute,
  dailyQuestionRoute,
  targetRoute
];


routes.forEach((router) => {
  app.use("/api", router);
});


app.use('*', (_req, _res, next) => {
  next(new NotFoundError('Маршрут'));
});

app.use(errorHandler);

export default app;