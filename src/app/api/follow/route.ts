import { NextRequest, NextResponse } from "next/server";

import prisma from "@/libs/prismadb";
import serverAuth from "@/libs/serverAuth";

export const handler = async (req: NextRequest, res: NextResponse) => {
  try {
    const { userId } = await req.json();
    const currentUser = await serverAuth();

    if (!userId || typeof userId !== "string") {
      throw new Error("Invalid User ID");
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new Error("Invalid User ID");
    }

    let updatedFollowingIds = [...(user.followingIds || [])];

    if (req.method === "POST") {
      updatedFollowingIds.push(userId);

      try {
          await prisma.notification.create({
            data: {
              body: `@${currentUser.username} followed your tweet!`,
              userId
            },
          });

          await prisma.user.update({
            where: {
              id: userId
            },
            data: {
              hasNotification: true,
            },
          });
      } catch (error) {
        console.log(error);
      }
    }

    if (req.method === "DELETE") {
      updatedFollowingIds = updatedFollowingIds.filter(
        (followingId) => followingId !== userId
      );

      try {
        await prisma.notification.create({
          data: {
            body: `@${currentUser.username} unfollowed your tweet!`,
            userId,
          },
        });

        await prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            hasNotification: true,
          },
        });
      } catch (error) {
        console.log(error);
      }
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: currentUser.id,
      },
      data: {
        followingIds: updatedFollowingIds,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
};

export { handler as POST, handler as DELETE };
