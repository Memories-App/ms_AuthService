import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { AuthService } from '../services/authService';

// import the schema from /models/User.ts
import User from '../models/user';

export const AuthController = {
  exchangeAuthorizationTokenForJWT: async (req: Request, res: Response) => {
    const { authorization }: any = req.headers;
    
    try {
      // Generate JWT token 
      const token = AuthService.generateToken({accessToken: authorization});

      // Send the email along with the token in the response
      return res.json({ token });

    } catch (error) {
      return res.status(401).json({ error: 'Invalid token' });
    }
  }
};
