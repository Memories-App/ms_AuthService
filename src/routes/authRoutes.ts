import express from 'express';
import passport from 'passport';
import { AuthController } from '../controllers/AuthController';
import { GoogleProvider } from '../controllers/GoogleProvider';

const router = express.Router();

// Generate Authenticated Logic
router.post('/exchangeToken', AuthController.exchangeAuthorizationTokenForJWT);

// Sign in with Google
router.post('/google/signout', GoogleProvider.signOut);
router.post('/google/verify', GoogleProvider.verifyToken);

// Sign in with Apple




// router.get('/google', AuthController.authenticateWithGoogle); @Deprecated
// router.get('/google/callback', AuthController.handleGoogleCallback); @Deprecated

export default router;
