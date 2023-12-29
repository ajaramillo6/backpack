"use client"
import React from 'react';
import styles from "./profilePage.module.css";

import { fetcher } from '@/src/getData';
import useSWR from 'swr';

//Tools
import { useSession } from 'next-auth/react';
import Image from 'next/image';

//Components
import Card from '@/src/components/card/Card';
import Spinner from '@/src/components/spinner/Spinner';
import Pagination from '@/src/components/pagination/Pagination';

const ProfilePage = ({ searchParams }) => {

  const { status } = useSession();

  const page = parseInt(searchParams?.page) || 1;
  const country = searchParams?.country;
  const cat = searchParams?.cat;
  const userName = searchParams?.user;

  const { data, isLoading } = useSWR(
    `https://backpack-links.vercel.app/api/profile?user=${userName}&page=${page}&cat=${cat || ""}&country=${country || ""}`,
    fetcher
  );

  if(status === "loading"){
    return (
      <div className={styles.container}>
        <Spinner />
      </div>
    )
  };

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
        <h1 className={styles.title}>{`${userName}'s posts`}</h1>
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

export default ProfilePage;