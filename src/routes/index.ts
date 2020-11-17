import { Router } from 'express';
import appointementsRouter from './appointments.routes';

const routes = Router();

routes.use('/appointments', appointementsRouter);

export default routes;
