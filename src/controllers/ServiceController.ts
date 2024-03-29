import express from 'express';

const router = express.Router();

export const Servicecontroller = {
    getServices: async (req, res) => {
        try {
            
            return res.json({ 
                service: 'auth-service', 
                status: 'running',
                routes: [
                    {
                        method: 'GET',
                        path: '/',
                        description: 'Get all available routes and sercice information',
                    },
                    {
                        method: 'POST',
                        path: '/auth/exchangeToken',
                        description: 'Exchange ... for JWT',
                    },
                    {
                        method: 'POST',
                        path: '/auth/google/signout',
                        description: 'Sign out with Google',
                    },
                    {
                        method: 'POST',
                        path: '/auth/verifyToken',
                        description: 'Verify Google token',
                    },
                ]
             });
        }
        catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },
};