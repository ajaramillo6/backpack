"use client";

import React from 'react'
import styles from "./cardList.module.css";

//Access data
import { fetcher } from "../../getData";
import useSWR from 'swr';

//Components
import Pagination from '../pagination/Pagination';
import Card from '../card/Card';
import { Skeleton } from '../skeleton/Skeleton';

const CardList = ({ page, cat, type, country }) => {

  //Fetch data
  const { data, isLoading } = useSWR(
    `https://backpack-links.vercel.app/api/posts?page=${page}&cat=${cat || ""}&country=${country || ""}`,
    fetcher
  );

  //Set variables
  const POST_PER_PAGE = 4;
  const havePrev = POST_PER_PAGE * (page - 1) > 0;
  const haveNext = POST_PER_PAGE * (page - 1) + POST_PER_PAGE < data?.count;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Recently Added</h1>
      </div>
      {isLoading ? 
      (<div className={styles.posts}>
          <Skeleton type="recents" counter={POST_PER_PAGE} />
        </div>
      ):(<>
        {data?.posts?.length > 0 ?
          (<div className={styles.posts}>
            {data?.posts?.map((post)=>(
              <div key={post._id}>
                <Card post={post} imgSize="lg" type={type} />
              </div>
            ))}
          </div>
          ):(
          <div>
            No posts available!
          </div>)
        }
      </>)}
      <Pagination 
        page={page} 
        havePrev={havePrev} 
        haveNext={haveNext} 
      />
    </div>
  )
}

export default CardList