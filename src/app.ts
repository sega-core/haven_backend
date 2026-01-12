import express from 'express';
import gratitudeRoute from './routes/gratitude.routes';
import nastroenieRoute from './routes/nastroenie.routes';
import { NotFoundError } from './utils/error.utils';
import { errorHandler } from './middlewares/error.middleware';

const app = express();

app.use(express.json());

const routes = [
  gratitudeRoute,
  nastroenieRoute
];


routes.forEach((router) => {
  app.use("/api", router);
});


app.use('*', (_req, _res, next) => {
  next(new NotFoundError('Маршрут'));
});

app.use(errorHandler);

export default app;