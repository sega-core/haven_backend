import express from 'express';
import cors from 'cors';
import gratitudeRoute from './routes/gratitude.routes';
import moodRoute from './routes/mood.routes';
import dailyQuestionRoute from './routes/dailyQuestion.routes';
import targetRoute from './routes/target.routes';
import progressRoute from './routes/progress.routes';
import coinRoute from './routes/coin.routes';
import practiceRoute from './routes/practice.routes';
import practiceBundleRoute from './routes/practiceBundle.routes';
import authRoute from './routes/auth.routes';
import registrationRoute from './routes/registration.routes';
import { NotFoundError } from './utils/error.utils';
import { errorHandler } from './middlewares/error.middleware';
import { jwtAuthMiddleware } from './middlewares/jwt.middleware';

const corsOptions = {
  origin: true,
  credentials: true,
};

const app = express();

app.use(cors(corsOptions));
app.use(express.json());

const protectedRoutes = [
  gratitudeRoute,
  moodRoute,
  dailyQuestionRoute,
  targetRoute,
  progressRoute,
  coinRoute,
  practiceRoute,
  practiceBundleRoute,
];

app.use('/api', authRoute);
app.use('/api', registrationRoute);

protectedRoutes.forEach((router) => {
  app.use('/api', jwtAuthMiddleware, router);
});

app.use('*', (_req, _res, next) => {
  next(new NotFoundError('Маршрут'));
});

app.use(errorHandler);

export default app;
