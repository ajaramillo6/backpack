import { NextResponse } from "next/server";
import prisma from "../../../utils/connect";

export const dynamic = 'auto'
export const dynamicParams = true

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
            ...(userName && { userName }),
            published: false,
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