import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/user';

const jwtSecret = 'secret-key';

export const AuthService = {
  generateToken: (user: User): string => {
    const payload = {
      id: user.id,
      email: user.email,
      // Include additional user data in the payload if needed
    };

    const token = jwt.sign(payload, jwtSecret, { expiresIn: '180d' });
    return token;
  },
};
