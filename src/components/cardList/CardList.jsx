"use client"
import React from 'react'
import styles from "./cardList.module.css";
import Pagination from '../pagination/Pagination';
import Card from '../card/Card';
import { fetcher } from "../../getData";
import useSWR from 'swr';
import Spinner from '../spinner/Spinner';

const CardList = ({ page, cat, type, country }) => {

  const { data, isLoading } = useSWR(
    `http://localhost:3000/api/posts?page=${page}&cat=${cat || ""}&country=${country || ""}`,
    fetcher
  );

  const POST_PER_PAGE = 4;

  const havePrev = POST_PER_PAGE * (page - 1) > 0;

  const haveNext = POST_PER_PAGE * (page - 1) + POST_PER_PAGE < data?.count;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Recently Added</h1>
      </div>
      {isLoading
      ? <div className={styles.posts}>
          <Spinner />
        </div>
      :<>
        {data?.posts?.length > 0 ?
        <div className={styles.posts}>
          {data?.posts?.map((post)=>(
            <div key={post._id}>
              <Card post={post} imgSize="lg" type={type} />
            </div>
          ))}
        </div>
        :<div>
            No posts available!
        </div>}
      </>}
      <Pagination 
        page={page} 
        havePrev={havePrev} 
        haveNext={haveNext} 
      />
    </div>
  )
}

export default CardList