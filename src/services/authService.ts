import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/user';

const jwtSecret = 'secret-key';

export const AuthService = {
  generateToken: (user: User): string => {
    const payload = {
      username: user.username,
      email: user.email,
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
