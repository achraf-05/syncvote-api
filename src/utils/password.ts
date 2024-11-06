import * as bcrypt from 'bcrypt';

export const encryptPassword = (pwd: string): string => {
  return bcrypt.hashSync(pwd, 10);
};

export const comparePasswords = (pwd: string, encryptPassword: string): boolean => {
  return bcrypt.compareSync(pwd, encryptPassword);
};
