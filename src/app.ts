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
import userRoute from './routes/users.routes';
import metaCardRoute from './routes/metaCard.routes';
import paymentRoute from './routes/payment.routes';
import paymentUnauthorizedRoute from './routes/payment-unauthorized.routes';
import { NotFoundError } from './utils/error.utils';
import { errorHandler } from './middlewares/error.middleware';
import { jwtAuthMiddleware } from './middlewares/jwt.middleware';

const corsOptions = {
  origin: true,
  credentials: true,
};

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.text());

app.use(express.urlencoded({ 
  extended: true,
  limit: '10mb'
}));

app.use(cors(corsOptions));

const protectedRoutes = [
  gratitudeRoute,
  moodRoute,
  dailyQuestionRoute,
  targetRoute,
  progressRoute,
  coinRoute,
  practiceRoute,
  practiceBundleRoute,
  userRoute,
  metaCardRoute,
  paymentRoute,
];

app.use('/api', authRoute);
app.use('/api', registrationRoute);
app.use('/api', paymentUnauthorizedRoute);

protectedRoutes.forEach((router) => {
  app.use('/api', jwtAuthMiddleware, router);
});

app.use('*', (_req, _res, next) => {
  next(new NotFoundError('Маршрут'));
});

app.use(errorHandler);

export default app;
