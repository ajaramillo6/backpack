import React from 'react'
import styles from "./blogPage.module.css";
import CardList from '@/src/components/cardList/CardList';
import Menu from '@/src/components/menu/Menu';
import CountryFilter from '@/src/components/countryFilter/CountryFilter';

export const dynamic = 'auto'
export const dynamicParams = true

const BlogPage = ({ searchParams }) => {

  const page = parseInt(searchParams.page) || 1;
  const { cat } = searchParams;
  const country = searchParams.country

  return (
    <div className={styles.container}>
        <div className={styles.top}>
            <div className={styles.pickedCategory}>{ cat }</div>
            <CountryFilter cat={cat} />
        </div>
        <div className={styles.content}>
            <CardList page={page} cat={cat} type={"blog"} country={country} />
            <Menu cat={cat} type={"blog"} country={country} />
        </div>
    </div>
  )
}

export default BlogPage;