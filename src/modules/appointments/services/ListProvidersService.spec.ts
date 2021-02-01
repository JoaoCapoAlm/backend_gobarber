// import AppError from '@shared/errors/AppError';

import FakeUsersRepoistory from '@modules/users/repositories/fakes/FakeUsersRepository';
import ListProviderService from './ListProvidersService';

let fakeUsersRepository: FakeUsersRepoistory;
let listProvider: ListProviderService;

describe('UpdateUserAvatar', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepoistory();

    listProvider = new ListProviderService(fakeUsersRepository);
  });

  it('should be able to list the providers', async () => {
    const user1 = await fakeUsersRepository.create({
      name: 'João',
      email: 'joao@profile.com',
      password: '123456',
    });

    const user2 = await fakeUsersRepository.create({
      name: 'Pedro',
      email: 'joao@profile.com',
      password: '123456',
    });

    const loggedUser = await fakeUsersRepository.create({
      name: 'Gui',
      email: 'gui@provider.com',
      password: '123456',
    });

    const providers = await listProvider.execute({ user_id: loggedUser.id });

    expect(providers).toEqual([user1, user2]);
  });
});
