import express from 'express';
import cors from 'cors'
import gratitudeRoute from './routes/gratitude.routes';
import moodRoute from './routes/mood.routes';
import dailyQuestionRoute from './routes/dailyQuestion.routes';
import targetRoute from './routes/target.routes';
import progressRoute from './routes/progress.routes';
import { NotFoundError } from './utils/error.utils';
import { errorHandler } from './middlewares/error.middleware';

export const TEMP_USER_ID = 1;

const corsOptions = {
  origin: true, //included origin as true
  credentials: true, //included credentials as true
};

const app = express();

app.use(cors(corsOptions));
app.use(express.json());

const routes = [
  gratitudeRoute,
  moodRoute,
  dailyQuestionRoute,
  targetRoute,
  progressRoute
];


routes.forEach((router) => {
  app.use("/api", router);
});


app.use('*', (_req, _res, next) => {
  next(new NotFoundError('Маршрут'));
});

app.use(errorHandler);

export default app;