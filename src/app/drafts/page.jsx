"use client"
import React, { useEffect, useState } from 'react';
import styles from "./draftPage.module.css";

import useSWR from 'swr';
import { fetcher } from '@/src/getData';

//Tools
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';

//Components
import Pagination from '@/src/components/pagination/Pagination';
import Spinner from '@/src/components/spinner/Spinner';
import Card from '@/src/components/card/Card';
import Image from 'next/image';

const DraftPage = () => {

  const searchParams = useSearchParams();

  const { status, data } = useSession();
  const router = useRouter();

  const page = parseInt(searchParams?.page) || 1;
  const userName = searchParams?.user;
  const userEmail = data?.user?.email;

  const items = useSWR(
    `https://backpack-links.vercel.app/api/drafts?user=${userName}&page=${page}`,
    fetcher
  );

  const [authorized, setAuthorized] = useState(true);

  useEffect(()=>{
    if((userEmail === 'megandunnavant4@gmail.com') || (userEmail === 'laurenjdunnavant@gmail.com')){
      setAuthorized(true);
    } else {
      setAuthorized(false);
    }
  },[userEmail])


  if(status === "loading"){
    return (
      <div className={styles.container}>
        <Spinner />
      </div>
    )
  };

  if((status !== 'authenticated') || !authorized){
    router.push("/");
  }

  const POST_PER_PAGE = 4;

  const havePrev = POST_PER_PAGE * (page - 1) > 0;

  const haveNext = POST_PER_PAGE * (page - 1) + POST_PER_PAGE < items?.data?.count;

  return (
    <div className={styles.container}>
      <div className={styles.profileWrapper}>
        {items?.data?.posts.length > 0 &&
        <div className={styles.imgWrapper}>
          <Image 
            className={styles.image}
            src={items?.data?.posts.filter((post)=>post.user.name === userName)[0]?.user.image} 
            alt="" 
            layout='fill' />
        </div>
        }
        <h1 className={styles.title}>{`${userName}'s Drafts`}</h1>
      </div>
      {items?.isLoading
        ? <div className={styles.wrapper}><Spinner /></div>
        : <div className={styles.wrapper}>
          {items?.data?.posts?.length > 0
              ? <div>
                  {items?.data?.posts?.map((post)=>(
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