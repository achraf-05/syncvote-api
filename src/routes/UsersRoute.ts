import { Router } from 'express';
import { UserController } from '../controllers';
import { validateCreateUser, validateLoginUser } from '../middlewares/dataValidator';
import authJwt from '../middlewares/authJwt';

export class UsersRoute {
  private userController: UserController;

  constructor(userController: UserController) {
    this.userController = userController;
  }

  createRouter(): Router {
    const router = Router();

    router.post('/users', validateCreateUser, this.userController.createUser.bind(this.userController));
    router.get('/users', authJwt.verifyToken, this.userController.getUsers.bind(this.userController));

    router.get('/users/:id', authJwt.verifyToken, this.userController.getUserById.bind(this.userController));

    router.post('/auth/login', validateLoginUser, this.userController.login.bind(this.userController));


    router.put('/users/:id',authJwt.verifyToken,  this.userController.updateUser);
    router.put('/users/me', validateLoginUser, this.userController.updateConnectedUser);
    router.delete('/users/:id',authJwt.verifyToken , this.userController.deleteUser);
    router.patch('/users/password', validateLoginUser, this.userController.changePassword);

    return router;
  }
}
