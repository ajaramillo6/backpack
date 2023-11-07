"use client"
import React from 'react';
import styles from "./profilePage.module.css";
import useSWR from 'swr';
import { fetcher } from '@/src/getData';
import Card from '@/src/components/card/Card';
import Spinner from '@/src/components/spinner/Spinner';
import Image from 'next/image';

const ProfilePage = ({ searchParams}) => {

  const page = parseInt(searchParams.page) || 1;
  const country = searchParams.country;
  const cat = searchParams.cat;
  const userName = searchParams.user;

  const { data, isLoading } = useSWR(
    `http://localhost:3000/api/profile?page=${page}&cat=${cat || ""}&country=${country || ""}`,
    fetcher
  );

  console.log(data)

  return (
    <div className={styles.container}>
      <div className={styles.profileWrapper}>
        <div className={styles.imgWrapper}>
          <Image 
            className={styles.image}
            src={data?.posts.filter((post)=>post.user.name === userName)[0].user.image} 
            alt="" 
            layout='fill' />
        </div>
        <h1 className={styles.title}>{`${userName}'s posts`}</h1>
      </div>
      {isLoading
        ? <div className={styles.wrapper}><Spinner /></div>
        : <div className={styles.wrapper}>
          {data?.posts?.filter((post)=>post.user.name === userName).map((post)=>(
            <Card post={post} imgSize="lg" />
          ))}
        </div>
      }
    </div>
  )
}

export default ProfilePage;