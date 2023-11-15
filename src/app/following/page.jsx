"use client"
import Spinner from '@/src/components/spinner/Spinner';
import { fetcher } from '@/src/getData';
import React from 'react'
import useSWR from 'swr';
import styles from "./followingPage.module.css";
import Pagination from '@/src/components/pagination/Pagination';
import Card from '@/src/components/card/Card';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const FollowingPage = ({ searchParams }) => {

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
  const userName = searchParams?.user;

  const getData = () => {
    if(status === 'authenticated'){
      const { data, isLoading } = useSWR(
        `http://localhost:3000/api/following?user=${userName}&page=${page}`,
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
    <div>
        <h1 className={styles.title}>Saved posts</h1>
        {posts?.isLoading
            ? <div className={styles.wrapper}><Spinner /></div>
            : <div className={styles.wrapper}>
              {posts?.data?.posts?.length > 0
              ? <div>
                  {posts?.data?.posts?.map((post)=>(
                      <Card post={post} imgSize="lg" />
                  ))}
              </div>
            :<span style={{color: "gray"}}>No posts have been saved</span>}
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

export default FollowingPage