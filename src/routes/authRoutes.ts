import express from 'express';
import passport from 'passport';
import { AuthController } from '../controllers/AuthController';

const router = express.Router();

// Google Authentication
router.get('/google', AuthController.authenticateWithGoogle);
router.post('/google/verify', AuthController.verifyToken);
router.post('/google/exchangeToken', AuthController.exchangeAuthorizationTokenForJWT);
router.get('/google/callback', AuthController.handleGoogleCallback);

// Apple Authentication


export default router;
