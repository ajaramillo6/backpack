import React from 'react'
import styles from "./menu.module.css";
import Card from '../card/Card';
import { getFavorites, getPopular } from '@/src/getData';

const Menu = async ({ type, cat, currPost, country }) => {

  const favorites  = await getFavorites(cat, country);
  const popular  = await getPopular(cat, country);

  return (
    <div className={styles.container}>
      {type !== 'recommendations' &&
      <>
        <div className={styles.header}>
          <div className={styles.leftHeader}>
            <h2 className={styles.subTitleSecondary}>{"What's hot"}</h2>
            <h1 className={styles.titleSecondary}>Favorites</h1>
          </div>
          <h1 className={styles.all}>SEE ALL</h1>
        </div>
        {(type !== 'recommendations') &&
        <div className={styles.cardsWrapper}>
          {favorites?.map((post)=>(
            <Card post={post} imgSize="sm" key={post._id} type={type} />
          ))}
        </div>}
      </>}
      <div className={styles.header}>
        <div className={styles.leftHeader}>
          {type !== 'recommendations' && <h2 className={styles.subTitleSecondary}>{"Most read posts"}</h2>}
          <h1 className={type !== 'recommendations' ? styles.titleSecondary:styles.titleRecommendation}>{type === 'recommendations' ? 'Related Posts' : 'Popular'}</h1>
        </div>
        {type !== 'recommendations' && <h1 className={styles.all}>SEE ALL</h1>}
      </div>
      {type !== 'recommendations' ? 
      <div className={styles.cardsWrapper}>
      {popular?.map((post)=>(
        <Card post={post} type={type} />
      ))}
      </div>
      :<div className={styles.cardWrapperRecommendation}>
        {popular?.filter((post)=>post?.catSlug === currPost?.catSlug).map((post)=>(
          <Card post={post} type={type} />
        ))}
      </div>}
    </div>
  )
}

export default Menu