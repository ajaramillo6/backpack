"use client";

import React from 'react'
import styles from "./menu.module.css";

//Access data
import useSWR from 'swr';
import { fetcher } from '@/src/getData';

//Components
import Spinner from '../spinner/Spinner';
import Card from '../card/Card';
import { Skeleton } from '../skeleton/Skeleton';

const Menu = ({ type, cat, country }) => {

  //Data fetching
  const getData = (list) => {
    const { data, isLoading } = useSWR(
      `http://localhost:3000/api/${list}?cat=${cat || ""}&country=${country || ""}`,
      fetcher
    );
    return { data, isLoading }
  }

  //Call data fetching function
  const favorites = getData("favorites")
  const popular = getData("popular")

  return (
  <>
    {favorites?.data?.length > 4 &&
    <div className={styles.container}>
      <div className={styles.header}>
          <div className={styles.leftHeader}>
              <h2 className={styles.subTitleSecondary}>What's hot</h2>
              <h1 className={styles.titleSecondary}>Favorites</h1>
          </div>
      </div>
      {favorites?.isLoading
        ? <div className={styles.cardsWrapper}>
          <Skeleton counter={5} type="favorites" />
        </div>
        :<div className={styles.cardsWrapper}>
            {favorites?.data?.map((post)=>(
              <div key={post._id}>
                <Card post={post} imgSize="sm" type={type} />
              </div>
            ))}
        </div>
      }
      <div className={styles.header}>
          <div className={styles.leftHeader}>
              <h2 className={styles.subTitleSecondary}>Most read posts</h2>
              <h1 className={styles.titleSecondary}>Popular</h1>
          </div>
      </div>
      {popular?.isLoading
      ? <div className={styles.cardsWrapper}>
        <Skeleton counter={5} type="popular" />
      </div>
      :<div className={styles.cardsWrapper}>
          {popular?.data?.map((post)=>(
            <div key={post._id}>
              <Card post={post} type={type} />
            </div>
          )).slice(0,5)}
      </div>
      }
    </div>
    }
  </>
  )
}

export default Menu