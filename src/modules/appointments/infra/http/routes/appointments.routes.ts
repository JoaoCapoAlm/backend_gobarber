import { Router } from 'express';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import AppointmentsController from '../controllers/AppointmentsController';
import ProviderAppointmentsControler from '../controllers/ProviderAppointmentsControler';

const appointmentsRouter = Router();
const appointmentsController = new AppointmentsController();
const providerAppointmentsControler = new ProviderAppointmentsControler();

appointmentsRouter.use(ensureAuthenticated);

appointmentsRouter.post('/', appointmentsController.create);
appointmentsRouter.get('/me', providerAppointmentsControler.index);

export default appointmentsRouter;
