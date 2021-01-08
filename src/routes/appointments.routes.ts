import { response, Router } from 'express';
import { parseISO } from 'date-fns';
import AppointementsRepository from '../repositories/AppointmentsRepository';
import CreateAppointmentService from '../services/CreateAppointmentServices';

const appointementsRouter = Router();
const appointementsRepository = new AppointementsRepository();

appointementsRouter.get('/', (request, response) =>{
  const appointments = appointementsRepository.all();

  return response.json(appointments);
})

appointementsRouter.post('/', (request, response) => {
  try {
    const { provider, date } = request.body;

    const parsedDate = parseISO(date);
    const createAppointment = new CreateAppointmentService(appointementsRepository);

    const appointment = createAppointment.execute({ date: parsedDate, provider });

    return response.json(appointment);
  } catch (err) {
    return response.status(400).json({ error: err.message });
  }
})
export default appointementsRouter;
