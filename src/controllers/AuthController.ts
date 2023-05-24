import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { AuthService } from '../services/authService';

// import the schema from /models/User.ts
import User from '../models/user';
import { IncomingHttpHeaders } from 'http';

export const AuthController = {
  authenticateWithGoogle: passport.authenticate('google', {
    scope: ['profile', 'email', 'openid'],
  }),

  /**
   * Handle the POST request to verify a token and return user details.
   *
   * @param {Request} req - The request object.
   * @param {Response} res - The response object.
   * @returns {Promise<Response>} - A promise that resolves to the response JSON.
   * @throws {Error} - If the token is invalid or an error occurs during processing.
  verifyToken: async (req: Request, res: Response) => {
    const { authorization }: any = req.headers;

    try {
      const decoded = AuthService.verifyToken(authorization);
      
      // Extract the email and id of user from the payload
      const { email, id } = decoded;
      
      // Create or update the user in the database by email
      const user = await User.findOneAndUpdate(
        { email },
        { last_login: new Date() },
        { upsert: true, new: true }
        );
        
        // Respond with the user details
        return res.json({
          tokenValid: true,
          profile: {
            username: user.name.givenName,
            email: user.email,
            id: user._id
          }
        });
      } catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
      }
    },
    */
    
    
    validateGoogleTokenWithPassport: (req: Request, res: Response, next: NextFunction) => {
    const { authorization }: any = req.headers;
    
    try {
      // Decode the JWT token
      const decoded = AuthService.verifyToken(authorization);
      
      // Access the OAuth access token from the decoded JWT
      const accessToken = decoded.accessToken;

      // Set the Authorization header with the access token
      req.headers['authorization'] = `Bearer ${accessToken}`;

      // Continue to passport.authenticate
      passport.authenticate('google', { scope: ['email'], session: false }, (err, user, info) => {
        console.log(info)

        if (err || !user) {
          console.error(err);
          return res.status(401).json({ error: 'Google authentication failed', message: err.message });
        } else {
          console.log("Google authentication successful");

          return res.json({ message: 'Google authentication successful' });
        }
      })(req, res, next);
    } catch (error) {
      console.error(error);
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
        { upsert: true, new: true }
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
      return res.json({ email: user.email, token });
    })(req, res, next); // Pass the 'next' function as an argument to the authentication callback
  },

  // Placeholder for future Apple login integration
  authenticateWithApple: (req: Request, res: Response) => {
    // Implement Apple authentication logic here
    res.status(501).json({ error: 'Apple authentication not implemented' });
  },
};
