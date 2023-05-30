import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { AuthService } from '../services/authService';

// import the schema from /models/User.ts
import User from '../models/user';

export const AuthController = {
  authenticateWithGoogle: passport.authenticate('google', {
    scope: ['profile', 'email', 'openid'],
  }),

  verifyToken: async (req: Request, res: Response) => {
    const { authorization }: any = req.headers;

    try {
      const decoded = AuthService.verifyToken(authorization);

      // Extract the email and id of user from the payload
      const { accessToken } = decoded;
      
      
      // Request the user's profile from Google
      const profile = await AuthService.getGoogleProfile(accessToken);     
      

      // Update the user in the database by email
      const user = await User.findOneAndUpdate(
        { email: profile.email },
        { 
          last_login: new Date(), 
          picture: profile.picture,
          name: {
            familyName: profile.name.familyName,
            givenName: profile.name.givenName
          }},
        { upsert: true, new: true }
        );
        
        // Respond with the user details
        return res.json({
          tokenValid: true,
          profile: {
            name: user.name,
            email: user.email
          }
        });
      } catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
      }
    },

  exchangeAuthorizationTokenForJWT: async (req: Request, res: Response) => {
    const { authorization }: any = req.headers;
    
    try {
      // Verify the Authorization token
      const profile = await AuthService.getGoogleProfile(authorization);

      // Generate JWT token 
      const token = AuthService.generateToken({accessToken: authorization});

      // Send the email along with the token in the response
      return res.json({ token });

    } catch (error) {
      return res.status(401).json({ error: 'Invalid token' });
    }
  },


  verifyGoogleProfile: async (accessToken: string, refreshToken: string, profile: any, done: Function) => {
    try {
      // Create or update the user in the database by email
      const user = await User.findOneAndUpdate(
        { email: profile._json.email }, // Find user by email
        {
          googleId: profile.id,
          picture: profile.photos[0].value,
          name: {
            familyName: profile.name.familyName,
            givenName: profile.name.givenName
          },
          email: profile._json.email,
          last_login: new Date(),
          strategy: profile.provider
        },
        { upsert: true, new: true } // Create a new document if no user exists
      );

      // Return user details
      return done(null, {
        email: user.email,
        id: user._id,
        name: user.name,
        picture: user.picture,
        accessToken: accessToken,
      });
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
      return res.json({ email: user.email, token});
    })(req, res, next); // Pass the 'next' function as an argument to the authentication callback
  },
};
