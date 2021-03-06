import { getRepository } from 'typeorm';
import { hash } from 'bcryptjs';
import User from '../models/User';
import AppError from '../errors/AppError';

interface Request {
  name: string;
  email: string;
  password: string;
}
interface Response {
  id: string;
  name: string;
  email: string;
}
class CreateUserService {
  public async execute({ name, email, password }: Request): Promise<Response> {
    const usersRepository = getRepository(User);
    const checkUserExists = await usersRepository.findOne({
      where: { email },
    });

    if (checkUserExists) {
      throw new AppError('Email already exists.');
    }

    const hashedPassword = await hash(password, 2);

    const user = usersRepository.create({
      name,
      email,
      password: hashedPassword,
    });
    await usersRepository.save(user);
    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }
}

export default CreateUserService;
