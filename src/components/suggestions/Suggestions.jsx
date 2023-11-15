"use client"

import React from 'react'
import styles from "./suggestions.module.css";
import useSWR from 'swr';
import Spinner from '../spinner/Spinner';
import { fetcher } from '@/src/getData';
import SearchCard from '../searchCard/SearchCard';

const Suggestions = ({ q, setQ }) => {

  const getData = (list) => {
    const { data, isLoading } = useSWR(
      `http://localhost:3000/api/${list}`,
      fetcher
    );
    return { data, isLoading }
  }

  const popular = getData("popular")

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
      {popular?.isLoading
      ? <div className={styles.cardsWrapper}><Spinner /></div>
      :<div className={styles.cardsWrapper}>
          {posts(q).length > 0 ? posts(q).map((post)=>(
            <div key={post._id}>
              <SearchCard post={post} setQ={setQ} />
            </div>
          )):<p style={{fontSize:"14px", color: "gray"}}>None found. Please try again.</p>}
      </div>
      }
    </div>
  )
}

export default Suggestions