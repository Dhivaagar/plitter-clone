import { NextRequest, NextResponse } from "next/server";
import serverAuth from "@/libs/serverAuth";

export const GET = async (req: NextRequest) => {
  try {
    const currentUser = await serverAuth();

    return NextResponse.json(currentUser, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
};
