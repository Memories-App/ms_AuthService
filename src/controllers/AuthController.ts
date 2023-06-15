// AuthController.ts

import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { AuthService } from '../services/AuthService';
import { GoogleProvider } from './GoogleProvider';

export const AuthController = {
  exchangeAuthorizationTokenForJWT: async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { authorization, provider }: any = req.headers;

    try {
      // Generate JWT token 
      const token = AuthService.generateToken({ accessToken: authorization, provider: provider });

      // Send the email along with the token in the response
      return res.json({ token });

    } catch (error) {
      return res.status(401).json({ error: 'Invalid token' });
    }
  },

  verifyToken: async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { authorization }: any = req.headers;

    try {
      // Decode the token
      const { accessToken, provider } = AuthService.verifyToken(authorization);

      if (provider.toUpperCase() == 'GOOGLE') {
        // Verify the token with Google
        const user = await GoogleProvider.verifyToken(accessToken);

        // If the token is invalid, return an error
        if(user.code) throw new Error(user.errors || 'Invalid token');

        // If the token is valid, return the user details
        return res.status(200).json({
          tokenValid: true,
          profile: {
            picture: user.profile.picture,
            name: user.profile.name,
            email: user.profile.email
          }
        });

        

      } else if (provider.toUpperCase() == 'APPLE') {
        // Verify the token with Apple
      } else {
        return res.status(401).json({ error: 'Invalid provider' });
      }

    } catch (error) {
      return res.status(401).json({ error: 'Invalid token' });
    }
  }
};
