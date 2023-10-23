import prisma from "@/src/app/utils/connect";
import { NextResponse } from "next/server";

// GET FAVORITE POSTS
export const GET = async (req) => {

  const { searchParams } = new URL(req.url);
  const cat = searchParams.get("cat");

  try {
    const favorites = await prisma.post.findMany({
      orderBy: [
        {
          likes: 'desc',
        },
      ],
      where: {
        ...(cat && { catSlug: cat }),
      },
      include: { user: true },
    });
    return new NextResponse(JSON.stringify(favorites, { status: 200 }));
  } catch (err) {
    console.log(err);
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong!" }, { status: 500 })
    );
  }
};