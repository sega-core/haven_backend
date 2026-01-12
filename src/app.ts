import express from 'express';
import blagodarnostRoute from './routes/blagodarnost.routes';
import { NotFoundError } from './utils/error.utils';
import { errorHandler } from './middlewares/error.middleware';

const app = express();

app.use(express.json());

const routes = [
  blagodarnostRoute,
];


routes.forEach((router) => {
  app.use("/api", router);
});


app.use('*', (_req, _res, next) => {
  next(new NotFoundError('Маршрут'));
});

app.use(errorHandler);

export default app;