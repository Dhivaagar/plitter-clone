import { NextRequest, NextResponse } from "next/server";

import prisma from "@/libs/prismadb";
import serverAuth from "@/libs/serverAuth";

export const handler = async (req: NextRequest, res: NextResponse) => {
  try {
    const { postId } = await req.json();
    const currentUser = await serverAuth();

    if (!postId || typeof postId !== "string")
      throw new Error("Invalid Post ID");

    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    });

    if (!post) throw new Error("Invalid Post ID");

    let updatedLikedIds = [...(post.likedIds || [])];
    if (req.method === "POST") {
      updatedLikedIds.push(currentUser.id);

      try {
        const post = await prisma.post.findUnique({
          where: {
            id: postId,
          },
        });

        if (post?.userId) {
          await prisma.notification.create({
            data: {
              body: `@${currentUser.username} liked your tweet!`,
              userId: post.userId,
            },
          });

          await prisma.user.update({
            where: {
              id: post.userId,
            },
            data: {
              hasNotification: true,
            },
          });
        }
      } catch (error) {
        console.log(error);
      }
    }
    if (req.method === "DELETE") {
      updatedLikedIds = updatedLikedIds.filter(
        (likedId) => likedId !== currentUser.id
      );
    }

    const updatedPost = await prisma.post.update({
      where: {
        id: postId,
      },
      data: {
        likedIds: updatedLikedIds,
      },
    });

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
};

export { handler as POST, handler as DELETE };
