import { NextRequest, NextResponse } from "next/server";

import serverAuth from "@/libs/serverAuth";
import prisma from "@/libs/prismadb";

export const PATCH = async (req: NextRequest, res: NextResponse) => {
  try {
    const currentUser = await serverAuth();

    const { name, username, bio, profileImage, coverImage } = await req.json();

    if (!name || !username) {
      return NextResponse.json(
        { message: "Name and username are required" },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: currentUser.id },
      data: { name, username, bio, profileImage, coverImage },
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
