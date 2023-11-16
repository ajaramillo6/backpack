"use client";

import React from 'react'
import styles from "./suggestions.module.css";

//Access data
import useSWR from 'swr';
import { fetcher } from '@/src/getData';

//Components
import Spinner from '../spinner/Spinner';
import SearchCard from '../searchCard/SearchCard';

const Suggestions = ({ q, setQ }) => {

  //Fetch data
  const getData = (list) => {
    const { data, isLoading } = useSWR(
      `http://localhost:3000/api/${list}`,
      fetcher
    );
    return { data, isLoading }
  }

  //Call fetch data function
  const popular = getData("popular")

  //Filtering
  const posts = (q) => {
    return popular?.data?.filter((item)=>
      item.title.toLowerCase().includes(q) ||
      item.userName.toLowerCase().includes(q) ||
      item.catSlug.toLowerCase().includes(q) ||
      item.country.toLowerCase().includes(q)
    )
  }

  return (
    <div className={styles.container}>
      <p className={styles.header}>Suggestions</p>
      {popular?.isLoading ? (
        <div className={styles.cardsWrapper}><Spinner /></div>
      ):(<div className={styles.cardsWrapper}>
          {posts(q).length > 0 ? posts(q).map((post)=>(
            <div key={post._id}>
              <SearchCard post={post} setQ={setQ} />
            </div>
          )):<p style={{fontSize:"14px", color: "gray"}}>None found. Please try again.</p>}
        </div>
      )}
    </div>
  )
}

export default Suggestions