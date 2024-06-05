import { NextRequest, NextResponse } from "next/server";

import prisma from "@/libs/prismadb";
import serverAuth from "@/libs/serverAuth";

export const POST = async (req: NextRequest, res: NextResponse) => {
  try {
    const currentUser = await serverAuth();
    const { body } = await req.json();
    const { searchParams } = new URL(req.url);
    const postId = searchParams.get("postId");;

    if (!postId || typeof postId !== "string") {    
      throw new Error("Invalid Post ID");
    }

    const comment = await prisma.comment.create({
      data: {
        body,
        userId: currentUser.id,
        postId
      },
    });

    try {
      const post = await prisma.post.findUnique({
        where: {
          id: postId,
        },
      });

      if (post?.userId) {
        await prisma.notification.create({
          data: {
            body: `@${currentUser.username} commented on your post!`,
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

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
};

