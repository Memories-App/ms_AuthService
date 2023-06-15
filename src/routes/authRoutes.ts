// authRoutes.ts

import express from 'express';
import { header } from 'express-validator';
import { AuthController } from '../controllers/AuthController';
import { GoogleProvider } from '../controllers/GoogleProvider';

const router = express.Router();

// Generate Authenticated Logic
router.post(
  '/exchangeToken',
  header('authorization' && 'provider').notEmpty().withMessage('Authorization token is required'),
  AuthController.exchangeAuthorizationTokenForJWT
);

router.post('/verifyToken', AuthController.verifyToken)

// Sign in with Google
router.post('/google/signout', GoogleProvider.signOut);
//router.post('/google/verify', GoogleProvider.verifyToken);

// Sign in with Apple

export default router;
