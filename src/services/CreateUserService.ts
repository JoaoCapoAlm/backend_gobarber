import { hash } from 'bcryptjs';
import { getRepository } from 'typeorm';
import AppError from '../errors/AppError';
import User from '../models/User';

interface Request {
  name: string;
  email: string;
  password: string;
}

class CreateUserService {
  async execute({ name, email, password }: Request): Promise<User>{
    console.log(name);
    console.log(email);
    console.log(password);
    if (name === undefined || email === undefined || password === undefined){
      throw new AppError('Name, email and password is required!');
    }
    const userRepository = getRepository(User);

    const checkUserExists = await userRepository.findOne({
      where: { email },
    });

    if (checkUserExists){
      throw new AppError('Email address already used!');
    }

    const hashedPassword = await hash(password, 8);

    const user = userRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    await userRepository.save(user);

    return user
  }
}

export default CreateUserService;
