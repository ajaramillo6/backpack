import prisma from "@/src/app/utils/connect";
import { NextResponse } from "next/server";

// GET FAVORITE POSTS
export const GET = async (req) => {

  const { searchParams } = new URL(req.url);
  const cat = searchParams.get("cat");
  const country = searchParams.get("country");

  try {
    const favorites = await prisma.post.findMany({
      take: 5,
      orderBy: [
        {
          likes: 'desc',
        },
      ],
      where: {
        ...(cat && { catSlug: cat }),
        ...(country && { country }),
        published: true,
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