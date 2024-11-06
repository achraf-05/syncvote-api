import { User } from '../types/entities/User';

export const formatUserData = (userData?: User): Partial<User> => {
  if(userData) {
    const _user = { ...userData };

    delete _user.password;
    delete _user.createdAt;
    delete _user.updatedAt;

    return _user;
  }

  return {};
};
