import { NextRequest, NextResponse } from "next/server";
import prisma from "@/libs/prismadb";

export const GET = async (
  req: NextRequest,
  { params }: { params: { postId: string } }
) => {
  try {
    const postId = params.postId;

    if (!postId || typeof postId !== "string") {
      return NextResponse.json({ error: "Invalid Post ID" }, { status: 400 });
    }
    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        user: true,
        comments: {
          include: {
            user: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 400 }
    );
  }
};
