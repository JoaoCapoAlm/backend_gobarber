import AppError from '@shared/errors/AppError';

import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvidet';
import FakeUsersRepoistory from '../repositories/fakes/FakeUsersRepository';
import UpdateProfileService from './UpdateProfileService';

let fakeUsersRepository: FakeUsersRepoistory;
let fakeHashProvider: FakeHashProvider;
let updateProfile: UpdateProfileService;

describe('UpdateUserAvatar', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepoistory();
    fakeHashProvider = new FakeHashProvider();

    updateProfile = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to update the profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'João',
      email: 'joao@profile.com',
      password: '123456',
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'João Pedro',
      email: 'joao@profile.com.br',
    });

    expect(updatedUser.name).toBe('João Pedro');
    expect(updatedUser.email).toBe('joao@profile.com.br');
  });

  it('shoukd not be able to update the profile from non-existing user', async () => {
    await expect(
      updateProfile.execute({
        user_id: 'non-existing-user',
        name: 'Non Existing',
        email: 'nonExisting@profile.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to change to another user email ', async () => {
    await fakeUsersRepository.create({
      name: 'Carlos',
      email: 'carlos@profile.com',
      password: '123456',
    });

    const user = await fakeUsersRepository.create({
      name: 'João',
      email: 'joao@profile.com',
      password: '123456',
    });

    await updateProfile.execute({
      user_id: user.id,
      name: 'João Pedro',
      email: 'joao@profile.com.br',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'João',
        email: 'carlos@profile.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update the password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'João',
      email: 'joao@profile.com',
      password: '123456',
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'João Pedro',
      email: 'joao@profile.com.br',
      old_password: '123456',
      password: '123123',
    });

    expect(updatedUser.password).toBe('123123');
  });

  it('should not be able to update the password without old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'João',
      email: 'joao@profile.com',
      password: '123456',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'João Pedro',
        email: 'joao@profile.com.br',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the password with wrong old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'João',
      email: 'joao@profile.com',
      password: '123456',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'João Pedro',
        email: 'joao@profile.com.br',
        password: '123123',
        old_password: 'wrong-old-password',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
