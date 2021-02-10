import AppError from '@shared/errors/AppError';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvidet';
import FakeUsersRepoistory from '../repositories/fakes/FakeUsersRepository';
import AuthenticateUserService from './AuthenticateUserService';

let fakeUsersRepository: FakeUsersRepoistory;
let fakeHashProvider: FakeHashProvider;
let authenticateUser: AuthenticateUserService;

describe('AuthenticateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepoistory();
    fakeHashProvider = new FakeHashProvider();

    authenticateUser = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });
  it('shoud be able to authenticate', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    const response = await authenticateUser.execute({
      email: 'johndoe@example.com',
      password: '123456',
    });

    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(user);
  });

  it('should not be able to authenticate with non existing user', async () => {
    await expect(
      authenticateUser.execute({
        email: 'test@autenticacao.com',
        password: '1234',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate with an incorrect password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'test@password.com',
      password: '123456',
    });

    await expect(
      authenticateUser.execute({
        email: user.email,
        password: '1234',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate user thtat is missing email or password', async () => {
    await expect(
      authenticateUser.execute({
        email: 'test@autenticacao.com',
        password: '',
      }),
    ).rejects.toBeInstanceOf(AppError);

    await expect(
      authenticateUser.execute({
        email: '',
        password: '1234',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
