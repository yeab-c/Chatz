import { clerkClient, getAuth } from "@clerk/express";
import { NextFunction, Request, Response } from "express";
import { prisma } from "../config/prisma";
import { AuthRequest } from "../middlewares/auth";

export async function getMe(req:AuthRequest, res: Response, next: NextFunction) {
    try {
        const userId = req.userId;

        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500);
        next();
    }
}

export async function authCallback(req: Request, res: Response, next: NextFunction) {
  try {
    const { userId: clerkId } = getAuth(req);

    if (!clerkId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    let user = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!user) {
      const clerkUser = await clerkClient.users.getUser(clerkId);

      user = await prisma.user.create({
        data: {
          clerkId,
          email: clerkUser.emailAddresses[0]?.emailAddress || '',
          name: clerkUser.firstName
            ? `${clerkUser.firstName} ${clerkUser.lastName || ''}`.trim()
            : clerkUser.emailAddresses[0]?.emailAddress.split('@')[0] || 'User',
          avatar: clerkUser.imageUrl,
        },
      });
    }

    res.json(user);
  } catch (error) {
    res.status(500);
    next(error);
  }
}
