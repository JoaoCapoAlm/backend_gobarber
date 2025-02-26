import AppError from '@shared/errors/AppError';

import FakeNotificationsRepository from '@modules/notifications/repositories/fakes/FakeNotificationsRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentServices';

let fakeNotificationsRepository: FakeNotificationsRepository;
let fakeAppointmentsRepository: FakeAppointmentsRepository;
let fakeCacheProvider: FakeCacheProvider;
let createAppointment: CreateAppointmentService;

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeNotificationsRepository = new FakeNotificationsRepository();
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    fakeCacheProvider = new FakeCacheProvider();
    createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository,
      fakeNotificationsRepository,
      fakeCacheProvider,
    );
  });
  it('should be able to create a new appoinment', async () => {
    jest.spyOn(Date, 'now').mockImplementation(() => {
      return new Date(2021, 1, 10, 9).getTime();
    });

    const appointment = await createAppointment.execute({
      date: new Date(2021, 1, 10, 10),
      user_id: 'user',
      provider_id: '123',
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('123');
  });

  it('should not be able to create two appointments on the same time', async () => {
    jest.spyOn(Date, 'now').mockImplementation(() => {
      return new Date(2021, 1, 2, 9).getTime();
    });

    const appoinmentDate = new Date(2021, 1, 2, 11);

    await createAppointment.execute({
      date: appoinmentDate,
      user_id: 'user',
      provider_id: '123',
    });

    await expect(
      createAppointment.execute({
        date: appoinmentDate,
        user_id: 'user',
        provider_id: '123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create appointments on a past date', async () => {
    jest.spyOn(Date, 'now').mockImplementation(() => {
      return new Date(2021, 1, 2, 9).getTime();
    });

    await expect(
      createAppointment.execute({
        date: new Date(2020, 4, 10, 13),
        user_id: '123',
        provider_id: '456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create appointment with same user as provider', async () => {
    jest.spyOn(Date, 'now').mockImplementation(() => {
      return new Date(2021, 1, 2, 9).getTime();
    });

    await expect(
      createAppointment.execute({
        date: new Date(2021, 4, 10, 13),
        user_id: 'user_id',
        provider_id: 'user_id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create appointment outside the available hours', async () => {
    jest.spyOn(Date, 'now').mockImplementation(() => {
      return new Date(2021, 1, 2, 2).getTime();
    });

    await expect(
      createAppointment.execute({
        date: new Date(2021, 1, 2, 7),
        user_id: 'user',
        provider_id: 'provider',
      }),
    ).rejects.toBeInstanceOf(AppError);

    await expect(
      createAppointment.execute({
        date: new Date(2021, 1, 2, 18),
        user_id: 'user',
        provider_id: 'provider',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
