"use client"
import React, { useEffect, useState } from 'react';
import styles from "./draftPage.module.css";

import useSWR from 'swr';
import { fetcher } from '@/src/getData';

//Tools
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

//Components
import Pagination from '@/src/components/pagination/Pagination';
import Spinner from '@/src/components/spinner/Spinner';
import Card from '@/src/components/card/Card';
import Image from 'next/image';

const DraftPage = ({ searchParams }) => {

  const { status } = useSession();
  const router = useRouter();

  const page = parseInt(searchParams?.page) || 1;
  const userName = searchParams?.user;

  const { data, isLoading } = useSWR(
    `http://localhost:3000/api/drafts?user=${userName}&page=${page}`,
    fetcher
  );

  if(status === "loading"){
    return (
      <div className={styles.container}>
        <Spinner />
      </div>
    )
  };

  if(status !== 'authenticated'){
    router.push("/");
  }

  const POST_PER_PAGE = 4;

  const havePrev = POST_PER_PAGE * (page - 1) > 0;

  const haveNext = POST_PER_PAGE * (page - 1) + POST_PER_PAGE < data?.count;

  return (
    <div className={styles.container}>
      <div className={styles.profileWrapper}>
        {data?.posts.length > 0 &&
        <div className={styles.imgWrapper}>
          <Image 
            className={styles.image}
            src={data?.posts.filter((post)=>post.user.name === userName)[0]?.user.image} 
            alt="" 
            layout='fill' />
        </div>
        }
        <h1 className={styles.title}>{`${userName}'s Drafts`}</h1>
      </div>
      {isLoading
        ? <div className={styles.wrapper}><Spinner /></div>
        : <div className={styles.wrapper}>
          {data?.posts?.length > 0
              ? <div>
                  {data?.posts?.map((post)=>(
                      <Card post={post} imgSize="lg" />
                  ))}
              </div>
            :<span style={{color: "gray"}}>No posts found</span>}
        </div>
      }
      <Pagination
        page={page} 
        havePrev={havePrev} 
        haveNext={haveNext} 
        type="profile"
        user={userName}
      />
    </div>
  )
}

export default DraftPage