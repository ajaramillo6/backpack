import React from 'react'
import styles from "./cardList.module.css";
import Pagination from '../pagination/Pagination';
import Card from '../card/Card';
import { getPosts } from "../../getData";

const CardList = async({ page, cat, type, country }) => {

  const { posts, count } = await getPosts(page, cat, country);

  const POST_PER_PAGE = 4;

  const havePrev = POST_PER_PAGE * (page - 1) > 0;

  const haveNext = POST_PER_PAGE * (page - 1) + POST_PER_PAGE < count;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Recently Added</h1>
        <h1 className={styles.all}>SEE ALL</h1>
      </div>
      <div className={styles.posts}>
        {posts?.map((post, idx)=>(
          <Card key={idx} post={post} imgSize="lg" type={type} />
        ))}
      </div>
      <Pagination 
        page={page} 
        havePrev={havePrev} 
        haveNext={haveNext} 
      />
    </div>
  )
}

export default CardList