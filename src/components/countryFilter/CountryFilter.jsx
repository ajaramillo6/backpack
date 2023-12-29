"use client";

import React from 'react'
import styles from './countryFilter.module.css';

//Components
import FilterOption from '../filterOption/FilterOption';

//Access data
import { fetcher } from '@/src/getData';
import useSWR from 'swr';

const CountryFilter = ({cat}) => {

  //Data fetching
  const getData = () => {
    const { data, isLoading } = useSWR(
      `https://backpack-links.vercel.app/api/popular?cat=${cat || ""}`,
      fetcher
    );
    return { data, isLoading }
  }

  //Call data fetch function
  const posts = getData();

  return (
    <div className={styles.container}>
      <FilterOption posts={posts?.data} cat={cat} />
    </div>
  )
}

export default CountryFilter