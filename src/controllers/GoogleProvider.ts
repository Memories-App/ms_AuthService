// GoogleProvider.ts

import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { AuthService } from '../services/AuthService';
import { AuthServiceGoogle } from '../services/AuthServiceGoogle';

import User from '../models/user';

export const GoogleProvider = {
  verifyToken: async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { authorization }: any = req.headers;

    try {
      const decoded = AuthService.verifyToken(authorization);

      // Extract the email and id of user from the payload
      const { accessToken } = decoded;

      // Request the user's profile from Google
      const profile = await AuthServiceGoogle.getGoogleProfile(accessToken);

      // Update the user in the database by email
      const user = await User.findOneAndUpdate(
        { email: profile.email },
        {
          last_login: new Date(),
          picture: profile.picture,
          name: {
            familyName: profile.name.familyName,
            givenName: profile.name.givenName
          }
        },
        { upsert: true, new: true }
      );

      // Respond with the user details
      return res.json({
        tokenValid: true,
        profile: {
          picture: user.picture,
          name: user.name,
          email: user.email
        }
      });
    } catch (error) {
      return res.status(401).json({ error: 'Invalid token' });
    }
  },

  signOut: async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    try {
      // unpack the authorization header
      const { authorization }: any = req.headers;
      const decoded = AuthService.verifyToken(authorization);

      // Extract the accessToken from the payload
      const { accessToken } = decoded;

      const response = await AuthServiceGoogle.devalidateGoogleAccessToken(accessToken);
      return res.json(response?.request);
    } catch (error) {
      return res.status(401).json({ error: 'Invalid token' });
    }
  },
};