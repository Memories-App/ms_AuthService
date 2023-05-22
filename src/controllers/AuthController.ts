import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { AuthService } from '../services/authService';

// import the schema from /models/User.ts
import User from '../models/user';

export const AuthController = {
  authenticateWithGoogle: passport.authenticate('google', {
    scope: ['profile', 'email'],
  }),

  // This callback function will be called once Google OAuth2 authentication is successful
  verifyGoogleProfile: async (accessToken: string, refreshToken: string, profile: any, done: Function) => {

    try {
      // Extract the email and id of user from the payload
      const { email, id } = profile._json;

      // Create or update the user in the database by email
      const user = await User.findOneAndUpdate(
        { email },
        { email, last_login: new Date(), strategy: 'google' },
        { upsert: true, new: true }
      );    
      
      // Return user details
      return done(null, { email, id });
    } catch (error) {
      return done(error, null)
    }
  },

  handleGoogleCallback: (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('google', { session: false }, (err, user, info) => {
      if (err || !user) {
        console.error(err)
        return res.status(401).json({ error: 'Google authentication failed', message: err.message });
      }

      // Generate JWT token or perform additional logic
      const token = AuthService.generateToken(user);

      // Send the email along with the token in the response
      const { email } = user;
      return res.json({ email, token });
    })(req, res, next); // Pass the 'next' function as an argument to the authentication callback
  },

  // Placeholder for future Apple login integration
  authenticateWithApple: (req: Request, res: Response) => {
    // Implement Apple authentication logic here
    res.status(501).json({ error: 'Apple authentication not implemented' });
  },
};
