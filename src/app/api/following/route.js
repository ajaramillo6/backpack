import { getAuthSession } from "@/src/utils/auth";
import { NextResponse } from "next/server";
import prisma from "@/src/utils/connect";

export const GET = async (req)=>{

    const { searchParams } = new URL(req.url)

    const page = searchParams.get("page");
    const userName = searchParams.get("user");

    const POST_PER_PAGE = 4;

    const query = {
        include: { user: true },
        take: POST_PER_PAGE, 
        skip: POST_PER_PAGE * (page - 1),
        orderBy: [
          {
            createdAt: 'desc',
          },
        ],
        where: {
            following: {
              has: userName
            },
            published: true,
        },
    }

    try{
        const [posts, count] = await prisma.$transaction([
            prisma.post.findMany(
              query,
            ),
            prisma.post.count({ where: query.where }),
        ]);
        return new NextResponse(
            JSON.stringify(
                { posts, count }, 
                { status: 200 }
            )
        );

    }catch(err){
        console.log(err);
        return new NextResponse(
            JSON.stringify(
                { message: "Something went wrong!" }, 
                { status: 500 }
            )
        );
    }
}

// FOLLOW A POST
export const PUT = async (req) => {

  const session = await getAuthSession();
  if(!session){
    return new NextResponse(
      JSON.stringify({ message: "Not Authenticated!" }, { status: 401 })
    );
  }
  const body = await req.json();
  try {
    const post = await prisma.post.update({
      where: { 
        slug: body.slug,
      },
      data: { 
        following: { 
          set: body.array,
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