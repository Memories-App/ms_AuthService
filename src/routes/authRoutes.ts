import express from 'express';
import passport from 'passport';
import { AuthController } from '../controllers/AuthController';

const router = express.Router();

// Google Authentication
router.get('/google', AuthController.authenticateWithGoogle);
router.post('/token/verify', AuthController.verifyToken);
router.get('/google/callback', AuthController.handleGoogleCallback);

// Apple Authentication


export default router;
