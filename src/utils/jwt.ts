import jwt from 'jsonwebtoken';

export const generateToken = (userId: string, userRole?: string): string => {
  return jwt.sign(
    {
      id: userId,
      role: userRole || 'member'
    },
    process.env.SECRET_KEY as string,
    {
      expiresIn: 86400
    }
  )
};
