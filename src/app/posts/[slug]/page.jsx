"use client"
import React from 'react'
import styles from "./singlePage.module.css";
import { getPopular, getSinglePost } from '@/src/getData';
import SinglePageContent from '@/src/components/singlePageContent/singlePageContent';
import Spinner from '@/src/components/spinner/Spinner';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

const SinglePage = async ({ params }) => {

  const { status } = useSession();

  const router = useRouter();

  if(status === "loading"){
    return (
      <div className={styles.container}>
        <Spinner />
      </div>
    )
  };
  if(status === "unauthenticated"){
    router.push("/?user=undefined");
  };

  const { slug } = params;

  const post = await getSinglePost(slug);

  const recommended  = await getPopular(post?.catSlug);

  return (
    <div className={styles.container}>
        <SinglePageContent post={post} recommended={recommended} />
    </div>
  )
}

export default SinglePage