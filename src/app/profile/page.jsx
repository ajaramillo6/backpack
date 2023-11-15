"use client"
import React from 'react';
import styles from "./profilePage.module.css";
import useSWR from 'swr';
import { fetcher } from '@/src/getData';
import Card from '@/src/components/card/Card';
import Spinner from '@/src/components/spinner/Spinner';
import Image from 'next/image';
import Pagination from '@/src/components/pagination/Pagination';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const ProfilePage = ({ searchParams}) => {

  const { status } = useSession();
  const router = useRouter();

  if(status === "loading"){
    return (
      <div className={styles.container}>
        <Spinner />
      </div>
    )
  };

  const page = parseInt(searchParams?.page) || 1;
  const country = searchParams?.country;
  const cat = searchParams?.cat;
  const userName = searchParams?.user;

  const getData = () => {
    if(status === 'authenticated'){
      const { data, isLoading } = useSWR(
        `http://localhost:3000/api/profile?user=${userName}&page=${page}&cat=${cat || ""}&country=${country || ""}`,
        fetcher
      );
      return { data, isLoading }
    } else {
      router.push("/");
    }
  }

  const posts = getData();

  const POST_PER_PAGE = 4;

  const havePrev = POST_PER_PAGE * (page - 1) > 0;

  const haveNext = POST_PER_PAGE * (page - 1) + POST_PER_PAGE < posts?.data?.count;

  return (
    <div className={styles.container}>
      <div className={styles.profileWrapper}>
        <div className={styles.imgWrapper}>
          <Image 
            className={styles.image}
            src={posts?.data?.posts.filter((post)=>post.user.name === userName)[0]?.user.image} 
            alt="" 
            layout='fill' />
        </div>
        <h1 className={styles.title}>{`${userName}'s posts`}</h1>
      </div>
      {posts?.isLoading
        ? <div className={styles.wrapper}><Spinner /></div>
        : <div className={styles.wrapper}>
          {posts?.data?.posts?.length > 0
              ? <div>
                  {posts?.data?.posts?.map((post)=>(
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