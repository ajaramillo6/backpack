import prisma from "@/src/utils/connect";
import { NextResponse } from "next/server";

export const dynamic = 'auto'
export const dynamicParams = true

// GET POPULAR POSTS
export const GET = async (req) => {

  const { searchParams } = new URL(req.url);
  const cat = searchParams.get("cat");
  const country = searchParams.get("country");

  try {
    const popular = await prisma.post.findMany({
      orderBy: [
        {
          views: 'desc',
        },
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
    return new NextResponse(JSON.stringify(popular, { status: 200 }));
  } catch (err) {
    console.log(err);
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong!" }, { status: 500 })
    );
  }
};