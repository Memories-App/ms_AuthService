import jwt from 'jsonwebtoken';
import { User } from '../models/user';

const jwtSecret = 'secret-key';

export const AuthService = {
  generateToken: (user: User): string => {
    const payload = {
      username: user.name,
      email: user.email,
      accessToken: user.accessToken
      // Include additional user data in the payload if needed
    };

    const token = jwt.sign(payload, jwtSecret, { expiresIn: '180d' });
    return token;
  },

  verifyToken: (token: string): any => {
    const decoded = jwt.verify(token, jwtSecret);
    return decoded;
  }
};
