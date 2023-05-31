// AuthController.ts

import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { AuthService } from '../services/AuthService';

export const AuthController = {
  exchangeAuthorizationTokenForJWT: async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { authorization }: any = req.headers;

    try {
      // Generate JWT token 
      const token = AuthService.generateToken({ accessToken: authorization });

      // Send the email along with the token in the response
      return res.json({ token });

    } catch (error) {
      return res.status(401).json({ error: 'Invalid token' });
    }
  }
};
