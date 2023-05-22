import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { AuthService } from '../services/authService';

export const AuthController = {
  authenticateWithGoogle: passport.authenticate('google', {
    scope: ['profile', 'email'],
  }),

  handleGoogleCallback: (req: Request, res: Response, next: any) => {
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
