import { startOfHour } from 'date-fns';
import Appointment from '../models/Appointement';
import AppointementsRepository from '../repositories/AppointmentsRepository';

interface Request {
  provider: string;
  date: Date;
}

class CreateAppointmentService {
  private appointementsRepository: AppointementsRepository;
  constructor(appointementsRepository: AppointementsRepository) {
    this.appointementsRepository = appointementsRepository;
  }

  public execute({ date, provider }: Request): Appointment {
    const appointmentDate = startOfHour(date);

    const findAppointmentInSameDate = this.appointementsRepository.findByDate(appointmentDate);
    if (findAppointmentInSameDate) {
      throw Error('This appointment is already booked');
    }

    const appointment = this.appointementsRepository.create({
      provider,
      date: appointmentDate
    });

    return appointment;
  }
}

export default CreateAppointmentService;
