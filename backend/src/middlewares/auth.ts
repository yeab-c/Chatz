import { getAuth, requireAuth } from '@clerk/express';
import type { NextFunction, Request, Response } from 'express';
import { prisma } from '../config/prisma';

export type AuthRequest = Request & {
  userId?: string;
}

// Checks if the user is authenticated and exists in the database
export const protectedRoute = [
    requireAuth(),
    async (req:AuthRequest, res:Response, next:NextFunction) => {

        try {
            // Get the authenticated user's Clerk ID
            const { userId: clerkId } = getAuth(req);
            if (!clerkId) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
            
            // Check if the user exists in the database
            const user = await prisma.user.findUnique({ where: { clerkId } });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Attach the user ID to the request object for downstream use
            req.userId = user.id;

            next();
        } catch (error) {
            console.error('Error in protectedRoute middleware:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
]