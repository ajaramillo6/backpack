import { NextResponse } from "next/server";
import prisma from "../../utils/connect";
import { getAuthSession } from "../../utils/auth";

export const GET = async (req)=>{

    const { searchParams } = new URL(req.url)

    const page = searchParams.get("page");
    const cat = searchParams.get("cat");
    const country = searchParams.get("country");

    const POST_PER_PAGE = 4;

    const query = {
        take: POST_PER_PAGE, 
        skip: POST_PER_PAGE * (page - 1),
        orderBy: [
          {
            createdAt: 'desc',
          },
        ],
        where: {
            ...(cat && { catSlug: cat }),
            ...(country && { country }),
        },
        include: { user: true },
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

// CREATE A POST
export const POST = async (req) => {
    const session = await getAuthSession();
  
    if(!session){
      return new NextResponse(
        JSON.stringify({ message: "Not Authenticated!" }, { status: 401 })
      );
    }
  
    try {
      const body = await req.json();
      const post = await prisma.post.create({
        data: { ...body, userName: session.user.name },
      });
  
      return new NextResponse(JSON.stringify(post, { status: 200 }));
    } catch (err) {
      console.log(err);
      return new NextResponse(
        JSON.stringify({ message: "Something went wrong!" }, { status: 500 })
      );
    }
  };

// DELETE A POST
export const DELETE = async (req) => {
  const session = await getAuthSession();

  if(!session){
    return new NextResponse(
      JSON.stringify({ message: "Not Authenticated!" }, { status: 401 })
    );
  }

  const body = await req.json();

  try {
    if(session.user.name === body.userName){
      await prisma.post.delete({
        where: { 
          id: body.id,
          slug: body.slug,
          userName: body.userName,
        },
      });
    } else {
      return new NextResponse(
        JSON.stringify({ message: "You are not allowed to delete this post!" }, { status: 500 })
      );
    }
    return new NextResponse.json({
      message: "Post deleted successfully"
    });
  } catch (err) {
    console.log(err);
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong!" }, { status: 500 })
    );
  }
};

// UPDATE A POST
export const PUT = async (req) => {
  const session = await getAuthSession();

  if(!session){
    return new NextResponse(
      JSON.stringify({ message: "Not Authenticated!" }, { status: 401 })
    );
  }

  try {
    const body = await req.json();
    const updatedPost = await prisma.post.update({
      where: {
        slug: body.slug,
      },
      data: { ...body, userName: session.user.name },
    });
    return new NextResponse(JSON.stringify(updatedPost, { status: 200 }));
  } catch (err) {
    console.log(err);
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong!" }, { status: 500 })
    );
  }
};