import React from 'react'
import styles from "./menu.module.css";
import { getFavorites, getPopular } from '@/src/getData';
import Card from '../card/Card';

const Menu = async ({ type, cat, country }) => {

  const favorites  = await getFavorites(cat, country);
  const popular  = await getPopular(cat, country);

  return (
    <>{favorites?.length > 4 &&
    <div className={styles.container}>
      <div className={styles.header}>
          <div className={styles.leftHeader}>
              <h2 className={styles.subTitleSecondary}>What's hot</h2>
              <h1 className={styles.titleSecondary}>Favorites</h1>
          </div>
      </div>
      <div className={styles.cardsWrapper}>
          {favorites?.map((post)=>(
            <div key={post._id}>
              <Card post={post} imgSize="sm" type={type} />
            </div>
          ))}
      </div>
      <div className={styles.header}>
          <div className={styles.leftHeader}>
              <h2 className={styles.subTitleSecondary}>Most read posts</h2>
              <h1 className={styles.titleSecondary}>Popular</h1>
          </div>
      </div>
      <div className={styles.cardsWrapper}>
          {popular?.map((post)=>(
            <div key={post._id}>
              <Card post={post} type={type} />
            </div>
          )).slice(0,5)}
      </div>
    </div>
    }</>
  )
}

export default Menu