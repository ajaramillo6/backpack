import React from 'react'
import styles from './countryFilter.module.css';
import { getPopular } from '@/src/getData';
import FilterOption from '../filterOption/FilterOption';

const CountryFilter = async({cat}) => {

  const posts = await getPopular(cat);

  return (
    <div className={styles.container}>
      <FilterOption posts={posts} cat={cat} />
    </div>
  )
}

export default CountryFilter