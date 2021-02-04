import { getRepository } from 'typeorm';
import path from 'path';
import fs from 'fs';
import User from '../models/User';
import uploadConfig from '../config/upload';
import AppError from '../errors/AppError';

interface Request {
  user_id: string;
  avatar_filename: string;
}
interface Response {
  id: string;
  name: string;
  email: string;
  avatar: string;
}
class UpdateUserAvatarService {
  public async execute({
    user_id,
    avatar_filename,
  }: Request): Promise<Response> {
    const usersRepository = getRepository(User);
    const user = await usersRepository.findOne(user_id);

    if (!user) {
      throw new AppError('User not exists.', 401);
    }

    if (user.avatar) {
      // delete avatar
      const userAvatarFilePath = path.join(uploadConfig.directory, user.avatar);
      const userAvatarFileExists = await fs.promises.stat(userAvatarFilePath);
      if (userAvatarFileExists) {
        await fs.promises.unlink(userAvatarFilePath);
      }
    }
    user.avatar = avatar_filename;
    await usersRepository.save(user);
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    };
  }
}

export default UpdateUserAvatarService;
