import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/user';

const saltRounds = 10;
const jwtSecret = 'secret-key';

export const AuthService = {
  registerUser: async (username: string, email: string, password: string): Promise<User> => {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const user: User = {
      id: '1',
      username,
      email,
      password: hashedPassword,
    };

    // @Todo
    // Save user to database or perform necessary data storage operations


    return user;
  },

  loginUser: async (email: string, password: string): Promise<User | null> => {
    
    // @Todo
    // Retrieve user from database by email

    const user: User | undefined = undefined; // Replace with database query

    if (!user) {
      return null;
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return null;
    }

    return user;
  },

  generateToken: (user: User): string => {
    const payload = {
      id: user.id,
      email: user.email,
      // Include additional user data in the payload if needed
    };

    const token = jwt.sign(payload, jwtSecret, { expiresIn: '1d' });
    return token;
  },
};
