import express from 'express';
import passport from 'passport';
import { AuthController } from '../controllers/AuthController';

const router = express.Router();

// Google Authentication
router.get('/google', AuthController.authenticateWithGoogle);
router.get('/google/callback', AuthController.handleGoogleCallback);

// Add more authentication routes as needed

export default router;
