import { NextRequest, NextResponse } from "next/server";

import prisma from "@/libs/prismadb";

export const GET = async (req: NextRequest, res: NextResponse) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(users);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 400 }
    );
  }
};
