import React from 'react'
import styles from "./menu.module.css";
import Card from '../card/Card';

const Menu = ({ type }) => {


  const posts = [
    {
        id: 1,
        img: "/featured.jpg",
        category: "tropical",
        username: "Hazy",
        title: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
        date: "5 days ago",
        likes: 120000,
    },
    {
        id: 2,
        img: "/featured.jpg",
        category: "beach",
        username: "Hazy",
        title: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
        date: "5 days ago",
        likes: 120000,
    },
    {
        id: 3,
        img: "/featured.jpg",
        category: "forest",
        username: "Hazy",
        title: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
        date: "5 days ago",
        likes: 120000,
    },
    {
        id: 4,
        img: "/featured.jpg",
        category: "lake",
        username: "Hazy",
        title: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
        date: "5 days ago",
        likes: 120000,
    }
]

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
        <div className={type !== 'recommendations' ? styles.cardsWrapper:styles.cardWrapperRecommendation}>
        {posts.map((post)=>(
          <Card post={post} type="sm" />
        ))}
        </div>
      </>}
      <div className={styles.header}>
        <div className={styles.leftHeader}>
          {type !== 'recommendations' && <h2 className={styles.subTitleSecondary}>{"Most read posts"}</h2>}
          <h1 className={type !== 'recommendations' ? styles.titleSecondary:styles.titleRecommendation}>{type === 'recommendations' ? 'Related Posts' : 'Popular'}</h1>
        </div>
        {type !== 'recommendations' && <h1 className={styles.all}>SEE ALL</h1>}
      </div>
      <div className={type !== 'recommendations' ? styles.cardsWrapper:styles.cardWrapperRecommendation}>
      {posts.map((post)=>(
        <Card post={post} type={type !== 'recommendations' ? "smImg":"recommendationImg"} />
      ))}
      </div>
    </div>
  )
}

export default Menu