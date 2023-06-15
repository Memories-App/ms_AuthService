import jwt from 'jsonwebtoken';
import { User } from '../models/user';

const jwtSecret = 'secret-key';

export const AuthService = {
  generateToken: (user: User | any): string => {
    const payload = {
      accessToken: user.accessToken,
      provider: user.provider
    };

    const token = jwt.sign(payload, jwtSecret, { expiresIn: '90d' });
    return token;
  },
  
  verifyToken: (token: string): any => {
    const decoded = jwt.verify(decodeURI(token), jwtSecret);
    return decoded;
  },
};
