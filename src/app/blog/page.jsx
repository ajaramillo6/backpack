import React from 'react'
import styles from "./blogPage.module.css";
import CardList from '@/src/components/cardList/CardList';
import Menu from '@/src/components/menu/Menu';
import CountryFilter from '@/src/components/countryFilter/CountryFilter';

const BlogPage = ({ searchParams }) => {

  const page = parseInt(searchParams.page) || 1;
  const { cat } = searchParams;

  return (
    <div className={styles.container}>
        <div className={styles.top}>
            <div className={styles.pickedCategory}>{ cat }</div>
            <CountryFilter />
        </div>
        <div className={styles.content}>
            <CardList page={page} cat={cat} type={"blog"} />
            <Menu cat={cat} type={"blog"} />
        </div>
    </div>
  )
}

export default BlogPage;