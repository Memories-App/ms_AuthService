import express, { NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { AuthController } from './src/controllers/AuthController';
import authRoutes from './src/routes/authRoutes';

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(passport.initialize());

// Configure Google OAuth2 strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || '793120661200-350a0nbfdepli2fjo8r79phpk2i94old.apps.googleusercontent.com',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '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',
      callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:2902/auth/google/callback',
    },
    AuthController.authenticateWithGoogle
  )
);

// Routes
app.get('/', (req: Request, res: Response) => {
  res.json({ service: 'auth-service', status: 'running' });
});

app.use('/auth', authRoutes); // Mount the authRoutes middleware

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});