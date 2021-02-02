import { Router } from 'express';
import multer from 'multer';
import CreateUserService from '../services/CreateUserService';
import UpdateUserAvatarService from '../services/UpdateUserAvatarService';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';
import uploadConfig from '../config/upload';

const usersRouter = Router();
const upload = multer(uploadConfig);

usersRouter.post('/', async (request, response) => {
  try {
    const { name, email, password } = request.body;
    const createUserService = new CreateUserService();
    const user = await createUserService.execute({ name, email, password });
    return response.json(user);
  } catch (err) {
    return response.status(400).json(err.message);
  }
});

usersRouter.patch(
  '/avatar',
  ensureAuthenticated,
  upload.single('avatar'),
  async (request, response) => {
    try {
      const updateAvatarService = new UpdateUserAvatarService();
      const result = await updateAvatarService.execute({
        user_id: request.user.id,
        avatar_filename: request.file.filename,
      });
      return response.json(result);
    } catch (err) {
      return response.status(400).json(err.message);
    }
  },
);

export default usersRouter;
