import { getAuthSession } from "@/src/app/utils/auth";
import prisma from "@/src/app/utils/connect";
import { NextResponse } from "next/server";

// GET SINGLE POST
export const GET = async (req, { params }) => {
  const { slug } = params;

  try {
    const post = await prisma.post.update({
      where: { slug },
      data: { 
        views: { 
          increment: 1 
        } 
      },
      include: { user: true },
    });

    return new NextResponse(JSON.stringify(post, { status: 200 }));
  } catch (err) {
    console.log(err);
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong!" }, { status: 500 })
    );
  }
};

// LIKE A POST
export const PUT = async (req, { params }) => {

  const session = await getAuthSession();

  if(!session){
    return new NextResponse(
      JSON.stringify({ message: "Not Authenticated!" }, { status: 401 })
    );
  }

  const { slug } = params;
  const body = await req.json();
  try {
    const post = await prisma.post.update({
      where: { 
        slug,
      },
      data: { 
        likes: { 
          set: body,
        } 
      },
    });

    return new NextResponse(JSON.stringify(post, { status: 200 }));
  } catch (err) {
    console.log(err);
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong!" }, { status: 500 })
    );
  }
};