import { currentUser } from "@clerk/nextjs/server";
import { db } from "./prisma";

export const checkUser = async () => {
  try {
    const user = await currentUser();

    if (!user) {
      return null;
    }

    try {
      const loggedInUser = await db.user.findUnique({
        where: {
          clerkUserId: user.id,
        },
      });

      if (loggedInUser) {
        return loggedInUser;
      }

      const name = `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unknown User';

      const newUser = await db.user.create({
        data: {
          clerkUserId: user.id,
          name,
          imageUrl: user.imageUrl,
          email: user.emailAddresses?.[0]?.emailAddress || '',
        },
      });

      return newUser;
    } catch (error) {
      console.error('Database error in checkUser:', error);
      // Return null if database operation fails
      return null;
    }
  } catch (clerkError) {
    console.error('Clerk authentication error:', clerkError);
    // Return null if Clerk service is unavailable during development
    return null;
  }
};
