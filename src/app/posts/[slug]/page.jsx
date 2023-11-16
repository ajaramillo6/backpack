"use client";

import React from 'react'
import styles from "./singlePage.module.css";

//Components
import SinglePageContent from '@/src/components/singlePageContent/singlePageContent';
import Spinner from '@/src/components/spinner/Spinner';

//Access data
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

const SinglePage = ({ params }) => {

  //Find authentication status
  const { status } = useSession();

  //Params
  const { slug } = params;

  const router = useRouter();

  //Handle loading and unauthentication access
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

  return (
    <div className={styles.container}>
        <SinglePageContent slug={slug} />
    </div>
  )
}

export default SinglePage