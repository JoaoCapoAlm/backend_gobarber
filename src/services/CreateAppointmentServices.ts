import { startOfHour } from 'date-fns';
import { getCustomRepository, getRepository } from 'typeorm';
import AppError from '../errors/AppError';
import Appointment from '../models/Appointment';
import User from '../models/User';
import AppointmentsRepository from '../repositories/AppointmentsRepository';

interface Request {
  provider_id: string;
  date: Date;
}

class CreateAppointmentService {
  public async execute({ date, provider_id }: Request): Promise<Appointment> {
    if (date === undefined || provider_id === undefined) {
      throw new AppError('date and provider_id is required!');
    }
    const appointmentsRepository = getCustomRepository(AppointmentsRepository);
    const userRepository = getRepository(User);
    const appointmentDate = startOfHour(date);

    const checkUserExists = await userRepository.findOne({
      where: { id: provider_id },
    });

    if (!checkUserExists) {
      throw new AppError('User not found!');
    }

    const findAppointmentInSameDate = await appointmentsRepository.findByDate(
      appointmentDate,
    );
    if (findAppointmentInSameDate) {
      throw new AppError('This appointment is already booked');
    }

    const appointment = appointmentsRepository.create({
      provider_id,
      date: appointmentDate,
    });

    await appointmentsRepository.save(appointment);

    return appointment;
  }
}

export default CreateAppointmentService;
