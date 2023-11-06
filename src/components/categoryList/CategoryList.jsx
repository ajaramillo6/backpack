import React from 'react'
import styles from "./categoryList.module.css";
import Link from 'next/link';

const CategoryList = () => {

  const categories = [
    "Recently Added", 
    "Favorites",
    "Popular",
  ];

  return (
    <div className={styles.container}>
      <div className={styles.categories}>
        {categories.map((item, idx)=>(
        <div key={idx} className={styles.category}>
          <div className={styles.text}>{item}</div>
        </div>
        ))}
      </div>
    </div>
  )
}

export default CategoryList